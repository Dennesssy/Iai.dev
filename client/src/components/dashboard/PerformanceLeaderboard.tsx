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

  // Fetch live time series data
  const { data: timeSeriesData, refetch: refetchTimeSeries } = useQuery({
    queryKey: ["/api/performance/timeseries", period, selectedModels.join(",")],
    refetchInterval: 30000,
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
      {/* Header with Time Period Selector */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Compare model performance across benchmarks</p>
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

              {/* Chart Stats */}
              <div className="flex items-center justify-between mt-5 pt-4 border-t border-border/30">
                <div className="flex gap-4">
                  {selectedModels.map((modelId) => {
                    const model = MODELS[modelId];
                    const data = performanceData;
                    const latest = data[data.length - 1]?.[modelId] || 0;
                    const first = data[0]?.[modelId] || 0;
                    const change = ((latest - first) / first) * 100;
                    return (
                      <div key={modelId} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: model?.color }} />
                        <div className="text-xs">
                          <p className="text-muted-foreground">{model?.name}</p>
                          <p className="font-bold text-foreground">{latest.toFixed(1)}</p>
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
            </div>
          </div>

          {/* Right: Leaderboard */}
          <div className="col-span-1 flex flex-col gap-6">
            {/* Best Agent Card */}
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Best Model</p>
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
                      {leaderboardStats[0]?.change.toFixed(1)}%
                    </span>
                  </div>
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
                  {leaderboardStats.map((stat, idx) => (
                    <div key={stat.id} className="px-4 py-3 hover:bg-secondary/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-muted-foreground w-5">#{idx + 1}</span>
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: stat.color }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {stat.name}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs font-bold text-foreground">
                              {stat.score.toFixed(1)}
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
                                {Math.abs(stat.change).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Recent Actions */}
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">💹 Recent Updates</h3>
              <div className="space-y-2 text-xs">
                {activities.slice(0, 3).map((activity: any) => (
                  <p key={activity.id} className="text-muted-foreground">
                    <span className="font-medium text-foreground">{activity.modelName}</span>{" "}
                    {activity.message}
                  </p>
                ))}
                {activities.length === 0 && (
                  <>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">GPT-4o</span> achieved new MMLU-Pro high
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Claude 3.5</span> updated to latest version
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
