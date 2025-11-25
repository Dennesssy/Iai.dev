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
      const provider = req.query.provider as string | undefined;
      const models = provider 
        ? await storage.getModelsByProvider(provider)
        : await storage.getAllActiveModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch models" });
    }
  });

  app.get("/api/models/:modelId", async (req: Request, res: Response) => {
    try {
      const model = await storage.getModelSettings(req.params.modelId);
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }
      res.json(model);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch model" });
    }
  });

  app.get("/api/providers", async (req: Request, res: Response) => {
    try {
      const models = await storage.getAllActiveModels();
      
      // Group models by provider
      const providerMap = new Map<string, any[]>();
      
      models.forEach(model => {
        if (!providerMap.has(model.provider)) {
          providerMap.set(model.provider, []);
        }
        providerMap.get(model.provider)!.push({
          id: model.modelId,
          name: model.displayName,
          inputCost: parseFloat(model.inputCostPer1k),
          outputCost: parseFloat(model.outputCostPer1k),
          contextLength: model.contextLength,
          maxTokens: model.maxTokens,
          description: model.description,
          supportedParameters: model.supportedParameters,
        });
      });

      const providers = Array.from(providerMap.entries()).map(([name, models]) => ({
        name,
        modelCount: models.length,
        models: models.sort((a, b) => a.name.localeCompare(b.name)),
      }));

      res.json({
        total: providers.length,
        providers: providers.sort((a, b) => b.modelCount - a.modelCount),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch providers" });
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

  // OpenRouter API - Fetch models and parameters
  app.get("/api/openrouter/models", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      // Fetch from OpenRouter API
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": apiKey ? `Bearer ${apiKey}` : "",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "LLMView Platform",
        },
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform to our format
      const models = data.data.map((model: any) => ({
        id: model.id,
        name: model.name,
        description: model.description,
        pricing: {
          prompt: parseFloat(model.pricing?.prompt || "0") * 1000000, // Convert to per 1M tokens
          completion: parseFloat(model.pricing?.completion || "0") * 1000000,
        },
        context_length: model.context_length,
        architecture: model.architecture,
        top_provider: model.top_provider,
        parameters: {
          modality: model.modality || "text",
          supported_generation_types: model.supported_generation_types || [],
        },
      }));

      res.json({
        total: models.length,
        models,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("OpenRouter API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch OpenRouter models",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // OpenRouter API - Get specific model details
  app.get("/api/openrouter/models/:modelId", async (req: Request, res: Response) => {
    try {
      const { modelId } = req.params;
      const apiKey = process.env.OPENROUTER_API_KEY;
      
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": apiKey ? `Bearer ${apiKey}` : "",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "LLMView Platform",
        },
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const model = data.data.find((m: any) => m.id === modelId);
      
      if (!model) {
        return res.status(404).json({ error: "Model not found" });
      }

      res.json({
        id: model.id,
        name: model.name,
        description: model.description,
        pricing: {
          prompt: parseFloat(model.pricing?.prompt || "0") * 1000000,
          completion: parseFloat(model.pricing?.completion || "0") * 1000000,
        },
        context_length: model.context_length,
        architecture: model.architecture,
        top_provider: model.top_provider,
        parameters: model,
      });
    } catch (error) {
      console.error("OpenRouter API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch model details",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Hugging Face API - Fetch models
  app.get("/api/huggingface/models", async (req: Request, res: Response) => {
    try {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      const limit = parseInt(req.query.limit as string) || 50;
      const search = req.query.search as string || "";
      
      // Fetch from Hugging Face Inference API models endpoint
      const url = new URL("https://huggingface.co/api/models");
      url.searchParams.set("limit", limit.toString());
      url.searchParams.set("sort", "trending");
      url.searchParams.set("filter", "text-generation");
      if (search) url.searchParams.set("search", search);

      const response = await fetch(url.toString(), {
        headers: apiKey ? { "Authorization": `Bearer ${apiKey}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Transform to our format
      const models = data.map((model: any) => ({
        id: model.id,
        name: model.id.split("/").pop() || model.id,
        author: model.author || model.id.split("/")[0],
        downloads: model.downloads || 0,
        likes: model.likes || 0,
        tags: model.tags || [],
        pipeline_tag: model.pipeline_tag || "text-generation",
        library_name: model.library_name,
        created_at: model.createdAt,
        last_modified: model.lastModified,
        private: model.private || false,
        gated: model.gated || false,
        parameters: {
          size: model.safetensors?.total || null,
          architecture: model.config?.model_type || null,
        },
      }));

      res.json({
        total: models.length,
        models,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Hugging Face API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch Hugging Face models",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Hugging Face API - Get specific model details
  app.get("/api/huggingface/models/:author/:model", async (req: Request, res: Response) => {
    try {
      const { author, model } = req.params;
      const modelId = `${author}/${model}`;
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      
      const response = await fetch(`https://huggingface.co/api/models/${modelId}`, {
        headers: apiKey ? { "Authorization": `Bearer ${apiKey}` } : {},
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();
      
      res.json({
        id: data.id,
        name: data.id.split("/").pop(),
        author: data.author || data.id.split("/")[0],
        description: data.description || data.cardData?.model_description,
        downloads: data.downloads,
        likes: data.likes,
        tags: data.tags,
        pipeline_tag: data.pipeline_tag,
        library_name: data.library_name,
        created_at: data.createdAt,
        last_modified: data.lastModified,
        parameters: {
          size: data.safetensors?.total,
          architecture: data.config?.model_type,
          vocab_size: data.config?.vocab_size,
          hidden_size: data.config?.hidden_size,
          num_layers: data.config?.num_hidden_layers,
          num_attention_heads: data.config?.num_attention_heads,
        },
        config: data.config,
        card_data: data.cardData,
      });
    } catch (error) {
      console.error("Hugging Face API error:", error);
      res.status(500).json({ 
        error: "Failed to fetch model details",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // News Feed API - Fetch AI/LLM news from multiple sources
  app.get("/api/news/feed", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string || "all";
      
      const newsItems: any[] = [];

      // Fetch from Hugging Face Papers (latest AI research)
      try {
        const hfResponse = await fetch("https://huggingface.co/api/daily_papers");
        if (hfResponse.ok) {
          const papers = await hfResponse.json();
          papers.slice(0, 5).forEach((paper: any) => {
            newsItems.push({
              id: `hf-${paper.id}`,
              source: "huggingface",
              type: "research",
              title: paper.title,
              description: paper.summary || paper.abstract?.substring(0, 200),
              url: `https://huggingface.co/papers/${paper.id}`,
              author: paper.authors?.[0]?.name || "Unknown",
              timestamp: paper.publishedAt || new Date().toISOString(),
              metadata: {
                upvotes: paper.upvotes || 0,
                comments: paper.numComments || 0,
              },
            });
          });
        }
      } catch (error) {
        console.error("HF papers fetch error:", error);
      }

      // Fetch from GitHub trending repos (AI/ML)
      try {
        const ghResponse = await fetch(
          "https://api.github.com/search/repositories?q=topic:llm+OR+topic:ai+OR+topic:machine-learning&sort=stars&order=desc&per_page=5",
          {
            headers: process.env.GITHUB_TOKEN ? {
              "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
              "Accept": "application/vnd.github.v3+json",
            } : {
              "Accept": "application/vnd.github.v3+json",
            },
          }
        );
        if (ghResponse.ok) {
          const data = await ghResponse.json();
          data.items?.slice(0, 3).forEach((repo: any) => {
            newsItems.push({
              id: `gh-${repo.id}`,
              source: "github",
              type: "release",
              title: `${repo.full_name}: ${repo.description?.substring(0, 100) || repo.name}`,
              description: repo.description || "New trending repository",
              url: repo.html_url,
              author: repo.owner?.login || "Unknown",
              timestamp: repo.updated_at,
              metadata: {
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
              },
            });
          });
        }
      } catch (error) {
        console.error("GitHub fetch error:", error);
      }

      // Fetch from OpenRouter (if they have news/updates endpoint)
      // For now, we'll generate synthetic updates based on model changes
      try {
        const orResponse = await fetch("https://openrouter.ai/api/v1/models", {
          headers: {
            "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
            "X-Title": "LLMView Platform",
          },
        });
        if (orResponse.ok) {
          const data = await orResponse.json();
          // Get recently updated models (simulated by first 2)
          data.data?.slice(0, 2).forEach((model: any, idx: number) => {
            newsItems.push({
              id: `or-${model.id}-${idx}`,
              source: "openrouter",
              type: "pricing",
              title: `${model.name} Available on OpenRouter`,
              description: `${model.description?.substring(0, 150) || model.name}. Input: $${(parseFloat(model.pricing?.prompt || "0") * 1000000).toFixed(2)}/M, Output: $${(parseFloat(model.pricing?.completion || "0") * 1000000).toFixed(2)}/M`,
              url: "https://openrouter.ai/models",
              modelId: model.id,
              timestamp: new Date(Date.now() - idx * 3600000).toISOString(),
              metadata: {
                context_length: model.context_length,
                modality: model.architecture?.modality,
              },
            });
          });
        }
      } catch (error) {
        console.error("OpenRouter news fetch error:", error);
      }

      // Sort by timestamp (most recent first)
      newsItems.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      // Filter by category if specified
      let filtered = newsItems;
      if (category !== "all") {
        filtered = newsItems.filter(item => item.type === category);
      }

      res.json({
        total: filtered.length,
        news: filtered.slice(0, limit),
        lastUpdated: new Date().toISOString(),
      });
    } catch (error) {
      console.error("News feed error:", error);
      res.status(500).json({ 
        error: "Failed to fetch news feed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Alerts API - Generate alerts from news feed
  app.get("/api/alerts", async (req: Request, res: Response) => {
    try {
      const alerts: any[] = [];

      // Fetch recent news to generate alerts
      const newsResponse = await fetch(`${req.protocol}://${req.get('host')}/api/news/feed?limit=10`);
      if (newsResponse.ok) {
        const newsData = await newsResponse.json();
        
        newsData.news?.forEach((item: any) => {
          // Create alerts for important news
          if (item.type === "release" || (item.metadata?.stars > 1000)) {
            alerts.push({
              id: `alert-${item.id}`,
              type: item.type,
              title: item.title,
              description: item.description,
              modelId: item.modelId,
              severity: item.metadata?.stars > 5000 ? "critical" : "info",
              timestamp: item.timestamp,
              url: item.url,
            });
          }
        });
      }

      res.json(alerts);
    } catch (error) {
      console.error("Alerts error:", error);
      res.status(500).json({ 
        error: "Failed to fetch alerts",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
