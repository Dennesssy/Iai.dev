import { MODELS, PROVIDERS, getModelScores } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

interface SavedModelsProps {
  favorites: string[];
  onToggleFavorite: (modelId: string) => void;
  selectedModel?: string;
  onSelectModel: (modelId: string) => void;
}

export default function SavedModels({
  favorites,
  onToggleFavorite,
  selectedModel,
  onSelectModel,
}: SavedModelsProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm">Watchlist</h3>
          <span className="text-xs text-muted-foreground">{favorites.length} saved</span>
        </div>
      </div>

      {/* List */}
      <ScrollArea className="flex-1">
        {favorites.length === 0 ? (
          <div className="p-4 text-center text-xs text-muted-foreground">
            No saved models. Click the star to add favorites.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {favorites.map((modelId) => {
              const model = MODELS[modelId];
              if (!model) return null;

              const { score } = getModelScores(modelId, "mmlu-pro");
              const isSelected = selectedModel === modelId;

              // Get cheapest provider price for this model
              const cheapestPrice = Math.min(
                ...Object.values(PROVIDERS)
                  .flatMap((p) => p.endpoints)
                  .filter((e) => e.modelId === modelId)
                  .map((e) => (e.inputPrice + e.outputPrice) / 2)
              );

              return (
                <div
                  key={modelId}
                  onClick={() => onSelectModel(modelId)}
                  className={`
                    p-3 cursor-pointer transition-all border-b border-border/30
                    ${
                      isSelected
                        ? "bg-primary/10 border-primary/30"
                        : "hover:bg-secondary/50"
                    }
                  `}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: model.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{model.name}</p>
                        <p className="text-xs text-muted-foreground">{model.creator}</p>
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(modelId);
                      }}
                      className="text-primary hover:text-primary/80 transition-colors flex-shrink-0"
                    >
                      <Star className="h-4 w-4 fill-primary" />
                    </button>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-2 text-xs mb-2">
                    {/* MMLU Score */}
                    <div>
                      <p className="text-muted-foreground">Score</p>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-primary">{score.toFixed(1)}%</span>
                        {model.trend === "up" && <TrendingUp className="h-3 w-3 text-green-600" />}
                        {model.trend === "down" && <TrendingDown className="h-3 w-3 text-red-600" />}
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="text-muted-foreground">Price</p>
                      <p className="font-mono font-bold">${cheapestPrice.toFixed(2)}</p>
                    </div>

                    {/* Cost Tier */}
                    <div>
                      <p className="text-muted-foreground">Tier</p>
                      <Badge variant="outline" className="text-xs capitalize">
                        {model.costTier}
                      </Badge>
                    </div>
                  </div>

                  {/* Quick Features */}
                  <div className="flex gap-1 flex-wrap">
                    {model.multimodal && (
                      <Badge variant="secondary" className="text-xs">
                        🖼️ MM
                      </Badge>
                    )}
                    {model.reasoning && (
                      <Badge variant="secondary" className="text-xs">
                        🧠 Reasoning
                      </Badge>
                    )}
                    {model.openSource && (
                      <Badge variant="secondary" className="text-xs">
                        🔓 Open
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
