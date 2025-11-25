import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  credits: decimal("credits").notNull().default("1.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const usageHistory = pgTable("usage_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  modelId: text("model_id").notNull(),
  provider: text("provider").notNull(),
  inputTokens: integer("input_tokens").notNull(),
  outputTokens: integer("output_tokens").notNull(),
  costUsd: decimal("cost_usd").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const rateLimits = pgTable("rate_limits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  endpoint: text("endpoint").notNull(),
  requestCount: integer("request_count").notNull().default(0),
  windowStart: timestamp("window_start").notNull().defaultNow(),
});

export const modelSettings = pgTable("model_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelId: text("model_id").notNull().unique(),
  displayName: text("display_name").notNull(),
  provider: text("provider").notNull(),
  inputCostPer1k: decimal("input_cost_per_1k").notNull(),
  outputCostPer1k: decimal("output_cost_per_1k").notNull(),
  maxTokens: integer("max_tokens").notNull(),
  contextLength: integer("context_length"),
  description: text("description"),
  architecture: jsonb("architecture"),
  supportedParameters: jsonb("supported_parameters"),
  isActive: boolean("is_active").notNull().default(true),
  metadata: jsonb("metadata"),
  lastSynced: timestamp("last_synced"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const syncJobs = pgTable("sync_jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  source: text("source").notNull(), // 'openrouter', 'huggingface', etc.
  status: text("status").notNull(), // 'pending', 'running', 'completed', 'failed'
  modelsCount: integer("models_count").default(0),
  errorMessage: text("error_message"),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUsageHistorySchema = createInsertSchema(usageHistory).omit({
  id: true,
  createdAt: true,
});

export const insertModelSettingsSchema = createInsertSchema(modelSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSyncJobSchema = createInsertSchema(syncJobs).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UsageHistory = typeof usageHistory.$inferSelect;
export type InsertUsageHistory = z.infer<typeof insertUsageHistorySchema>;
export type ModelSettings = typeof modelSettings.$inferSelect;
export type InsertModelSettings = z.infer<typeof insertModelSettingsSchema>;
export type RateLimit = typeof rateLimits.$inferSelect;
export type SyncJob = typeof syncJobs.$inferSelect;
export type InsertSyncJob = z.infer<typeof insertSyncJobSchema>;
