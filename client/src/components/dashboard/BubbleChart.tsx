import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { MODELS, PROVIDERS, getModelScores } from "@/lib/mockData";
import { useTheme } from "@/hooks/use-theme"; // Assuming we might have this, or just use CSS variables

interface BubbleChartProps {
  benchmark: string;
}

export default function BubbleChart({ benchmark }: BubbleChartProps) {
  // Process data for the chart
  const data = useMemo(() => {
    return Object.values(MODELS).map((model) => {
      // 1. Calculate Blended Price (Average of all providers for this model)
      const modelProviders = Object.values(PROVIDERS).flatMap((p) =>
        p.endpoints.filter((e) => e.modelId === model.id)
      );

      let blendedPrice = 0;
      if (modelProviders.length > 0) {
        // Use the cheapest provider for the "market price"
        const prices = modelProviders.map(
          (e) => (e.inputPrice * 3 + e.outputPrice) / 4 // Standard 3:1 input/output ratio
        );
        blendedPrice = Math.min(...prices);
      }

      // 2. Get Benchmark Score
      const { score } = getModelScores(model.id, benchmark);

      // 3. Parse Date
      const date = new Date(model.releaseDate).getTime();

      return {
        id: model.id,
        name: model.name,
        x: date, // Release Date
        y: blendedPrice, // Price
        z: score, // Score (Size)
        provider: model.creator,
        type: model.openSource ? "Open Source" : "Proprietary",
        color: model.color,
      };
    });
  }, [benchmark]);

  // Format date for X-axis
  const formatDate = (tick: number) => {
    return new Date(tick).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    });
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card/95 backdrop-blur border border-border p-3 rounded-lg shadow-lg text-xs">
          <p className="font-bold text-sm mb-1">{data.name}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
            <span>Released:</span>
            <span className="text-foreground font-medium">
              {new Date(data.x).toLocaleDateString()}
            </span>
            
            <span>Price (Blended):</span>
            <span className="text-foreground font-medium">
              ${data.y.toFixed(2)}/1M
            </span>
            
            <span>{benchmark.toUpperCase()}:</span>
            <span className="text-primary font-bold">{data.z.toFixed(1)}%</span>
            
            <span>Type:</span>
            <span className="text-foreground font-medium">{data.type}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="x"
            name="Release Date"
            domain={['auto', 'auto']}
            tickFormatter={formatDate}
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Price ($/1M)"
            unit="$"
            stroke="hsl(var(--muted-foreground))"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            label={{ 
              value: 'Price ($/1M Tokens)', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fill: 'hsl(var(--muted-foreground))', fontSize: 10 } 
            }}
          />
          <ZAxis type="number" dataKey="z" range={[50, 400]} name="Score" />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Models" data={data} shape="circle">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color} 
                fillOpacity={entry.type === "Open Source" ? 0.2 : 0.7}
                stroke={entry.color}
                strokeWidth={2}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
