import {
  users,
  products,
  stockIns,
  stockOutRequests,
  stockMovements,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type StockIn,
  type InsertStockIn,
  type StockOutRequest,
  type InsertStockOutRequest,
  type StockMovement,
  type InsertStockMovement,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, gte, lte } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProductBySku(sku: string): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getLowStockProducts(): Promise<Product[]>;
  
  // Stock In operations
  getStockIn(id: number): Promise<StockIn | undefined>;
  getAllStockIns(): Promise<StockIn[]>;
  getStockInsByProduct(productId: number): Promise<StockIn[]>;
  createStockIn(stockIn: InsertStockIn): Promise<StockIn>;
  
  // Stock Out Request operations
  getStockOutRequest(id: number): Promise<StockOutRequest | undefined>;
  getAllStockOutRequests(): Promise<StockOutRequest[]>;
  getStockOutRequestsByStatus(status: string): Promise<StockOutRequest[]>;
  getStockOutRequestsByRequester(requesterId: number): Promise<StockOutRequest[]>;
  createStockOutRequest(request: InsertStockOutRequest): Promise<StockOutRequest>;
  updateStockOutRequest(id: number, request: Partial<StockOutRequest>): Promise<StockOutRequest | undefined>;
  
  // Stock Movement operations
  getStockMovement(id: number): Promise<StockMovement | undefined>;
  getAllStockMovements(): Promise<StockMovement[]>;
  getStockMovementsByProduct(productId: number): Promise<StockMovement[]>;
  createStockMovement(movement: InsertStockMovement): Promise<StockMovement>;
  
  // Analytics operations
  getDashboardStats(): Promise<{
    totalProducts: number;
    lowStockCount: number;
    totalStockValue: number;
    activeUsers: number;
  }>;
  getStockInByCategory(): Promise<{ category: string; value: number }[]>;
  getStockOutByCategory(): Promise<{ category: string; value: number }[]>;
  getRecentActivity(): Promise<any[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductBySku(sku: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.sku, sku));
    return product || undefined;
  }

  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(products.name);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async getLowStockProducts(): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(sql`${products.quantity} < ${products.reorderThreshold}`);
  }

  // Stock In operations
  async getStockIn(id: number): Promise<StockIn | undefined> {
    const [stockIn] = await db.select().from(stockIns).where(eq(stockIns.id, id));
    return stockIn || undefined;
  }

  async getAllStockIns(): Promise<StockIn[]> {
    return await db.select().from(stockIns).orderBy(desc(stockIns.createdAt));
  }

  async getStockInsByProduct(productId: number): Promise<StockIn[]> {
    return await db
      .select()
      .from(stockIns)
      .where(eq(stockIns.productId, productId))
      .orderBy(desc(stockIns.createdAt));
  }

  async createStockIn(stockIn: InsertStockIn): Promise<StockIn> {
    const [newStockIn] = await db.insert(stockIns).values(stockIn).returning();
    
    // Update product quantity
    await db
      .update(products)
      .set({
        quantity: sql`${products.quantity} + ${stockIn.quantity}`,
        totalQuantity: sql`${products.totalQuantity} + ${stockIn.quantity}`,
        updatedAt: new Date(),
      })
      .where(eq(products.id, stockIn.productId));
    
    return newStockIn;
  }

  // Stock Out Request operations
  async getStockOutRequest(id: number): Promise<StockOutRequest | undefined> {
    const [request] = await db.select().from(stockOutRequests).where(eq(stockOutRequests.id, id));
    return request || undefined;
  }

  async getAllStockOutRequests(): Promise<StockOutRequest[]> {
    return await db.select().from(stockOutRequests).orderBy(desc(stockOutRequests.createdAt));
  }

  async getStockOutRequestsByStatus(status: string): Promise<StockOutRequest[]> {
    return await db
      .select()
      .from(stockOutRequests)
      .where(eq(stockOutRequests.status, status as any))
      .orderBy(desc(stockOutRequests.createdAt));
  }

  async getStockOutRequestsByRequester(requesterId: number): Promise<StockOutRequest[]> {
    return await db
      .select()
      .from(stockOutRequests)
      .where(eq(stockOutRequests.requesterId, requesterId))
      .orderBy(desc(stockOutRequests.createdAt));
  }

  async createStockOutRequest(request: InsertStockOutRequest): Promise<StockOutRequest> {
    const [newRequest] = await db.insert(stockOutRequests).values(request).returning();
    return newRequest;
  }

  async updateStockOutRequest(id: number, request: Partial<StockOutRequest>): Promise<StockOutRequest | undefined> {
    const [updated] = await db
      .update(stockOutRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(stockOutRequests.id, id))
      .returning();
    
    // If request is fulfilled, update product quantity
    if (request.status === "fulfilled" && updated) {
      // Defensive check: verify product has enough quantity
      const [product] = await db
        .select()
        .from(products)
        .where(eq(products.id, updated.productId))
        .limit(1);
      
      if (!product) {
        throw new Error("Product not found");
      }
      
      if (product.quantity < updated.quantity) {
        throw new Error(`Insufficient inventory. Available: ${product.quantity}, Requested: ${updated.quantity}`);
      }
      
      await db
        .update(products)
        .set({
          quantity: sql`${products.quantity} - ${updated.quantity}`,
          updatedAt: new Date(),
        })
        .where(eq(products.id, updated.productId));
    }
    
    return updated || undefined;
  }

  // Stock Movement operations
  async getStockMovement(id: number): Promise<StockMovement | undefined> {
    const [movement] = await db.select().from(stockMovements).where(eq(stockMovements.id, id));
    return movement || undefined;
  }

  async getAllStockMovements(): Promise<StockMovement[]> {
    return await db.select().from(stockMovements).orderBy(desc(stockMovements.createdAt));
  }

  async getStockMovementsByProduct(productId: number): Promise<StockMovement[]> {
    return await db
      .select()
      .from(stockMovements)
      .where(eq(stockMovements.productId, productId))
      .orderBy(desc(stockMovements.createdAt));
  }

  async createStockMovement(movement: InsertStockMovement): Promise<StockMovement> {
    const [newMovement] = await db.insert(stockMovements).values(movement).returning();
    return newMovement;
  }

  // Analytics operations
  async getDashboardStats() {
    const allProducts = await db.select().from(products);
    const lowStockProducts = await this.getLowStockProducts();
    const allUsers = await db.select().from(users);
    
    const totalStockValue = allProducts.reduce((sum, p) => {
      return sum + (parseFloat(p.sellingPrice) * p.quantity);
    }, 0);

    return {
      totalProducts: allProducts.length,
      lowStockCount: lowStockProducts.length,
      totalStockValue: Math.round(totalStockValue),
      activeUsers: allUsers.length,
    };
  }

  async getStockInByCategory() {
    const result = await db
      .select({
        category: products.category,
        value: sql<number>`SUM(${stockIns.quantity})::int`,
      })
      .from(stockIns)
      .innerJoin(products, eq(stockIns.productId, products.id))
      .groupBy(products.category);
    
    return result.map(r => ({ category: r.category, value: r.value || 0 }));
  }

  async getStockOutByCategory() {
    const result = await db
      .select({
        category: products.category,
        value: sql<number>`SUM(${stockOutRequests.quantity})::int`,
      })
      .from(stockOutRequests)
      .innerJoin(products, eq(stockOutRequests.productId, products.id))
      .where(eq(stockOutRequests.status, "fulfilled"))
      .groupBy(products.category);
    
    return result.map(r => ({ category: r.category, value: r.value || 0 }));
  }

  async getRecentActivity() {
    const recentStockIns = await db
      .select({
        id: stockIns.id,
        type: sql<string>`'stock-in'`,
        productId: stockIns.productId,
        userId: stockIns.createdBy,
        quantity: stockIns.quantity,
        createdAt: stockIns.createdAt,
      })
      .from(stockIns)
      .orderBy(desc(stockIns.createdAt))
      .limit(10);

    const recentRequests = await db
      .select({
        id: stockOutRequests.id,
        type: sql<string>`CASE 
          WHEN ${stockOutRequests.status} = 'approved' THEN 'approval'
          WHEN ${stockOutRequests.status} = 'rejected' THEN 'rejection'
          WHEN ${stockOutRequests.status} = 'fulfilled' THEN 'stock-out'
          ELSE 'pending'
        END`,
        productId: stockOutRequests.productId,
        userId: stockOutRequests.requesterId,
        quantity: stockOutRequests.quantity,
        createdAt: stockOutRequests.updatedAt,
      })
      .from(stockOutRequests)
      .where(sql`${stockOutRequests.status} IN ('approved', 'rejected', 'fulfilled')`)
      .orderBy(desc(stockOutRequests.updatedAt))
      .limit(10);

    const combined = [...recentStockIns, ...recentRequests]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 10);

    return combined;
  }
}

export const storage = new DatabaseStorage();
