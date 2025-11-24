import { useState, useMemo } from "react";
import { Search, ChevronDown, Star, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MODELS, MODEL_CATEGORIES, getModelScores } from "@/lib/mockData";

interface ModelNavigatorProps {
  selectedModels: string[];
  onModelSelect: (modelId: string) => void;
  onModelDeselect: (modelId: string) => void;
}

export default function ModelNavigator({
  selectedModels,
  onModelSelect,
  onModelDeselect,
}: ModelNavigatorProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    popular: true,
    "By Size": false,
    "By Cost Tier": false,
    "By Provider": false,
  });
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleFavorite = (modelId: string) => {
    setFavorites((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const filteredModels = useMemo(() => {
    return Object.values(MODELS).filter((model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.creator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const ModelEntry = ({ modelId }: { modelId: string }) => {
    const model = MODELS[modelId];
    if (!model) return null;

    const isSelected = selectedModels.includes(modelId);
    const isFavorite = favorites.includes(modelId);
    const { score } = getModelScores(modelId, "mmlu-pro");

    return (
      <div
        key={modelId}
        onClick={() => (isSelected ? onModelDeselect(modelId) : onModelSelect(modelId))}
        className={`
          px-3 py-2.5 rounded-md cursor-pointer transition-all border
          ${
            isSelected
              ? "bg-primary/10 border-primary/30 shadow-sm"
              : "border-transparent hover:bg-secondary/50"
          }
        `}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: model.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{model.name}</p>
                <p className="text-xs text-muted-foreground">{model.creator}</p>
              </div>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(modelId);
            }}
            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
          >
            <Star className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
          </button>
        </div>

        {/* Quick metrics */}
        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-background/50 font-mono text-primary font-medium">
            {score.toFixed(1)}%
          </span>
          <span className="text-muted-foreground">{model.size}</span>
          {model.multimodal && (
            <span className="px-1.5 py-0.5 rounded bg-blue-100/50 text-blue-700 text-xs">
              MM
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-3 border-b border-border shrink-0">
        <h2 className="text-sm font-bold mb-3 text-foreground">Models</h2>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Model Count */}
      {selectedModels.length > 0 && (
        <div className="px-3 py-2 bg-primary/5 border-b border-border text-xs text-muted-foreground">
          {selectedModels.length} model{selectedModels.length !== 1 ? "s" : ""} selected
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {searchTerm ? (
            // Search results
            <div className="space-y-2">
              {filteredModels.length > 0 ? (
                filteredModels.map((model) => (
                  <ModelEntry key={model.id} modelId={model.id} />
                ))
              ) : (
                <p className="text-xs text-muted-foreground p-2">No models found</p>
              )}
            </div>
          ) : (
            // Categorized view
            <>
              {/* Favorites Section */}
              {favorites.length > 0 && (
                <div>
                  <button
                    onClick={() => toggleSection("favorites")}
                    className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expandedSections["favorites"] ? "" : "-rotate-90"
                      }`}
                    />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-semibold">Favorites</span>
                  </button>
                  {expandedSections["favorites"] && (
                    <div className="space-y-2 mt-2 ml-2">
                      {favorites.map((modelId) => (
                        <ModelEntry key={modelId} modelId={modelId} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Popular */}
              <div>
                <button
                  onClick={() => toggleSection("popular")}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedSections["popular"] ? "" : "-rotate-90"
                    }`}
                  />
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">Popular</span>
                </button>
                {expandedSections["popular"] && (
                  <div className="space-y-2 mt-2 ml-2">
                    {MODEL_CATEGORIES.popular.models.map((modelId) => (
                      <ModelEntry key={modelId} modelId={modelId} />
                    ))}
                  </div>
                )}
              </div>

              {/* By Size */}
              <div>
                <button
                  onClick={() => toggleSection("By Size")}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedSections["By Size"] ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="text-sm font-semibold">By Size</span>
                </button>
                {expandedSections["By Size"] && (
                  <div className="space-y-3 mt-2 ml-2">
                    {Object.entries(MODEL_CATEGORIES.byCostTier.sections).map(([tier, models]) => (
                      <div key={tier}>
                        <p className="text-xs font-medium text-muted-foreground px-2 mb-1">{tier}</p>
                        <div className="space-y-1.5">
                          {models.map((modelId) => (
                            <ModelEntry key={modelId} modelId={modelId} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* By Provider */}
              <div>
                <button
                  onClick={() => toggleSection("By Provider")}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-secondary/50 transition-colors"
                >
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      expandedSections["By Provider"] ? "" : "-rotate-90"
                    }`}
                  />
                  <span className="text-sm font-semibold">By Provider</span>
                </button>
                {expandedSections["By Provider"] && (
                  <div className="space-y-3 mt-2 ml-2">
                    {Object.entries(MODEL_CATEGORIES.byProvider.sections).map(([provider, models]) => (
                      <div key={provider}>
                        <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                          {provider}
                        </p>
                        <div className="space-y-1.5">
                          {models.map((modelId) => (
                            <ModelEntry key={modelId} modelId={modelId} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {selectedModels.length > 0 && (
        <div className="p-3 border-t border-border shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectedModels.forEach(onModelDeselect)}
            className="w-full text-xs h-8"
          >
            Clear All
          </Button>
        </div>
      )}
    </div>
  );
}
