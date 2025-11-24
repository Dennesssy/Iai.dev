import { useMemo, useState } from "react";
import {
  ComposedChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MODELS, generateBenchmarkTimeSeries, AGENT_CATEGORIES } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Flatten agents for easy access
const AGENTS_FLAT = AGENT_CATEGORIES.flatMap((cat: any) => cat.agents.map((agent: any) => ({
  ...agent,
  id: agent.name.toLowerCase().replace(/\s+/g, '-'),
  category: cat.name
})));

const DEFAULT_MODELS = ["gpt-4o", "claude-3.5-sonnet", "llama-3.3-70b"];
const DEFAULT_AGENTS = ["claude-code", "cursor", "replit"];

export default function SyncComparisonCharts() {
  const [comparisonType, setComparisonType] = useState<"models" | "agents">("models");
  const [selectedItems, setSelectedItems] = useState<string[]>(DEFAULT_MODELS);

  // Update selected items when type changes
  const handleTypeChange = (type: "models" | "agents") => {
    setComparisonType(type);
    setSelectedItems(type === "models" ? DEFAULT_MODELS : DEFAULT_AGENTS);
  };

  // Generate chart data
  const chartData = useMemo(() => {
    const items = selectedItems;
    if (items.length === 0) return [];

    // For agents, we'll generate mock benchmark data since they don't have real model IDs in our mock DB
    // We'll use a deterministic generation based on the string hash
    const baseData = generateBenchmarkTimeSeries(items[0], "mmlu-pro", 100);

    items.forEach((itemId, idx) => {
      if (idx === 0) return;
      const itemData = generateBenchmarkTimeSeries(itemId, "mmlu-pro", 100);
      itemData.forEach((entry, i) => {
        baseData[i] = { ...baseData[i], ...entry };
      });
    });

    return baseData;
  }, [selectedItems, comparisonType]);

  // Helper to get item color/name
  const getItemDetails = (id: string) => {
    if (comparisonType === "models") {
      const model = MODELS[id];
      return {
        name: model?.name || id,
        color: model?.color || "#8884d8",
        subtitle: model?.creator || "Unknown",
        type: model?.openSource ? "🔓 Open Source" : "🔒 Proprietary"
      };
    } else {
      const agent = AGENTS_FLAT.find(a => a.id === id);
      // Generate consistent color for agent
      const colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
      const colorIndex = Math.abs(id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
      
      return {
        name: agent?.name || id,
        color: colors[colorIndex],
        subtitle: agent?.category || "Agent",
        type: "🤖 AI Agent"
      };
    }
  };

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
      <div className="p-3 border-b border-border bg-card flex items-center justify-between">
        <div>
          <p className="text-xs font-bold mb-1">Comparison Mode: {comparisonType === "models" ? "MMLU-Pro Benchmark" : "Task Success Rate"}</p>
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold">
              {selectedItems.map(id => getItemDetails(id).name).join(" vs ")}
            </span> 
            {" - Real-time Tracking"}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <span className="text-xs font-medium text-muted-foreground">Compare:</span>
           <Select 
             value={comparisonType} 
             onValueChange={(v) => handleTypeChange(v as "models" | "agents")}
           >
             <SelectTrigger className="h-7 text-xs w-32">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="models">Models</SelectItem>
               <SelectItem value="agents">Agents</SelectItem>
             </SelectContent>
           </Select>
        </div>
      </div>

      {/* Charts Grid - 3 columns */}
      <div className="flex-1 flex gap-2 p-3 min-h-0 overflow-hidden">
        {selectedItems.map((itemId) => {
          const details = getItemDetails(itemId);

          return (
            <div
              key={itemId}
              className="flex-1 min-w-0 flex flex-col rounded-lg border border-border bg-card overflow-hidden"
            >
              {/* Chart Header */}
              <div className="px-3 py-2 border-b border-border bg-secondary/20 shrink-0">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: details.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{details.name}</p>
                    <p className="text-[10px] text-muted-foreground">{details.subtitle}</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 relative min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient
                        id={`gradient-sync-${itemId}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop offset="5%" stopColor={details.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={details.color} stopOpacity={0} />
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
                      dataKey={itemId}
                      stroke={details.color}
                      strokeWidth={2}
                      fill={`url(#gradient-sync-${itemId})`}
                      isAnimationActive={false}
                      name={details.name}
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
                      {chartData[chartData.length - 1]?.[itemId]?.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px]">Peak Score</p>
                    <p className="font-bold text-sm">
                      {Math.max(...chartData.map((d: any) => d[itemId] || 0)).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="pt-1 border-t border-border/30">
                  <p className="text-muted-foreground text-[10px]">Type</p>
                  <p className="font-semibold text-xs">{details.type}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
