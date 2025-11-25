import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ComposedChart, Brush } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, TrendingUp, Download, Share2, RefreshCw, TrendingDown, ExternalLink, Github } from "lucide-react";
import { MODELS, generateBenchmarkTimeSeries } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

// AI4Trade.ai models configuration
const AI4TRADE_MODELS: Record<string, { name: string; color: string; provider: string }> = {
  "gemini-2.5-flash": { name: "Gemini 2.5 Flash", color: "#00d4ff", provider: "Google" },
  "qwen3-max": { name: "Qwen3 Max", color: "#00ffcc", provider: "Alibaba" },
  "deepseek-chat-v3.1": { name: "DeepSeek Chat v3.1", color: "#ff006e", provider: "DeepSeek" },
  "gpt-5": { name: "GPT-5", color: "#ffbe0b", provider: "OpenAI" },
  "claude-3.7-sonnet": { name: "Claude 3.7 Sonnet", color: "#8338ec", provider: "Anthropic" },
  "minimax-m2": { name: "MiniMax M2", color: "#3a86ff", provider: "MiniMax" },
  "qqq-benchmark": { name: "QQQ Invesco", color: "#ff6b00", provider: "Benchmark" },
};

// Generate mock trading performance data
const generateTradingData = () => {
  const data = [];
  const startDate = new Date("2025-10-30T09:30:00");
  const baseValues: Record<string, number> = {
    "gemini-2.5-flash": 10000,
    "qwen3-max": 10000,
    "deepseek-chat-v3.1": 10000,
    "gpt-5": 10000,
    "claude-3.7-sonnet": 10000,
    "minimax-m2": 10000,
    "qqq-benchmark": 10000,
  };

  for (let i = 0; i < 100; i++) {
    const time = new Date(startDate.getTime() + i * 3600000); // Hourly intervals
    const entry: any = {
      time: time.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
      timestamp: time.getTime(),
    };

    Object.keys(baseValues).forEach((modelId) => {
      // Simulate trading performance with volatility
      const change = (Math.random() - 0.48) * 200; // Slight upward bias
      baseValues[modelId] = Math.max(5000, baseValues[modelId] + change);
      entry[modelId] = parseFloat(baseValues[modelId].toFixed(2));
    });

    data.push(entry);
  }
  return data;
};

// Generate mock leaderboard stats
const generateLeaderboardStats = () => {
  const models = Object.keys(AI4TRADE_MODELS).filter(id => id !== "qqq-benchmark");
  return models.map((modelId, idx) => {
    const model = AI4TRADE_MODELS[modelId];
    const finalValue = 10000 + (Math.random() * 8000 - 2000);
    const returnPct = ((finalValue - 10000) / 10000) * 100;
    return {
      id: modelId,
      name: model.name,
      color: model.color,
      score: finalValue,
      change: returnPct,
      trend: returnPct > 0 ? "up" : "down",
    };
  }).sort((a, b) => b.score - a.score);
};

