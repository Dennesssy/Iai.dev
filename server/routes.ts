import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertUsageHistorySchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await storage.createUser({ username, password: hashedPassword });
      
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, credits: user.credits });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = insertUserSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      req.session.userId = user.id;
      res.json({ id: user.id, username: user.username, credits: user.credits });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Failed to login" });
    }
  });

  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Failed to logout" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    res.json({ id: user.id, username: user.username, credits: user.credits });
  });

  app.get("/api/models", async (req: Request, res: Response) => {
    try {
      const models = await storage.getAllActiveModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.get("/api/usage", async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    
    try {
      const history = await storage.getUserUsageHistory(req.session.userId);
      res.json(history);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch usage history" });
    }
  });

  // Live Performance API - Leaderboard data
  app.get("/api/leaderboard", async (req: Request, res: Response) => {
    try {
      const period = (req.query.period as string) || "1M";
      
      // Simulated live leaderboard data
      const leaderboard = [
        {
          id: "gpt-4o",
          name: "GPT-4o",
          provider: "OpenAI",
          score: 94.8,
          change: 2.3,
          rank: 1,
          trend: "up",
          color: "#10B981",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "claude-3.5-sonnet",
          name: "Claude 3.5 Sonnet",
          provider: "Anthropic",
          score: 93.2,
          change: 1.8,
          rank: 2,
          trend: "up",
          color: "#8B5CF6",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "gemini-2.0-pro",
          name: "Gemini 2.0 Pro",
          provider: "Google",
          score: 91.5,
          change: -0.5,
          rank: 3,
          trend: "down",
          color: "#3B82F6",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "deepseek-r1",
          name: "DeepSeek R1",
          provider: "DeepSeek",
          score: 89.7,
          change: 3.2,
          rank: 4,
          trend: "up",
          color: "#F59E0B",
          lastUpdated: new Date().toISOString(),
        },
        {
          id: "llama-3.3-70b",
          name: "Llama 3.3 70B",
          provider: "Meta",
          score: 87.3,
          change: 0.9,
          rank: 5,
          trend: "up",
          color: "#EF4444",
          lastUpdated: new Date().toISOString(),
        },
      ];

      res.json({
        period,
        data: leaderboard,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Live Performance API - Time series data
  app.get("/api/performance/timeseries", async (req: Request, res: Response) => {
    try {
      const period = (req.query.period as string) || "1M";
      const models = (req.query.models as string)?.split(",") || ["gpt-4o", "claude-3.5-sonnet"];
      
      // Generate time series data
      const dataPoints = period === "1D" ? 24 : period === "1W" ? 7 : period === "1M" ? 30 : 90;
      const timeSeries: any[] = [];
      
      const now = new Date();
      for (let i = 0; i < dataPoints; i++) {
        const timestamp = new Date(now.getTime() - (dataPoints - i) * 3600000);
        const dataPoint: any = {
          timestamp: timestamp.toISOString(),
          time: timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        };
        
        models.forEach((modelId) => {
          const baseScore = 85 + Math.random() * 10;
          const variance = Math.sin(i / 5) * 3;
          dataPoint[modelId] = baseScore + variance;
        });
        
        timeSeries.push(dataPoint);
      }

      res.json({
        period,
        models,
        data: timeSeries,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time series data" });
    }
  });

  // Live Performance API - Stats summary
  app.get("/api/performance/stats", async (req: Request, res: Response) => {
    try {
      const stats = {
        activeModels: 24,
        benchmarksPeriod: "2024-Q4",
        bestModel: "GPT-4o",
        bestScore: 94.8,
        avgChange: "+1.8%",
        totalBenchmarks: 12,
        lastUpdated: new Date().toISOString(),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Live Performance API - Recent activity
  app.get("/api/performance/activity", async (req: Request, res: Response) => {
    try {
      const activities = [
        {
          id: "1",
          type: "benchmark",
          modelId: "gpt-4o",
          modelName: "GPT-4o",
          message: "achieved new MMLU-Pro high",
          score: 94.8,
          timestamp: new Date(Date.now() - 300000).toISOString(),
        },
        {
          id: "2",
          type: "update",
          modelId: "claude-3.5-sonnet",
          modelName: "Claude 3.5 Sonnet",
          message: "updated to latest version",
          timestamp: new Date(Date.now() - 600000).toISOString(),
        },
        {
          id: "3",
          type: "release",
          modelId: "deepseek-r1",
          modelName: "DeepSeek R1",
          message: "now available for testing",
          timestamp: new Date(Date.now() - 900000).toISOString(),
        },
        {
          id: "4",
          type: "benchmark",
          modelId: "gemini-2.0-pro",
          modelName: "Gemini 2.0 Pro",
          message: "scored 91.5 on HumanEval",
          score: 91.5,
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
      ];

      res.json({
        data: activities,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
