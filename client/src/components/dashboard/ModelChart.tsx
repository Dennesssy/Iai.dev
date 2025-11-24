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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Maximize2, 
  Camera, 
  Settings, 
  X,
  ScatterChart as ScatterIcon,
  LineChart as LineChartIcon,
  BarChart2,
  CandlestickChart,
  Filter,
  Save,
  ZoomIn,
  ZoomOut,
  Activity,
  MoreHorizontal,
  Share2,
  Download
} from "lucide-react";
import { MODELS, generateBenchmarkTimeSeries } from "@/lib/mockData";
import BubbleChart from "./BubbleChart";
import SyncComparisonCharts from "./SyncComparisonCharts";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ModelChartProps {
  selectedModels?: string[];
  onModelRemove?: (modelId: string) => void;
  comparisonMode?: boolean;
}

export default function ModelChart({ selectedModels = ["gpt-4o"], onModelRemove, comparisonMode = false }: ModelChartProps) {
  const [timeRange, setTimeRange] = useState("1M");
  const [benchmark, setBenchmark] = useState("mmlu-pro");
  const [chartType, setChartType] = useState<"line" | "bubble" | "candle" | "bar">("bubble");

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

  // If comparison mode is on, show the sync comparison charts
  if (comparisonMode) {
    return <SyncComparisonCharts />;
  }

  return (
    <div className="flex flex-col h-full bg-card">
      {/* TradingView-style Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border gap-2 bg-card">
        {/* Left Group: Symbol, Timeframe, Chart Type */}
        <div className="flex items-center gap-3 flex-1 overflow-x-auto no-scrollbar">
          
          {/* Symbol / Benchmark Selector */}
          <div className="flex items-center gap-2 min-w-fit">
            <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-secondary/50 cursor-pointer transition-colors border border-transparent hover:border-border/50">
              <span className="font-bold text-sm tracking-tight">MMLU-PRO</span>
              <span className="text-xs text-muted-foreground">BENCHMARK</span>
            </div>
            <Separator orientation="vertical" className="h-5" />
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center gap-0.5">
            {["1W", "1M", "3M", "YTD", "ALL"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`
                  px-2 py-1 rounded text-xs font-medium transition-colors
                  ${timeRange === range 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}
                `}
              >
                {range}
              </button>
            ))}
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          {/* Chart Type Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                {chartType === "bubble" && <ScatterIcon className="h-4 w-4" />}
                {chartType === "line" && <LineChartIcon className="h-4 w-4" />}
                {chartType === "candle" && <CandlestickChart className="h-4 w-4" />}
                {chartType === "bar" && <BarChart2 className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setChartType("bubble")}>
                <ScatterIcon className="h-4 w-4 mr-2" /> Bubble (Landscape)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("line")}>
                <LineChartIcon className="h-4 w-4 mr-2" /> Line
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("candle")}>
                <CandlestickChart className="h-4 w-4 mr-2" /> Candles
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("bar")}>
                <BarChart2 className="h-4 w-4 mr-2" /> Bars
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Indicators / Plotting */}
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2">
            <Activity className="h-4 w-4" />
            <span className="hidden sm:inline">Indicators</span>
          </Button>
        </div>

        {/* Right Group: Zoom, Save, Settings */}
        <div className="flex items-center gap-1">
          <div className="flex items-center bg-secondary/30 rounded-md p-0.5 mr-2">
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Filter">
            <Filter className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" title="Save Chart">
            <Save className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                <Camera className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" /> Save Image
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" /> Share Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Active Filters / Legend Bar */}
      {chartType === "line" && selectedModels.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-border/50 bg-secondary/5 overflow-x-auto">
           {selectedModels.map((modelId) => {
            const model = MODELS[modelId];
            return (
              <div key={modelId} className="flex items-center gap-2 px-2 py-1 rounded-full bg-background border border-border/50 shadow-sm">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: model?.color || "#0066FF" }}
                />
                <span className="text-xs font-medium whitespace-nowrap">{model?.name || "Unknown"}</span>
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
          })}
        </div>
      )}

      {/* Chart Content */}
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
              {/* <Legend wrapperStyle={{ paddingTop: '16px' }} /> */}
              
              {/* Render lines/areas for each model */}
              {selectedModels.map((modelId) => {
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
