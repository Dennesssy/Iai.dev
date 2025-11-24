import { useState } from "react";
import { 
  ComposedChart,
  Area, 
  AreaChart, 
  CartesianGrid, 
  Line,
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  Legend
} from "recharts";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Maximize2, 
  Camera, 
  Settings, 
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  X,
  ScatterChart as ScatterIcon,
  LineChart as LineChartIcon
} from "lucide-react";
import { MODELS, generateBenchmarkTimeSeries } from "@/lib/mockData";
import BubbleChart from "./BubbleChart";

interface ModelChartProps {
  selectedModels?: string[];
  onModelRemove?: (modelId: string) => void;
}

export default function ModelChart({ selectedModels = ["gpt-4o"], onModelRemove }: ModelChartProps) {
  const [timeRange, setTimeRange] = useState("1M");
  const [benchmark, setBenchmark] = useState("mmlu-pro");
  const [chartType, setChartType] = useState<"line" | "bubble">("bubble");

  // Generate chart data with selected models
  const generateChartData = () => {
    const baseData = generateBenchmarkTimeSeries(selectedModels[0], benchmark, 100);
    
    selectedModels.forEach((modelId, idx) => {
      if (idx === 0) return;
      const modelData = generateBenchmarkTimeSeries(modelId, benchmark, 100);
      modelData.forEach((entry, i) => {
        baseData[i] = { ...baseData[i], ...entry };
      });
    });
    
    return baseData;
  };

  const chartData = generateChartData();

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-border gap-4 flex-wrap">
        <div className="flex items-center gap-3 overflow-x-auto flex-1">
          {/* View Toggle */}
          <div className="flex items-center border-r border-border pr-3 mr-1">
            <div className="bg-secondary/50 p-0.5 rounded-lg flex gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${chartType === "line" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                onClick={() => setChartType("line")}
                title="Performance History"
              >
                <LineChartIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`h-7 w-7 ${chartType === "bubble" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                onClick={() => setChartType("bubble")}
                title="Market Landscape"
              >
                <ScatterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selected Models (Only relevant for Line Chart) */}
          {chartType === "line" && (
            <div className="flex items-center gap-2 border-r border-border pr-3">
              {selectedModels.length === 0 ? (
                <span className="text-sm text-muted-foreground">No models selected</span>
              ) : (
                selectedModels.slice(0, 3).map((modelId) => {
                  const model = MODELS[modelId];
                  return (
                    <div key={modelId} className="flex items-center gap-2 px-2 py-1 rounded bg-secondary/30 border border-border/50">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: model?.color || "#0066FF" }}
                      />
                      <span className="text-sm font-medium">{model?.name || "Unknown"}</span>
                      {onModelRemove && (
                        <button
                          onClick={() => onModelRemove(modelId)}
                          className="hover:text-destructive transition-colors ml-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })
              )}
              {selectedModels.length > 3 && (
                <span className="text-xs text-muted-foreground px-2">+{selectedModels.length - 3}</span>
              )}
            </div>
          )}
          
          {/* Benchmark Selector */}
          <select
            value={benchmark}
            onChange={(e) => setBenchmark(e.target.value)}
            className="text-xs px-2 py-1.5 rounded border border-border bg-background"
          >
            <option value="mmlu-pro">MMLU Pro (General)</option>
            <option value="gpqa">GPQA (Reasoning)</option>
            <option value="ifeval">IFEval (Instruction)</option>
            <option value="human-eval">HumanEval (Code)</option>
            <option value="gsm8k">GSM8K (Math)</option>
            <option value="math">MATH (Hard Math)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {chartType === "line" && (
            <Tabs value={timeRange} onValueChange={setTimeRange}>
              <TabsList className="h-8 bg-secondary/50">
                {["1W", "1M", "3M", "6M", "YTD", "ALL"].map((range) => (
                  <TabsTrigger 
                    key={range} 
                    value={range}
                    className="text-xs px-2 h-6 data-[state=active]:bg-background"
                  >
                    {range}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Camera className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 relative min-h-0 p-2">
        {chartType === "bubble" ? (
          <BubbleChart benchmark={benchmark} />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <defs>
                {selectedModels.map((modelId) => {
                  const model = MODELS[modelId];
                  const color = model?.color || "#0066FF";
                  return (
                    <linearGradient
                      key={`gradient-${modelId}`}
                      id={`gradient-${modelId}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  );
                })}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                tick={{fontSize: 10}} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                tick={{fontSize: 10}} 
                tickLine={false}
                axisLine={false}
                orientation="right"
                domain={[0, 100]}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  padding: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value) => typeof value === 'number' ? value.toFixed(1) : value}
              />
              {selectedModels.length > 0 && <Legend wrapperStyle={{ paddingTop: '16px' }} />}
              
              {/* Render lines/areas for each model */}
              {selectedModels.map((modelId, idx) => {
                const model = MODELS[modelId];
                const color = model?.color || "#0066FF";
                
                return selectedModels.length > 1 ? (
                  <Line
                    key={modelId}
                    type="monotone"
                    dataKey={modelId}
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                    name={model?.name}
                  />
                ) : (
                  <Area
                    key={modelId}
                    type="monotone"
                    dataKey={modelId}
                    stroke={color}
                    strokeWidth={2}
                    fill={`url(#gradient-${modelId})`}
                    isAnimationActive={false}
                    name={model?.name}
                  />
                );
              })}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
