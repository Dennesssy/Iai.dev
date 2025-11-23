import { useState } from "react";
import { 
  Area, 
  AreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
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
  TrendingDown
} from "lucide-react";

const mockData = Array.from({ length: 100 }, (_, i) => ({
  time: i,
  value: 50 + Math.random() * 30 + Math.sin(i / 10) * 20,
  cost: 20 + Math.random() * 10 + i * 0.2,
}));

export default function ModelChart() {
  const [timeRange, setTimeRange] = useState("1D");

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Chart Toolbar */}
      <div className="flex items-center justify-between p-2 border-b border-border">
        <div className="flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 px-2 border-r border-border pr-4">
            <span className="font-bold text-lg">GPT-4</span>
            <span className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded text-muted-foreground">OPENAI</span>
          </div>
          
          <div className="flex items-center gap-4 px-2">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">MMLU Score</span>
              <span className="text-sm font-mono font-medium text-primary flex items-center gap-1">
                86.4% <TrendingUp className="h-3 w-3" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Latency (P99)</span>
              <span className="text-sm font-mono font-medium text-red-400 flex items-center gap-1">
                420ms <TrendingDown className="h-3 w-3" />
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase">Cost / 1M</span>
              <span className="text-sm font-mono font-medium text-foreground">
                $30.00
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Tabs value={timeRange} onValueChange={setTimeRange} className="mr-2">
            <TabsList className="h-8 bg-secondary/50">
              {["1H", "1D", "1W", "1M", "YTD", "ALL"].map((range) => (
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
      <div className="flex-1 relative min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
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
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                fontSize: '12px'
              }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Overlay Indicators (Mock) */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none">
          <div className="bg-card/80 backdrop-blur border border-border p-2 rounded shadow-sm text-xs">
            <span className="text-primary font-bold">MMLU</span> <span className="text-muted-foreground">EMA(9)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
