import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ComposedChart } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, TrendingUp, Download, Share2, RefreshCw, TrendingDown } from "lucide-react";
import { MODELS, generateBenchmarkTimeSeries } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";

export default function PerformanceLeaderboard() {
  const [period, setPeriod] = useState("1M");
  const [selectedModels, setSelectedModels] = useState(["gpt-4o", "claude-3.5-sonnet"]);
  const [isLogScale, setIsLogScale] = useState(false);

  const periods = ["1D", "1W", "1M", "3M", "YTD", "ALL"];

  // Fetch live leaderboard data
  const { data: leaderboardData, refetch: refetchLeaderboard } = useQuery({
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

  // Use live data or fallback to mock
  const performanceData = timeSeriesData?.data || [];
  const leaderboardStats = leaderboardData?.data || [];
  const stats = statsData || {
    activeModels: 24,
    bestModel: "GPT-4o",
    bestScore: 94.8,
  };
  const activities = activityData?.data || [];

  return (
    <div className="h-full flex flex-col bg-background">
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
        </div>
      </div>

      {/* Header with Time Period Selector */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Total Asset Value Over Time</h1>
          <p className="text-xs text-muted-foreground mt-1">60-minute intervals • Nasdaq-100 trading</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  period === p
                    ? "bg-primary text-white"
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
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-3 gap-6 p-6 h-full">
          {/* Left: Performance Chart */}
          <div className="col-span-2">
            <div className="bg-gradient-to-b from-card to-card/50 border border-primary/20 rounded-lg p-5 h-full flex flex-col shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-foreground">Performance Over Time</h2>
                <div className="flex gap-2 text-xs">
                  <button className="px-2 py-1 rounded bg-primary/10 text-primary font-medium">Linear</button>
                  <button onClick={() => setIsLogScale(!isLogScale)} className="px-2 py-1 rounded hover:bg-secondary text-muted-foreground font-medium">Log</button>
                </div>
              </div>
              
              <ResponsiveContainer width="100%" height={360}>
                <ComposedChart data={performanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    {selectedModels.map((modelId) => {
                      const model = MODELS[modelId];
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
                  <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border))" opacity={0.3} vertical={true} horizontalPoints={[90]} />
                  <XAxis 
                    dataKey="time" 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    domain={isLogScale ? ['dataMin - 5', 'dataMax + 5'] : [80, 100]}
                    axisLine={{ stroke: "hsl(var(--border))" }}
                    scale={isLogScale ? "log" : "linear"}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                      borderColor: "hsl(var(--primary))",
                      borderRadius: "12px",
                      border: "2px solid",
                      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    }}
                    labelStyle={{ color: "#fff", fontWeight: "bold" }}
                    formatter={(value: any) => typeof value === "number" ? value.toFixed(2) : value}
                    cursor={{ stroke: "hsl(var(--primary))", strokeOpacity: 0.5 }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={20}
                    wrapperStyle={{ paddingBottom: "10px" }}
                    iconType="line"
                  />
                  <ReferenceLine y={90} stroke="hsl(var(--border))" strokeDasharray="5 5" opacity={0.3} label={{ value: "Baseline", position: "right", fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                  
                  {selectedModels.map((modelId) => {
                    const model = MODELS[modelId];
                    const color = model?.color || "#0066FF";
                    return (
                      <Area
                        key={modelId}
                        type="natural"
                        dataKey={modelId}
                        stroke={color}
                        strokeWidth={2.5}
                        fill={`url(#grad-${modelId})`}
                        name={model?.name}
                        isAnimationActive={true}
                        animationDuration={500}
                        filter={`url(#shadow-${modelId})`}
                        dot={false}
                        activeDot={{ r: 6, fill: color, opacity: 1 }}
                      />
                    );
                  })}
                </ComposedChart>
              </ResponsiveContainer>

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
                    
                    return (
                      <div key={modelId} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model?.color }} />
                        <div className="text-xs">
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
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  Export
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
              <div className="px-4 py-3 border-b border-border/50">
                <h3 className="text-sm font-semibold text-foreground">🏆 Performance Leaderboard</h3>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="divide-y divide-border/50">
                  {leaderboardStats.map((agent) => (
                    <div key={agent.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold w-4 text-muted-foreground">#{agent.rank}</span>
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: agent.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-foreground">{agent.name}</p>
                              <p className="text-xs text-muted-foreground">{agent.provider}</p>
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
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