// Generate mock recent trading actions
const generateRecentTrades = () => {
  const actions = ["BUY", "SELL"];
  const stocks = ["NVDA", "AAPL", "TSLA", "MSFT", "GOOGL", "AMZN", "META", "NFLX"];
  const models = Object.keys(AI4TRADE_MODELS).filter(id => id !== "qqq-benchmark");
  
  return Array.from({ length: 8 }, (_, i) => {
    const modelId = models[Math.floor(Math.random() * models.length)];
    return {
      id: `trade-${i}`,
      modelName: AI4TRADE_MODELS[modelId].name,
      action: actions[Math.floor(Math.random() * actions.length)],
      symbol: stocks[Math.floor(Math.random() * stocks.length)],
      quantity: Math.floor(Math.random() * 50) + 5,
      price: (Math.random() * 300 + 100).toFixed(2),
      timestamp: new Date(Date.now() - i * 1800000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  });
};

export default function PerformanceLeaderboard() {
  const [period, setPeriod] = useState("1M");
  const [selectedModels, setSelectedModels] = useState(["gemini-2.5-flash", "gpt-5", "claude-3.7-sonnet"]);
  const [isLogScale, setIsLogScale] = useState(false);
  const [tradingData] = useState(generateTradingData());
  const [leaderboardData] = useState(generateLeaderboardStats());
  const [recentTrades] = useState(generateRecentTrades());

  // Load watchlist from localStorage for ticker
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("User[]Watchlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const periods = ["1D", "1W", "1M", "3M", "YTD", "ALL"];

  // Fetch live leaderboard data
  const { data: leaderboardDataApi, refetch: refetchLeaderboard } = useQuery({
    queryKey: ["/api/leaderboard", period],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch live time series data - updates every 10 seconds for live trading
  const { data: timeSeriesData, refetch: refetchTimeSeries, isLoading: isLoadingTimeSeries } = useQuery({
    queryKey: ["/api/performance/timeseries", period, selectedModels.join(",")],
    refetchInterval: 10000, // Update every 10 seconds for live trading
  });

  // Fetch real-time portfolio snapshots for smooth live updates
  const { data: liveData } = useQuery({
    queryKey: ["/api/performance/live", selectedModels.join(",")],
    refetchInterval: 5000, // Update every 5 seconds for near real-time trading
  });

  // Fetch live stats
  const { data: statsData } = useQuery({
    queryKey: ["/api/performance/stats"],
    refetchInterval: 60000, // Refresh every minute
  });

  // Fetch recent activity
  const { data: activityData } = useQuery({
    queryKey: ["/api/performance/activity"],
    refetchInterval: 30000,
  });

  // Use live data or fallback to generated mock
  const performanceData = timeSeriesData?.data || tradingData;
  const leaderboardStats = leaderboardDataApi?.data || leaderboardData;
  const latestValue = performanceData[performanceData.length - 1];
  const stats = statsData || {
    activeModels: 6,
    bestModel: leaderboardStats[0]?.name || "Gemini 2.5 Flash",
    bestScore: leaderboardStats[0]?.score.toFixed(2) || "15234.50",
    tradingPeriod: "Oct 30 - Nov 24, 2025",
    bestReturn: leaderboardStats[0]?.change.toFixed(1) ? `${leaderboardStats[0].change > 0 ? '+' : ''}${leaderboardStats[0].change.toFixed(1)}%` : "+52.3%",
  };
  const activities = activityData?.data || recentTrades;

  // Determine ticker models: use watchlist if available, otherwise selectedModels
  const tickerModelIds = watchlist.length > 0 ? watchlist : selectedModels;

  return (
    <div className="h-full flex flex-col bg-background">
<<<<<<< HEAD
      {/* Live Price Ticker */}
      <div className="bg-gradient-to-r from-card via-primary/5 to-card border-b border-border overflow-hidden">
        <div className="animate-ticker flex items-center gap-8 py-2 px-4">
          {[...tickerModelIds, ...tickerModelIds].map((modelId, idx) => {
            const model = AI4TRADE_MODELS[modelId];
            if (!model) return null;
            const currentValue = latestValue?.[modelId] || 10000;
            const returnPct = ((currentValue - 10000) / 10000) * 100;
            const isPositive = returnPct >= 0;
            return (
              <div key={`${modelId}-${idx}`} className="flex items-center gap-3 whitespace-nowrap">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: model.color }} />
                <span className="text-xs font-bold text-foreground">{model.name}</span>
                <span className="text-sm font-mono font-bold text-foreground">${currentValue.toFixed(2)}</span>
                <span className={`text-xs font-bold ${
                  isPositive ? 'text-green-500' : 'text-red-500'
                }`}>
                  {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{returnPct.toFixed(2)}%
                </span>
              </div>
            );
          })}
=======
      {/* Top Stats Cards */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-border bg-gradient-to-r from-background to-card/20">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Active Agents</p>
          <p className="text-2xl font-bold text-foreground">{stats.activeAgents || 6}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Trading Period</p>
          <p className="text-sm font-bold text-foreground">Jan 1 - Apr 30, 2024</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Best Agent</p>
          <p className="text-sm font-bold text-foreground">{stats.bestAgent || "GPT-5"}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs font-medium text-muted-foreground mb-1">Best Return</p>
          <p className="text-2xl font-bold text-green-500">{stats.bestReturn || "28.5"}%</p>
>>>>>>> e30481e0bd647893e46226ee2f8a10805dcdbdbf
        </div>
      </div>

      {/* Header with Time Period Selector */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
<<<<<<< HEAD
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-foreground">
              <a 
                href="https://ai4trade.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                AI4Trade.ai
              </a>
              {" - AI Trading Agent Performance"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">Track how different AI models perform in Nasdaq-100 stock trading</p>
            <span className="text-muted-foreground">•</span>
            <a 
              href="https://github.com/HKUDS/AI-Trader" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          </div>
=======
          <h1 className="text-2xl font-bold text-foreground">Total Asset Value Over Time</h1>
          <p className="text-xs text-muted-foreground mt-1">60-minute intervals • Nasdaq-100 trading</p>
>>>>>>> e30481e0bd647893e46226ee2f8a10805dcdbdbf
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                  period === p
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                refetchLeaderboard();
                refetchTimeSeries();
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 p-6 border-b border-border">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Active Agents</div>
          <div className="text-2xl font-bold text-foreground">{stats.activeModels}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Trading Period</div>
          <div className="text-sm font-bold text-foreground">{stats.tradingPeriod}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Best Agent</div>
          <div className="text-sm font-bold text-foreground">{stats.bestModel}</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="text-xs text-muted-foreground mb-1">Best Return</div>
          <div className="text-2xl font-bold text-green-500">{stats.bestReturn}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-6 p-6 h-full">
          {/* Left: Performance Chart */}
          <div className="col-span-2">
            <div className="bg-gradient-to-b from-card to-card/50 border border-primary/20 rounded-lg p-5 h-full flex flex-col shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground">Total Asset Value Over Time</h2>
                <div className="flex gap-2 text-xs">
                  <button 
                    onClick={() => setIsLogScale(false)}
                    className={`px-2 py-1 rounded font-medium ${!isLogScale ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
                  >
                    Linear Scale
                  </button>
                  <button 
                    onClick={() => setIsLogScale(true)} 
                    className={`px-2 py-1 rounded font-medium ${isLogScale ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-muted-foreground'}`}
                  >
                    Log Scale
                  </button>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    {selectedModels.map((modelId) => {
                      const model = AI4TRADE_MODELS[modelId];
                      const color = model?.color || "#0066FF";
                      return (
                        <defs key={`defs-${modelId}`}>
                          <linearGradient id={`grad-${modelId}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                            <stop offset="50%" stopColor={color} stopOpacity={0.1} />
                            <stop offset="95%" stopColor={color} stopOpacity={0.01} />
                          </linearGradient>
                          <filter id={`shadow-${modelId}`}>
                            <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
                          </filter>
                        </defs>
                      );
                    })}
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border))" opacity={0.3} vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    domain={isLogScale ? ['dataMin - 2000', 'dataMax + 2000'] : [0, 25000]}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    scale={isLogScale ? "log" : "linear"}
                    label={{ value: 'Portfolio Value ($)', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.9)",
                      borderColor: "hsl(var(--primary))",
                      borderRadius: "8px",
                      border: "1px solid",
                      padding: "12px",
                    }}
                    labelStyle={{ color: "#fff", fontWeight: "bold", marginBottom: "8px" }}
                    formatter={(value: any) => typeof value === "number" ? `$${value.toFixed(2)}` : value}
                    cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 2, strokeOpacity: 0.5 }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={20}
                    wrapperStyle={{ paddingBottom: "10px" }}
                    iconType="line"
                  />
                  <ReferenceLine 
                    y={10000} 
                    stroke="hsl(var(--border))" 
                    strokeDasharray="5 5" 
                    opacity={0.5} 
                    label={{ 
                      value: "Initial Capital ($10k)", 
                      position: "right", 
                      fill: "hsl(var(--muted-foreground))", 
                      fontSize: 10 
                    }} 
                  />
                  
                  {selectedModels.map((modelId) => {
                    const model = AI4TRADE_MODELS[modelId];
                    const color = model?.color || "#0066FF";
                    return (
                      <Area
                        key={modelId}
                        type="monotone"
                        dataKey={modelId}
                        stroke={color}
                        strokeWidth={2.5}
                        fill={`url(#grad-${modelId})`}
                        name={model?.name}
                        isAnimationActive={true}
                        animationDuration={500}
                        filter={`url(#shadow-${modelId})`}
                        dot={{ r: 2, fill: color, strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: color, stroke: "#fff", strokeWidth: 2 }}
                      />
                    );
                  })}
                  {/* Benchmark line */}
                  <Line
                    type="monotone"
                    dataKey="qqq-benchmark"
                    stroke={AI4TRADE_MODELS["qqq-benchmark"].color}
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    name={AI4TRADE_MODELS["qqq-benchmark"].name}
                    dot={{ r: 2, fill: AI4TRADE_MODELS["qqq-benchmark"].color, strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: AI4TRADE_MODELS["qqq-benchmark"].color, stroke: "#fff", strokeWidth: 2 }}
                  />
                  
                  {/* Brush for pan and zoom */}
                  <Brush 
                    dataKey="time" 
                    height={30} 
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--secondary))"
                    travellerWidth={10}
                  />
                </ComposedChart>
              </ResponsiveContainer>

<<<<<<< HEAD
              {/* Agent Performance Stats */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/30">
                <div className="flex gap-4 flex-wrap">
                  {Object.entries(AI4TRADE_MODELS).slice(0, 4).map(([modelId, model]) => {
                    const currentValue = latestValue?.[modelId] || 10000;
                    const returnPct = ((currentValue - 10000) / 10000) * 100;
=======
              {/* Chart Stats - Live Updates */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/30">
                <div className="flex gap-4">
                  {selectedModels.map((modelId) => {
                    const model = MODELS[modelId];
                    const data = performanceData;
                    const latest = data[data.length - 1]?.[modelId] || 0;
                    const first = data[0]?.[modelId] || 0;
                    const change = ((latest - first) / first) * 100;
                    const liveUpdate = liveData?.data?.[modelId];
                    const isUpdating = isLoadingTimeSeries;
                    
>>>>>>> e30481e0bd647893e46226ee2f8a10805dcdbdbf
                    return (
                      <div key={modelId} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: model.color }} />
                        <div className="text-xs">
<<<<<<< HEAD
                          <p className="text-foreground font-medium">{model.name}</p>
                          <div className="flex items-center gap-1">
                            <p className="text-muted-foreground text-[10px]">${currentValue.toFixed(0)}</p>
                            <span className={`text-[10px] font-semibold ${returnPct > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ({returnPct > 0 ? '+' : ''}{returnPct.toFixed(1)}%)
                            </span>
=======
                          <p className="text-muted-foreground">{model?.name}</p>
                          <p className={`font-bold transition-all ${isUpdating ? "opacity-50" : "opacity-100"}`}>
                            ${liveUpdate?.portfolioValue ? liveUpdate.portfolioValue.toLocaleString() : latest.toFixed(0)}
                            {isUpdating && <span className="ml-1 text-xs animate-pulse">📡</span>}
                          </p>
                        </div>
                        {change !== 0 && (
                          <div className={`flex items-center gap-0.5 ${change > 0 ? "text-green-500" : "text-red-500"}`}>
                            {change > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                            <span className="text-xs font-semibold">{Math.abs(change).toFixed(1)}%</span>
>>>>>>> e30481e0bd647893e46226ee2f8a10805dcdbdbf
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground gap-2">
                  <Download className="h-3 w-3" />
                  Export Data
                </Button>
              </div>

              {/* Live Status Indicator */}
              <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Live trading • Updates every 10s</span>
              </div>
            </div>
          </div>

          {/* Right: Leaderboard */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* Best Agent Card */}
            <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Best Performing Agent</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{
                    backgroundColor: leaderboardStats[0]?.color,
                    opacity: 0.2,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {leaderboardStats[0]?.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs font-bold text-green-500">
                      +{leaderboardStats[0]?.totalReturn.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${leaderboardStats[0]?.portfolioValue.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Leaderboard */}
            <div className="bg-card border border-border rounded-lg flex flex-col flex-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">🏆 Performance Leaderboard</h3>
                <span className="text-xs text-muted-foreground">{leaderboardStats.length} Agents</span>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="divide-y divide-border/50">
<<<<<<< HEAD
                  {leaderboardStats.map((stat: any, idx: number) => (
                    <div key={stat.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`text-sm font-bold w-6 text-center ${
                          idx === 0 ? 'text-yellow-500' : 
                          idx === 1 ? 'text-gray-400' : 
                          idx === 2 ? 'text-amber-600' : 
                          'text-muted-foreground'
                        }`}>
                          {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                        </div>
=======
                  {leaderboardStats.map((agent) => (
                    <div key={agent.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4 text-muted-foreground">#{agent.rank}</span>
>>>>>>> e30481e0bd647893e46226ee2f8a10805dcdbdbf
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: agent.color }}
                        />
                        <div className="flex-1 min-w-0">
<<<<<<< HEAD
                          <p className="text-xs font-medium text-foreground truncate">
                            {stat.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-bold text-foreground">
                              ${stat.score.toFixed(2)}
                            </span>
                            <div
                              className={`flex items-center gap-0.5 ${
                                stat.trend === "up"
                                  ? "text-green-500"
                                  : stat.trend === "down"
                                  ? "text-red-500"
                                  : "text-gray-500"
                              }`}
                            >
                              {stat.trend === "up" ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : stat.trend === "down" ? (
                                <ArrowDown className="h-3 w-3" />
                              ) : null}
                              <span className="text-xs font-semibold">
                                {stat.change > 0 ? '+' : ''}{stat.change.toFixed(1)}%
                              </span>
=======
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-foreground">{agent.name}</p>
                              <p className="text-xs text-muted-foreground">{agent.provider}</p>
>>>>>>> e30481e0bd647893e46226ee2f8a10805dcdbdbf
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-bold text-foreground">
                                ${agent.portfolioValue.toLocaleString()}
                              </p>
                              <div className={`flex items-center justify-end gap-1 ${agent.totalReturn > 0 ? "text-green-500" : "text-red-500"}`}>
                                {agent.totalReturn > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                                <span className="text-xs font-bold">{Math.abs(agent.totalReturn).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <span>Trades: {agent.trades}</span>
                            <span>•</span>
                            <span>Win Rate: {agent.winRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {leaderboardStats.length === 0 && (
                    <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                      Loading leaderboard data...
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

<<<<<<< HEAD
            {/* Recent Trading Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">💹 Recent Trading Actions</h3>
                <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-500 rounded-full font-medium">Live</span>
              </div>
              <ScrollArea className="h-[280px]">
                <div className="space-y-3 text-xs">
                  {activities.slice(0, 8).map((activity: any) => (
                    <div key={activity.id} className="border-b border-border/30 pb-2 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-foreground">{activity.modelName}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            activity.action === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                          }`}>
                            {activity.action}
                          </span>
                          <span className="text-muted-foreground text-[10px]">{activity.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-muted-foreground">
                        <span className="font-mono font-semibold">{activity.symbol}</span>
                        <span>{activity.quantity} shares @ ${activity.price}</span>
                      </div>
                    </div>
                  ))}
=======
            {/* Trading Actions Feed */}
            <div className="bg-card border border-border rounded-lg flex flex-col flex-1 overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">📊 Recent Trading</h3>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="divide-y divide-border/50">
                  {activities.map((trade: any) => (
                    <div key={trade.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: trade.agentColor }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-foreground truncate">
                                {trade.agentName}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-xs font-bold flex-shrink-0 ${
                                  trade.action === "BUY"
                                    ? "bg-green-500/20 text-green-500"
                                    : trade.action === "SELL"
                                    ? "bg-red-500/20 text-red-500"
                                    : "bg-blue-500/20 text-blue-500"
                                }`}
                              >
                                {trade.action}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              <span className="font-semibold">{trade.symbol}</span>
                              <span>•</span>
                              <span>{trade.quantity} @ ${trade.price}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-bold text-foreground">
                            ${trade.totalValue.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="px-4 py-8 text-center text-muted-foreground text-sm">
                      Loading trading data...
                    </div>
                  )}
>>>>>>> e30481e0bd647893e46226ee2f8a10805dcdbdbf
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
