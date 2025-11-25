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

  // AI4Trade.ai inspired agents
  const agents = [
    { id: "gemini-2.5", name: "Gemini 2.5 Flash", provider: "Google", color: "#00d4ff" },
    { id: "qwen3-max", name: "Qwen3 Max", provider: "Alibaba", color: "#00ffcc" },
    { id: "deepseek-v3.1", name: "DeepSeek Chat v3.1", provider: "DeepSeek", color: "#ff006e" },
    { id: "gpt-5", name: "GPT-5", provider: "OpenAI", color: "#ffbe0b" },
    { id: "claude-3.7", name: "Claude 3.7 Sonnet", provider: "Anthropic", color: "#8338ec" },
    { id: "minimax-m2", name: "MiniMax M2", provider: "MiniMax", color: "#3a86ff" },
  ];

  // Generate portfolio data with realistic trading returns
  const generatePortfolioData = () => {
    const portfolios: any = {};
    const baseReturn = 0.15; // 15% average return
    
    agents.forEach((agent) => {
      const variance = (Math.random() - 0.5) * 0.4;
      const dailyReturn = (baseReturn + variance) / 365;
      const daysTraded = 120;
      const compoundReturn = Math.pow(1 + dailyReturn, daysTraded) - 1;
      const portfolioValue = 10000 * (1 + compoundReturn);
      
      portfolios[agent.id] = {
        initialCapital: 10000,
        currentValue: portfolioValue,
        totalReturn: (compoundReturn * 100).toFixed(2),
        changeToday: ((Math.random() - 0.5) * 6).toFixed(2),
        trades: Math.floor(Math.random() * 150) + 50,
        winRate: (Math.random() * 40 + 45).toFixed(1),
      };
    });
    
    return portfolios;
  };

  // Live Performance API - Leaderboard data
  app.get("/api/leaderboard", async (req: Request, res: Response) => {
    try {
      const portfolios = generatePortfolioData();
      
      const leaderboard = agents
        .map((agent, idx) => {
          const portfolio = portfolios[agent.id];
          return {
            id: agent.id,
            name: agent.name,
            provider: agent.provider,
            color: agent.color,
            initialCapital: 10000,
            portfolioValue: Math.round(portfolio.currentValue),
            totalReturn: parseFloat(portfolio.totalReturn),
            changeToday: parseFloat(portfolio.changeToday),
            trades: portfolio.trades,
            winRate: parseFloat(portfolio.winRate),
            rank: idx + 1,
            trend: parseFloat(portfolio.changeToday) > 0 ? "up" : parseFloat(portfolio.changeToday) < 0 ? "down" : "stable",
            lastUpdated: new Date().toISOString(),
          };
        })
        .sort((a, b) => b.totalReturn - a.totalReturn)
        .map((agent, idx) => ({ ...agent, rank: idx + 1 }));

      res.json({
        period: "2024",
        activeAgents: agents.length,
        data: leaderboard,
        benchmark: {
          symbol: "QQQ",
          name: "QQQ Invesco",
          color: "#ff6b00",
          return: 28.5,
        },
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
  });

  // Live Performance API - Time series data (Portfolio evolution with live trading)
  app.get("/api/performance/timeseries", async (req: Request, res: Response) => {
    try {
      const period = (req.query.period as string) || "1M";
      const selectedAgentIds = (req.query.models as string)?.split(",") || ["gemini-2.5", "gpt-5"];
      
      // Generate hourly portfolio data (60-minute intervals)
      const dataPoints = period === "1D" ? 24 : period === "1W" ? 7 * 24 : period === "1M" ? 30 * 24 : 90 * 24;
      const timeSeries: any[] = [];
      
      const now = new Date();
      now.setMinutes(now.getMinutes(), 0, 0);
      
      // Initialize portfolio values with realistic trading returns
      const portfolioValues: any = {};
      const baseReturns: any = {};
      selectedAgentIds.forEach((agentId) => {
        portfolioValues[agentId] = 10000;
        baseReturns[agentId] = (Math.random() - 0.5) * 0.4; // variance in returns
      });
      
      // Generate realistic portfolio evolution with live trading impact
      for (let i = 0; i < dataPoints; i++) {
        const timestamp = new Date(now.getTime() - (dataPoints - i) * 3600000);
        const dataPoint: any = {
          timestamp: timestamp.toISOString(),
          time: timestamp.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
        };
        
        selectedAgentIds.forEach((agentId) => {
          // Base daily return (~15% average)
          const baseReturn = 0.15;
          const dailyReturn = (baseReturn + baseReturns[agentId]) / 365;
          
          // Add volatility and live trading impact
          const volatility = 0.03;
          const randomChange = (Math.random() - 0.5) * 2 * volatility;
          
          // Live trading impact (small random trades affecting portfolio)
          const tradingImpact = (Math.random() - 0.5) * 0.005;
          
          const hourlyReturn = dailyReturn / 24 + randomChange / 24 + tradingImpact;
          
          portfolioValues[agentId] *= (1 + hourlyReturn);
          dataPoint[agentId] = Math.round(portfolioValues[agentId] * 100) / 100;
        });
        
        timeSeries.push(dataPoint);
      }

      res.json({
        period,
        agents: selectedAgentIds,
        data: timeSeries,
        marketData: {
          market: "Nasdaq-100",
          granularity: "60-minute intervals",
          currency: "USD",
          initialCapital: 10000,
        },
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch time series data" });
    }
  });

  // Live Performance API - Real-time portfolio snapshots (for live updates)
  app.get("/api/performance/live", async (req: Request, res: Response) => {
    try {
      const selectedAgentIds = (req.query.models as string)?.split(",") || ["gemini-2.5", "gpt-5"];
      
      const liveData: any = {};
      
      selectedAgentIds.forEach((agentId) => {
        const baseReturn = 0.15;
        const variance = (Math.random() - 0.5) * 0.4;
        const dailyReturn = (baseReturn + variance) / 365;
        const daysTraded = 120;
        const compoundReturn = Math.pow(1 + dailyReturn, daysTraded) - 1;
        
        // Add minute-level trading impact
        const lastMinuteGain = (Math.random() - 0.5) * 2;
        const portfolioValue = 10000 * (1 + compoundReturn) * (1 + lastMinuteGain / 100000);
        
        liveData[agentId] = {
          portfolioValue: Math.round(portfolioValue * 100) / 100,
          dayChange: (Math.random() - 0.5) * 10,
          lastUpdate: new Date().toISOString(),
        };
      });

      res.json({
        data: liveData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch live portfolio data" });
    }
  });

  // Live Performance API - Stats summary
  app.get("/api/performance/stats", async (req: Request, res: Response) => {
    try {
      const portfolios = generatePortfolioData();
      
      // Find best agent
      let bestAgent = agents[0];
      let bestReturn = -Infinity;
      Object.entries(portfolios).forEach(([agentId, portfolio]: any) => {
        if (parseFloat(portfolio.totalReturn) > bestReturn) {
          bestReturn = parseFloat(portfolio.totalReturn);
          bestAgent = agents.find((a) => a.id === agentId) || agents[0];
        }
      });

      const stats = {
        activeAgents: 6,
        tradingPeriod: "Jan 1 - Apr 30, 2024",
        bestAgent: bestAgent.name,
        bestReturn: bestReturn.toFixed(2),
        benchmark: { symbol: "QQQ", return: 28.5 },
        market: "Nasdaq-100",
        initialCapital: 10000,
        lastUpdated: new Date().toISOString(),
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Live Performance API - Recent trading actions
  app.get("/api/performance/activity", async (req: Request, res: Response) => {
    try {
      const stocks = ["NVDA", "TSLA", "AAPL", "MSFT", "GOOGL", "AMZN", "META", "NFLX", "ADBE", "CRM"];
      const actions = ["BUY", "SELL", "HOLD"];
      
      const tradingActions = [];
      for (let i = 0; i < 12; i++) {
        const agent = agents[Math.floor(Math.random() * agents.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const stock = stocks[Math.floor(Math.random() * stocks.length)];
        const quantity = Math.floor(Math.random() * 100) + 10;
        const price = Math.round((Math.random() * 400 + 50) * 100) / 100;
        
        tradingActions.push({
          id: `trade-${i}`,
          type: "trade",
          timestamp: new Date(Date.now() - i * 600000).toISOString(),
          agentId: agent.id,
          agentName: agent.name,
          agentColor: agent.color,
          action,
          symbol: stock,
          quantity,
          price,
          totalValue: Math.round(quantity * price * 100) / 100,
        });
      }

      res.json({
        data: tradingActions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch trading activity" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
