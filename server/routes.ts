import type { Express } from "express";
import { createServer, type Server } from "http";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import { requireAuth, requireRole, type AuthRequest } from "./auth";
import {
  insertUserSchema,
  insertProductSchema,
  insertStockInSchema,
  insertStockOutRequestSchema,
} from "@shared/schema";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Inventory Management System API",
    version: "1.0.0",
    description: "Complete API documentation for the Inventory Management System",
    contact: {
      name: "API Support",
      email: "support@inventory.com",
    },
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  components: {
    securitySchemes: {
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          fullName: { type: "string" },
          role: { type: "string", enum: ["admin", "manager", "staff", "employee"] },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          sku: { type: "string" },
          category: { type: "string" },
          vendor: { type: "string" },
          quantity: { type: "integer" },
          totalQuantity: { type: "integer" },
          reorderThreshold: { type: "integer" },
          costPrice: { type: "string" },
          sellingPrice: { type: "string" },
          description: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      StockIn: {
        type: "object",
        properties: {
          id: { type: "integer" },
          productId: { type: "integer" },
          quantity: { type: "integer" },
          supplier: { type: "string" },
          notes: { type: "string" },
          attachmentUrl: { type: "string" },
          createdBy: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
        },
      },
      StockOutRequest: {
        type: "object",
        properties: {
          id: { type: "integer" },
          productId: { type: "integer" },
          requesterId: { type: "integer" },
          quantity: { type: "integer" },
          purpose: { type: "string" },
          status: { type: "string", enum: ["pending", "approved", "rejected", "fulfilled"] },
          approvedBy: { type: "integer" },
          rejectionReason: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      Error: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./server/routes.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export async function registerRoutes(app: Express): Promise<Server> {
  app.use("/api/docs", swaggerUi.serve);
  app.get("/api/docs", swaggerUi.setup(swaggerSpec));
  app.get("/api/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *               - fullName
   *               - email
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *               fullName:
   *                 type: string
   *               email:
   *                 type: string
   *               role:
   *                 type: string
   *                 enum: [admin, manager, staff, employee]
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Validation error or user already exists
   */
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - username
   *               - password
   *             properties:
   *               username:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Logout user
   *     tags: [Authentication]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: Logout successful
   */
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  /**
   * @swagger
   * /auth/me:
   *   get:
   *     summary: Get current user
   *     tags: [Authentication]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: Current user data
   *       401:
   *         description: Not authenticated
   */
  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const authReq = req as AuthRequest;
    res.json({ user: authReq.user });
  });

  /**
   * @swagger
   * /products:
   *   get:
   *     summary: Get all products
   *     tags: [Products]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: List of all products
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Product'
   */
  app.get("/api/products", requireAuth, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  /**
   * @swagger
   * /products/{id}:
   *   get:
   *     summary: Get product by ID
   *     tags: [Products]
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product data
   *       404:
   *         description: Product not found
   */
  app.get("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  /**
   * @swagger
   * /products:
   *   post:
   *     summary: Create a new product
   *     tags: [Products]
   *     security:
   *       - sessionAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - sku
   *               - category
   *               - vendor
   *               - costPrice
   *               - sellingPrice
   *             properties:
   *               name:
   *                 type: string
   *               sku:
   *                 type: string
   *               category:
   *                 type: string
   *               vendor:
   *                 type: string
   *               quantity:
   *                 type: integer
   *               reorderThreshold:
   *                 type: integer
   *               costPrice:
   *                 type: string
   *               sellingPrice:
   *                 type: string
   *               description:
   *                 type: string
   *     responses:
   *       201:
   *         description: Product created successfully
   *       400:
   *         description: Validation error
   *       403:
   *         description: Insufficient permissions
   */
  app.post("/api/products", requireAuth, requireRole("admin", "manager", "staff"), async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      
      const existingSku = await storage.getProductBySku(validatedData.sku);
      if (existingSku) {
        return res.status(400).json({ message: "SKU already exists" });
      }

      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  /**
   * @swagger
   * /products/{id}:
   *   put:
   *     summary: Update a product
   *     tags: [Products]
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Product updated successfully
   *       404:
   *         description: Product not found
   */
  app.put("/api/products/:id", requireAuth, requireRole("admin", "manager", "staff"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProductSchema.partial().parse(req.body);
      
      const product = await storage.updateProduct(id, validatedData);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  /**
   * @swagger
   * /products/{id}:
   *   delete:
   *     summary: Delete a product
   *     tags: [Products]
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Product deleted successfully
   *       404:
   *         description: Product not found
   */
  app.delete("/api/products/:id", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  /**
   * @swagger
   * /products/low-stock:
   *   get:
   *     summary: Get low stock products
   *     tags: [Products]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: List of low stock products
   */
  app.get("/api/products/low-stock", requireAuth, async (req, res) => {
    try {
      const products = await storage.getLowStockProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch low stock products" });
    }
  });

  /**
   * @swagger
   * /stock-in:
   *   get:
   *     summary: Get all stock-in records
   *     tags: [Stock In]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: List of stock-in records
   */
  app.get("/api/stock-in", requireAuth, async (req, res) => {
    try {
      const stockIns = await storage.getAllStockIns();
      res.json(stockIns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock-in records" });
    }
  });

  /**
   * @swagger
   * /stock-in:
   *   post:
   *     summary: Create a stock-in record
   *     tags: [Stock In]
   *     security:
   *       - sessionAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - productId
   *               - quantity
   *               - supplier
   *             properties:
   *               productId:
   *                 type: integer
   *               quantity:
   *                 type: integer
   *               supplier:
   *                 type: string
   *               notes:
   *                 type: string
   *               attachmentUrl:
   *                 type: string
   *     responses:
   *       201:
   *         description: Stock-in created successfully
   */
  app.post("/api/stock-in", requireAuth, requireRole("admin", "manager", "staff"), async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const validatedData = insertStockInSchema.parse({
        ...req.body,
        createdBy: authReq.user!.id,
      });
      
      const stockIn = await storage.createStockIn(validatedData);

      await storage.createStockMovement({
        productId: validatedData.productId,
        type: "stock_in",
        quantity: validatedData.quantity,
        referenceId: stockIn.id,
        userId: authReq.user!.id,
      });
      
      res.status(201).json(stockIn);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create stock-in record" });
    }
  });

  /**
   * @swagger
   * /stock-out:
   *   get:
   *     summary: Get all stock-out requests
   *     tags: [Stock Out]
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [pending, approved, rejected, fulfilled]
   *     responses:
   *       200:
   *         description: List of stock-out requests
   */
  app.get("/api/stock-out", requireAuth, async (req, res) => {
    try {
      const { status } = req.query;
      
      let requests;
      if (status && typeof status === "string") {
        requests = await storage.getStockOutRequestsByStatus(status);
      } else {
        requests = await storage.getAllStockOutRequests();
      }
      
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock-out requests" });
    }
  });

  /**
   * @swagger
   * /stock-out:
   *   post:
   *     summary: Create a stock-out request
   *     tags: [Stock Out]
   *     security:
   *       - sessionAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - productId
   *               - quantity
   *               - purpose
   *             properties:
   *               productId:
   *                 type: integer
   *               quantity:
   *                 type: integer
   *               purpose:
   *                 type: string
   *     responses:
   *       201:
   *         description: Stock-out request created successfully
   */
  app.post("/api/stock-out", requireAuth, async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const validatedData = insertStockOutRequestSchema.parse({
        ...req.body,
        requesterId: authReq.user!.id,
      });
      
      const request = await storage.createStockOutRequest(validatedData);
      
      res.status(201).json(request);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: fromZodError(error).message });
      }
      res.status(500).json({ message: "Failed to create stock-out request" });
    }
  });

  /**
   * @swagger
   * /stock-out/{id}/approve:
   *   post:
   *     summary: Approve a stock-out request
   *     tags: [Stock Out]
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Request approved successfully
   */
  app.post("/api/stock-out/:id/approve", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const id = parseInt(req.params.id);
      
      const request = await storage.updateStockOutRequest(id, {
        status: "approved",
        reviewedBy: authReq.user!.id,
        reviewedAt: new Date(),
      });
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to approve request" });
    }
  });

  /**
   * @swagger
   * /stock-out/{id}/reject:
   *   post:
   *     summary: Reject a stock-out request
   *     tags: [Stock Out]
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               rejectionReason:
   *                 type: string
   *     responses:
   *       200:
   *         description: Request rejected successfully
   */
  app.post("/api/stock-out/:id/reject", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const id = parseInt(req.params.id);
      const { rejectionReason } = req.body;
      
      const request = await storage.updateStockOutRequest(id, {
        status: "rejected",
        reviewedBy: authReq.user!.id,
        reviewedAt: new Date(),
        rejectionReason,
      });
      
      if (!request) {
        return res.status(404).json({ message: "Request not found" });
      }
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to reject request" });
    }
  });

  /**
   * @swagger
   * /stock-out/{id}/fulfill:
   *   post:
   *     summary: Fulfill a stock-out request
   *     tags: [Stock Out]
   *     security:
   *       - sessionAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Request fulfilled successfully
   */
  app.post("/api/stock-out/:id/fulfill", requireAuth, requireRole("admin", "manager", "staff"), async (req, res) => {
    try {
      const authReq = req as AuthRequest;
      const id = parseInt(req.params.id);
      
      const existingRequest = await storage.getStockOutRequest(id);
      if (!existingRequest) {
        return res.status(404).json({ message: "Request not found" });
      }

      // Prevent self-fulfillment - requester cannot fulfill their own request
      if (existingRequest.requesterId === authReq.user!.id) {
        return res.status(403).json({ message: "Cannot fulfill your own request" });
      }

      if (existingRequest.status !== "approved") {
        return res.status(400).json({ message: "Only approved requests can be fulfilled" });
      }

      // Check if product has sufficient quantity
      const product = await storage.getProduct(existingRequest.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      if (product.quantity < existingRequest.quantity) {
        return res.status(400).json({ 
          message: `Insufficient inventory. Available: ${product.quantity}, Requested: ${existingRequest.quantity}` 
        });
      }
      
      const request = await storage.updateStockOutRequest(id, {
        status: "fulfilled",
        fulfilledBy: authReq.user!.id,
        fulfilledAt: new Date(),
      });

      await storage.createStockMovement({
        productId: request!.productId,
        type: "stock_out",
        quantity: request!.quantity,
        referenceId: request!.id,
        userId: authReq.user!.id,
      });
      
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to fulfill request" });
    }
  });

  /**
   * @swagger
   * /analytics/dashboard:
   *   get:
   *     summary: Get dashboard statistics
   *     tags: [Analytics]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: Dashboard statistics
   */
  app.get("/api/analytics/dashboard", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  /**
   * @swagger
   * /analytics/stock-in-by-category:
   *   get:
   *     summary: Get stock-in analytics by category
   *     tags: [Analytics]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: Stock-in data by category
   */
  app.get("/api/analytics/stock-in-by-category", requireAuth, async (req, res) => {
    try {
      const data = await storage.getStockInByCategory();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock-in analytics" });
    }
  });

  /**
   * @swagger
   * /analytics/stock-out-by-category:
   *   get:
   *     summary: Get stock-out analytics by category
   *     tags: [Analytics]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: Stock-out data by category
   */
  app.get("/api/analytics/stock-out-by-category", requireAuth, async (req, res) => {
    try {
      const data = await storage.getStockOutByCategory();
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock-out analytics" });
    }
  });

  /**
   * @swagger
   * /analytics/recent-activity:
   *   get:
   *     summary: Get recent activity
   *     tags: [Analytics]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: Recent activity data
   */
  app.get("/api/analytics/recent-activity", requireAuth, async (req, res) => {
    try {
      const activities = await storage.getRecentActivity();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     security:
   *       - sessionAuth: []
   *     responses:
   *       200:
   *         description: List of all users
   */
  app.get("/api/users", requireAuth, requireRole("admin", "manager"), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
      res.json(usersWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
