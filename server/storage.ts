import { 
  type User, 
  type InsertUser,
  type UsageHistory,
  type InsertUsageHistory,
  type ModelSettings,
  type InsertModelSettings,
  type RateLimit,
  users,
  usageHistory,
  modelSettings,
  rateLimits
} from "@shared/schema";
import { db } from "@db";
import { eq, and, desc, gte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: string, newCredits: string): Promise<void>;
  
  createUsageRecord(usage: InsertUsageHistory): Promise<UsageHistory>;
  getUserUsageHistory(userId: string, limit?: number): Promise<UsageHistory[]>;
  
  getModelSettings(modelId: string): Promise<ModelSettings | undefined>;
  getAllActiveModels(): Promise<ModelSettings[]>;
  createOrUpdateModelSettings(settings: InsertModelSettings): Promise<ModelSettings>;
  
  getRateLimit(userId: string, endpoint: string): Promise<RateLimit | undefined>;
  updateRateLimit(userId: string, endpoint: string, count: number): Promise<void>;
  resetRateLimitWindow(userId: string, endpoint: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUserCredits(userId: string, newCredits: string): Promise<void> {
    await db.update(users).set({ credits: newCredits }).where(eq(users.id, userId));
  }

  async createUsageRecord(usage: InsertUsageHistory): Promise<UsageHistory> {
    const result = await db.insert(usageHistory).values(usage).returning();
    return result[0];
  }

  async getUserUsageHistory(userId: string, limit: number = 50): Promise<UsageHistory[]> {
    return await db
      .select()
      .from(usageHistory)
      .where(eq(usageHistory.userId, userId))
      .orderBy(desc(usageHistory.createdAt))
      .limit(limit);
  }

  async getModelSettings(modelId: string): Promise<ModelSettings | undefined> {
    const result = await db
      .select()
      .from(modelSettings)
      .where(eq(modelSettings.modelId, modelId))
      .limit(1);
    return result[0];
  }

  async getAllActiveModels(): Promise<ModelSettings[]> {
    return await db
      .select()
      .from(modelSettings)
      .where(eq(modelSettings.isActive, 1));
  }

  async createOrUpdateModelSettings(settings: InsertModelSettings): Promise<ModelSettings> {
    const existing = await this.getModelSettings(settings.modelId);
    
    if (existing) {
      const result = await db
        .update(modelSettings)
        .set(settings)
        .where(eq(modelSettings.modelId, settings.modelId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(modelSettings).values(settings).returning();
      return result[0];
    }
  }

  async getRateLimit(userId: string, endpoint: string): Promise<RateLimit | undefined> {
    const result = await db
      .select()
      .from(rateLimits)
      .where(and(
        eq(rateLimits.userId, userId),
        eq(rateLimits.endpoint, endpoint)
      ))
      .limit(1);
    return result[0];
  }

  async updateRateLimit(userId: string, endpoint: string, count: number): Promise<void> {
    const existing = await this.getRateLimit(userId, endpoint);
    
    if (existing) {
      await db
        .update(rateLimits)
        .set({ requestCount: count })
        .where(and(
          eq(rateLimits.userId, userId),
          eq(rateLimits.endpoint, endpoint)
        ));
    } else {
      await db.insert(rateLimits).values({
        userId,
        endpoint,
        requestCount: count,
      });
    }
  }

  async resetRateLimitWindow(userId: string, endpoint: string): Promise<void> {
    await db
      .update(rateLimits)
      .set({ requestCount: 0, windowStart: new Date() })
      .where(and(
        eq(rateLimits.userId, userId),
        eq(rateLimits.endpoint, endpoint)
      ));
  }
}

export const storage = new DbStorage();
