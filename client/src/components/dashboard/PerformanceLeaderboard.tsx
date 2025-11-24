import { useState } from "react";
import { LineChart, Line, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, TrendingUp, Download, Share2 } from "lucide-react";
import { MODELS, generateBenchmarkTimeSeries } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PerformanceLeaderboard() {
  const [period, setPeriod] = useState("1M");
  const [selectedModels, setSelectedModels] = useState(["gpt-4o", "claude-3.5-sonnet"]);

  const periods = ["1D", "1W", "1M", "3M", "YTD", "ALL"];

  // Generate performance data
  const generatePerformanceData = () => {
    const baseData = generateBenchmarkTimeSeries(selectedModels[0], "mmlu-pro", 30);
    
    selectedModels.forEach((modelId, idx) => {
      if (idx === 0) return;
      const modelData = generateBenchmarkTimeSeries(modelId, "mmlu-pro", 30);
      modelData.forEach((entry, i) => {
        if (baseData[i]) {
          baseData[i] = { ...baseData[i], [modelId]: entry[modelId] };
        }
      });
    });
    
    return baseData;
  };

  const performanceData = generatePerformanceData();

  // Calculate leaderboard stats
  const leaderboardStats = selectedModels.map((modelId) => {
    const model = MODELS[modelId];
    const data = performanceData;
    const latestScore = data[data.length - 1]?.[modelId] || 0;
    const previousScore = data[0]?.[modelId] || 0;
    const change = ((latestScore - previousScore) / previousScore) * 100;

    return {
      id: modelId,
      name: model?.name || "Unknown",
      score: latestScore,
      change,
      trend: change > 0 ? "up" : change < 0 ? "down" : "stable",
      color: model?.color || "#0066FF",
    };
  }).sort((a, b) => b.score - a.score);

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
            <Button variant="outline" size="sm" gap="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" gap="gap-2">
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
            <div className="bg-card border border-border rounded-lg p-4 h-full flex flex-col">
              <h2 className="text-sm font-semibold text-foreground mb-4">Total Performance Value Over Time</h2>
              
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <defs>
                    {selectedModels.map((modelId) => {
                      const model = MODELS[modelId];
                      const color = model?.color || "#0066FF";
                      return (
                        <linearGradient key={`grad-${modelId}`} id={`grad-${modelId}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                          <stop offset="95%" stopColor={color} stopOpacity={0} />
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  {selectedModels.map((modelId) => {
                    const model = MODELS[modelId];
                    const color = model?.color || "#0066FF";
                    return (
                      <Area
                        key={modelId}
                        type="monotone"
                        dataKey={modelId}
                        stroke={color}
                        fill={`url(#grad-${modelId})`}
                        name={model?.name}
                        isAnimationActive={false}
                      />
                    );
                  })}
                </AreaChart>
              </ResponsiveContainer>

              {/* Chart Controls */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                <span>Linear Scale</span>
                <Button variant="ghost" size="sm" className="h-7 text-xs">
                  Export Data
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
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">GPT-4o</span> achieved new MMLU-Pro high
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">Claude 3.5</span> updated to latest version
                </p>
                <p className="text-muted-foreground">
                  <span className="font-medium text-foreground">DeepSeek R1</span> now available for testing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
