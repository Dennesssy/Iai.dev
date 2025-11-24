import { useMemo } from "react";
import {
  ComposedChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MODELS, generateBenchmarkTimeSeries } from "@/lib/mockData";

const COMPARISON_MODELS = ["gpt-4o", "claude-3.5-sonnet", "llama-3.3-70b"];

export default function SyncComparisonCharts() {
  // Generate chart data
  const chartData = useMemo(() => {
    const baseData = generateBenchmarkTimeSeries(COMPARISON_MODELS[0], "mmlu-pro", 100);

    COMPARISON_MODELS.forEach((modelId, idx) => {
      if (idx === 0) return;
      const modelData = generateBenchmarkTimeSeries(modelId, "mmlu-pro", 100);
      modelData.forEach((entry, i) => {
        baseData[i] = { ...baseData[i], ...entry };
      });
    });

    return baseData;
  }, []);

  // Custom tooltip for comparison
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur border border-border p-3 rounded-lg shadow-lg text-xs">
          <p className="font-mono text-muted-foreground mb-2">Day {label}</p>
          {payload.map((entry: any, idx: number) => (
            <p key={idx} style={{ color: entry.color }}>
              {entry.name}: <span className="font-bold">{entry.value.toFixed(1)}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="p-3 border-b border-border bg-card">
        <p className="text-xs font-bold mb-1">Comparison Mode: MMLU-Pro Benchmark</p>
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold">GPT-4o vs Claude 3.5 Sonnet vs Llama 3.3 70B</span> - Real-time Performance Tracking
        </p>
      </div>

      {/* Charts Grid - 3 columns */}
      <div className="flex-1 flex gap-2 p-3 min-h-0 overflow-hidden">
        {COMPARISON_MODELS.map((modelId) => {
          const model = MODELS[modelId];

          return (
            <div
              key={modelId}
              className="flex-1 min-w-0 flex flex-col rounded-lg border border-border bg-card overflow-hidden"
            >
              {/* Chart Header */}
              <div className="px-3 py-2 border-b border-border bg-secondary/20 shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: model?.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{model?.name}</p>
                    <p className="text-[10px] text-muted-foreground">{model?.creator}</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 relative min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient
                        id={`gradient-sync-${modelId}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor={model?.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={model?.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 8 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fontSize: 8 }}
                      tickLine={false}
                      axisLine={false}
                      domain={[60, 100]}
                      width={32}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey={modelId}
                      stroke={model?.color}
                      strokeWidth={2}
                      fill={`url(#gradient-sync-${modelId})`}
                      isAnimationActive={false}
                      name={model?.name}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Stats Footer */}
              <div className="px-3 py-2 border-t border-border bg-secondary/10 text-xs shrink-0 space-y-1">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-muted-foreground text-[10px]">Current Score</p>
                    <p className="font-bold text-primary text-sm">
                      {chartData[chartData.length - 1]?.[modelId]?.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px]">Peak Score</p>
                    <p className="font-bold text-sm">
                      {Math.max(...chartData.map((d: any) => d[modelId] || 0)).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="pt-1 border-t border-border/30">
                  <p className="text-muted-foreground text-[10px]">Type</p>
                  <p className="font-semibold text-xs">{model?.openSource ? "🔓 Open Source" : "🔒 Proprietary"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
