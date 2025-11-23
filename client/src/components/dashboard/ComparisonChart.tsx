import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { X } from "lucide-react";
import { useState } from "react";

const benchmarkData = [
  { name: "MMLU", "GPT-4": 86.4, "Claude-3": 85.2, "Llama-3": 81.8, "Gemini": 80.1 },
  { name: "HumanEval", "GPT-4": 67.0, "Claude-3": 71.5, "Llama-3": 55.2, "Gemini": 63.4 },
  { name: "GSM8K", "GPT-4": 92.0, "Claude-3": 88.1, "Llama-3": 79.3, "Gemini": 86.2 },
  { name: "ARC-C", "GPT-4": 96.3, "Claude-3": 94.8, "Llama-3": 85.6, "Gemini": 91.2 },
  { name: "HellaSwag", "GPT-4": 95.3, "Claude-3": 93.2, "Llama-3": 82.2, "Gemini": 87.5 },
];

const radarData = [
  { metric: "Reasoning", "GPT-4": 86, "Claude-3": 85, "Llama-3": 82 },
  { metric: "Coding", "GPT-4": 67, "Claude-3": 72, "Llama-3": 55 },
  { metric: "Math", "GPT-4": 92, "Claude-3": 88, "Llama-3": 79 },
  { metric: "Knowledge", "GPT-4": 96, "Claude-3": 95, "Llama-3": 86 },
  { metric: "Writing", "GPT-4": 88, "Claude-3": 92, "Llama-3": 75 },
];

const comparisonTableData = [
  { metric: "Context Window", "GPT-4": "128k", "Claude-3": "200k", "Llama-3": "8k", "Gemini": "1M" },
  { metric: "Training Data", "GPT-4": "Apr 2023", "Claude-3": "Apr 2024", "Llama-3": "Mar 2024", "Gemini": "Oct 2023" },
  { metric: "Input Cost (1M)", "GPT-4": "$30.00", "Claude-3": "$15.00", "Llama-3": "$0.13", "Gemini": "$0.50" },
  { metric: "Output Cost (1M)", "GPT-4": "$60.00", "Claude-3": "$45.00", "Llama-3": "$0.39", "Gemini": "$1.50" },
  { metric: "Latency P99", "GPT-4": "420ms", "Claude-3": "380ms", "Llama-3": "120ms", "Gemini": "280ms" },
  { metric: "License", "GPT-4": "Proprietary", "Claude-3": "Proprietary", "Llama-3": "Open", "Gemini": "Proprietary" },
];

export default function ComparisonChart() {
  const [selectedModels, setSelectedModels] = useState(["GPT-4", "Claude-3", "Llama-3"]);

  const toggleModel = (model: string) => {
    setSelectedModels(prev =>
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const colors = {
    "GPT-4": "hsl(var(--primary))",
    "Claude-3": "hsl(217 91% 60%)",
    "Llama-3": "hsl(31 90% 65%)",
    "Gemini": "hsl(280 65% 60%)",
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg mb-4">Model Comparison</h2>
        <div className="flex flex-wrap gap-3">
          {["GPT-4", "Claude-3", "Llama-3", "Gemini"].map(model => (
            <div key={model} className="flex items-center gap-2">
              <Checkbox 
                id={`model-${model}`}
                checked={selectedModels.includes(model)}
                onCheckedChange={() => toggleModel(model)}
              />
              <label htmlFor={`model-${model}`} className="text-sm font-medium cursor-pointer">{model}</label>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="benchmarks" className="flex flex-col h-full">
        <div className="px-4 border-b border-border">
          <TabsList className="h-10 bg-transparent p-0">
            <TabsTrigger 
              value="benchmarks" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Benchmarks
            </TabsTrigger>
            <TabsTrigger 
              value="radar" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Radar
            </TabsTrigger>
            <TabsTrigger 
              value="specs" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Specs
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="benchmarks" className="flex-1 p-4 m-0 overflow-auto">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={benchmarkData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                }}
              />
              <Legend />
              {selectedModels.includes("GPT-4") && <Bar dataKey="GPT-4" fill={colors["GPT-4"]} />}
              {selectedModels.includes("Claude-3") && <Bar dataKey="Claude-3" fill={colors["Claude-3"]} />}
              {selectedModels.includes("Llama-3") && <Bar dataKey="Llama-3" fill={colors["Llama-3"]} />}
              {selectedModels.includes("Gemini") && <Bar dataKey="Gemini" fill={colors["Gemini"]} />}
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="radar" className="flex-1 p-4 m-0 overflow-auto">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="metric" stroke="hsl(var(--muted-foreground))" />
              <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
              <Radar name="GPT-4" dataKey="GPT-4" stroke={colors["GPT-4"]} fill={colors["GPT-4"]} fillOpacity={0.15} />
              <Radar name="Claude-3" dataKey="Claude-3" stroke={colors["Claude-3"]} fill={colors["Claude-3"]} fillOpacity={0.15} />
              <Radar name="Llama-3" dataKey="Llama-3" stroke={colors["Llama-3"]} fill={colors["Llama-3"]} fillOpacity={0.15} />
            </RadarChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="specs" className="flex-1 p-4 m-0 overflow-auto">
          <div className="space-y-3">
            {comparisonTableData.map((row, idx) => (
              <div key={idx} className="border border-border rounded-md p-3">
                <div className="font-semibold text-sm mb-2 text-foreground">{row.metric}</div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">GPT-4</span>
                    <p className="font-mono text-foreground">{row["GPT-4"]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Claude-3</span>
                    <p className="font-mono text-foreground">{row["Claude-3"]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Llama-3</span>
                    <p className="font-mono text-foreground">{row["Llama-3"]}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Gemini</span>
                    <p className="font-mono text-foreground">{row["Gemini"]}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
