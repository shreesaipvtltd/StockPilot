import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "manager", "staff", "employee"]);
export const requestStatusEnum = pgEnum("request_status", ["pending", "approved", "rejected", "fulfilled"]);
export const movementTypeEnum = pgEnum("movement_type", ["stock_in", "stock_out"]);

// Users table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: userRoleEnum("role").notNull().default("employee"),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  category: text("category").notNull(),
  vendor: text("vendor").notNull(),
  quantity: integer("quantity").notNull().default(0),
  totalQuantity: integer("total_quantity").notNull().default(0),
  reorderThreshold: integer("reorder_threshold").notNull().default(0),
  costPrice: decimal("cost_price", { precision: 10, scale: 2 }).notNull(),
  sellingPrice: decimal("selling_price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Stock In records
export const stockIns = pgTable("stock_ins", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  supplier: text("supplier").notNull(),
  notes: text("notes"),
  attachmentUrl: text("attachment_url"),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Stock Out Requests
export const stockOutRequests = pgTable("stock_out_requests", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").notNull().references(() => products.id),
  requesterId: integer("requester_id").notNull().references(() => users.id),
  quantity: integer("quantity").notNull(),
  purpose: text("purpose").notNull(),
  status: requestStatusEnum("status").notNull().default("pending"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  fulfilledBy: integer("fulfilled_by").references(() => users.id),
  fulfilledAt: timestamp("fulfilled_at"),
  confirmedBy: integer("confirmed_by").references(() => users.id),
  confirmedAt: timestamp("confirmed_at"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Stock Movements (audit log)
export const stockMovements = pgTable("stock_movements", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  productId: integer("product_id").notNull().references(() => products.id),
  type: movementTypeEnum("type").notNull(),
  quantity: integer("quantity").notNull(),
  referenceId: integer("reference_id"), // stockInId or stockOutRequestId
  userId: integer("user_id").notNull().references(() => users.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  stockIns: many(stockIns),
  stockOutRequests: many(stockOutRequests),
  stockMovements: many(stockMovements),
}));

export const productsRelations = relations(products, ({ many }) => ({
  stockIns: many(stockIns),
  stockOutRequests: many(stockOutRequests),
  stockMovements: many(stockMovements),
}));

export const stockInsRelations = relations(stockIns, ({ one }) => ({
  product: one(products, {
    fields: [stockIns.productId],
    references: [products.id],
  }),
  creator: one(users, {
    fields: [stockIns.createdBy],
    references: [users.id],
  }),
}));

export const stockOutRequestsRelations = relations(stockOutRequests, ({ one }) => ({
  product: one(products, {
    fields: [stockOutRequests.productId],
    references: [products.id],
  }),
  requester: one(users, {
    fields: [stockOutRequests.requesterId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [stockOutRequests.reviewedBy],
    references: [users.id],
  }),
  fulfiller: one(users, {
    fields: [stockOutRequests.fulfilledBy],
    references: [users.id],
  }),
}));

export const stockMovementsRelations = relations(stockMovements, ({ one }) => ({
  product: one(products, {
    fields: [stockMovements.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [stockMovements.userId],
    references: [users.id],
  }),
}));

// Zod Schemas for validation
export const insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3).max(50),
  password: z.string().min(6),
  email: z.string().email(),
  fullName: z.string().min(1),
}).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  role: true,
});

export const insertProductSchema = createInsertSchema(products, {
  name: z.string().min(1),
  sku: z.string().min(1),
  category: z.string().min(1),
  vendor: z.string().min(1),
  quantity: z.number().int().min(0),
  totalQuantity: z.number().int().min(0),
  reorderThreshold: z.number().int().min(0),
  costPrice: z.string(),
  sellingPrice: z.string(),
}).pick({
  name: true,
  sku: true,
  category: true,
  vendor: true,
  quantity: true,
  totalQuantity: true,
  reorderThreshold: true,
  costPrice: true,
  sellingPrice: true,
  description: true,
});

export const insertStockInSchema = createInsertSchema(stockIns, {
  productId: z.number().int(),
  quantity: z.number().int().min(1),
  supplier: z.string().min(1),
  createdBy: z.number().int(),
}).pick({
  productId: true,
  quantity: true,
  supplier: true,
  notes: true,
  attachmentUrl: true,
  createdBy: true,
});

export const insertStockOutRequestSchema = createInsertSchema(stockOutRequests, {
  productId: z.number().int(),
  requesterId: z.number().int(),
  quantity: z.number().int().min(1),
  purpose: z.string().min(1),
}).pick({
  productId: true,
  requesterId: true,
  quantity: true,
  purpose: true,
  status: true,
});

export const insertStockMovementSchema = createInsertSchema(stockMovements, {
  productId: z.number().int(),
  type: z.enum(["stock_in", "stock_out"]),
  quantity: z.number().int(),
  userId: z.number().int(),
}).pick({
  productId: true,
  type: true,
  quantity: true,
  referenceId: true,
  userId: true,
  notes: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type StockIn = typeof stockIns.$inferSelect;
export type InsertStockIn = z.infer<typeof insertStockInSchema>;

export type StockOutRequest = typeof stockOutRequests.$inferSelect;
export type InsertStockOutRequest = z.infer<typeof insertStockOutRequestSchema>;

export type StockMovement = typeof stockMovements.$inferSelect;
export type InsertStockMovement = z.infer<typeof insertStockMovementSchema>;
