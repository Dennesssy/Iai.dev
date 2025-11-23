import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Zap, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock OpenRouter data
const mockOpenRouterModels = [
  {
    id: "openai/gpt-4-turbo",
    name: "GPT-4 Turbo",
    provider: "OpenAI",
    emoji: "🤖",
    description: "Most capable model for complex reasoning, code generation, and analysis",
    pricing: { input: 0.01, output: 0.03 },
    contextWindow: 128000,
    speed: "Fast",
    tier: "Frontier",
    likes: 1250,
  },
  {
    id: "anthropic/claude-3-opus",
    name: "Claude 3 Opus",
    provider: "Anthropic",
    emoji: "🧠",
    description: "Advanced reasoning with excellent instruction following",
    pricing: { input: 0.015, output: 0.075 },
    contextWindow: 200000,
    speed: "Very Fast",
    tier: "Frontier",
    likes: 980,
  },
  {
    id: "meta/llama-3-70b",
    name: "Llama 3 70B",
    provider: "Meta",
    emoji: "🦙",
    description: "Open-source model for research and commercial use",
    pricing: { input: 0.0005, output: 0.001 },
    contextWindow: 8000,
    speed: "Medium",
    tier: "Open Source",
    likes: 742,
  },
  {
    id: "google/gemini-pro",
    name: "Gemini Pro",
    provider: "Google",
    emoji: "✨",
    description: "Multimodal capabilities with strong reasoning",
    pricing: { input: 0.0025, output: 0.0075 },
    contextWindow: 32000,
    speed: "Very Fast",
    tier: "Frontier",
    likes: 654,
  },
  {
    id: "mistral/mistral-large",
    name: "Mistral Large",
    provider: "Mistral",
    emoji: "⚡",
    description: "Efficient reasoning with excellent performance metrics",
    pricing: { input: 0.008, output: 0.024 },
    contextWindow: 32000,
    speed: "Fast",
    tier: "Advanced",
    likes: 523,
  },
  {
    id: "databricks/dbrx",
    name: "DBRX",
    provider: "Databricks",
    emoji: "🔥",
    description: "Optimized for enterprise workloads and fine-tuning",
    pricing: { input: 0.0006, output: 0.0018 },
    contextWindow: 32000,
    speed: "Very Fast",
    tier: "Open Source",
    likes: 389,
  },
];

export default function ModelNodesMosaic() {
  const [models, setModels] = useState(mockOpenRouterModels);
  const [loading, setLoading] = useState(false);
  const [likedModels, setLikedModels] = useState<string[]>([]);

  // Simulate fetching from OpenRouter
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setModels(mockOpenRouterModels);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleLike = (modelId: string) => {
    setLikedModels(prev =>
      prev.includes(modelId) ? prev.filter(id => id !== modelId) : [...prev, modelId]
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="font-bold text-lg mb-2">Model Nodes</h2>
        <p className="text-sm text-muted-foreground">Latest LLMs from OpenRouter</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid auto-rows-max gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))" }}>
          {loading ? (
            Array(6).fill(null).map((_, i) => (
              <div key={i} className="h-48 bg-card rounded-lg border border-border animate-pulse" />
            ))
          ) : (
            models.map((model) => (
              <div
                key={model.id}
                className="group relative bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all hover:shadow-lg"
              >
                <div className="flex h-full">
                  {/* 30% - Image & Title Section */}
                  <div className="w-[30%] bg-gradient-to-br from-primary/10 to-primary/5 p-4 flex flex-col items-center justify-center border-r border-border relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1))] bg-[length:20px_20px]" />
                    <div className="text-5xl mb-3 drop-shadow-lg">{model.emoji}</div>
                    <h3 className="font-bold text-center text-sm leading-tight text-foreground">{model.name}</h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">{model.provider}</p>
                  </div>

                  {/* 70% - Preview Content Section */}
                  <div className="w-[70%] p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {model.description}
                      </p>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Context</span>
                          <span className="font-mono text-foreground">{(model.contextWindow / 1000).toFixed(0)}k</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Input Price</span>
                          <span className="font-mono text-foreground">${model.pricing.input.toFixed(4)}/1k</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-muted-foreground">Output Price</span>
                          <span className="font-mono text-foreground">${model.pricing.output.toFixed(4)}/1k</span>
                        </div>
                      </div>

                      <div className="flex gap-1 flex-wrap">
                        <Badge variant="outline" className="text-[9px] py-0.5 px-1.5">{model.tier}</Badge>
                        <Badge variant="secondary" className="text-[9px] py-0.5 px-1.5">
                          <Zap className="h-2.5 w-2.5 mr-0.5" />
                          {model.speed}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-border/50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLike(model.id)}
                        className="h-6 px-2 text-xs gap-1"
                      >
                        <Heart
                          className={`h-3 w-3 ${
                            likedModels.includes(model.id)
                              ? "fill-primary text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="font-mono text-[10px]">{model.likes + (likedModels.includes(model.id) ? 1 : 0)}</span>
                      </Button>
                      <Button className="h-6 px-3 text-xs bg-primary/20 text-primary hover:bg-primary/30">
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
