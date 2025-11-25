import { useState } from "react";
import { MODELS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { X, Plus, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WatchlistProps {
  favorites: string[];
  onToggleFavorite: (modelId: string) => void;
}

export default function Watchlist({ favorites, onToggleFavorite }: WatchlistProps) {
  const [showAddModel, setShowAddModel] = useState(false);
  const [selectedAddModel, setSelectedAddModel] = useState<string>("");

  const availableModels = Object.values(MODELS).filter(
    (model) => !favorites.includes(model.id)
  );

  const watchlistModels = Object.values(MODELS).filter((model) =>
    favorites.includes(model.id)
  );

  const handleAddModel = () => {
    if (selectedAddModel) {
      onToggleFavorite(selectedAddModel);
      setSelectedAddModel("");
      setShowAddModel(false);
    }
  };

  const handleRemoveModel = (modelId: string) => {
    onToggleFavorite(modelId);
  };

  return (
    <div className="flex flex-col h-full bg-secondary/5 p-0">
      {/* Add Model Section */}
      <div className="px-4 py-3 border-b border-border/50 space-y-2">
        {showAddModel ? (
          <div className="space-y-2">
            <Select value={selectedAddModel} onValueChange={setSelectedAddModel}>
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Select a model..." />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: model.color }}
                      />
                      <span>{model.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="h-7 text-xs flex-1"
                onClick={handleAddModel}
                disabled={!selectedAddModel}
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs flex-1"
                onClick={() => {
                  setShowAddModel(false);
                  setSelectedAddModel("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="w-full h-8 text-xs gap-2"
            onClick={() => setShowAddModel(true)}
            disabled={availableModels.length === 0}
          >
            <Plus className="h-3 w-3" />
            Add Model
          </Button>
        )}
      </div>

      {/* Watchlist Items */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border/50">
          {watchlistModels.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground text-xs">
              <Star className="h-5 w-5 mx-auto mb-2 opacity-50" />
              <p>No models in watchlist</p>
              <p className="text-xs mt-1">Add models to track performance</p>
            </div>
          ) : (
            watchlistModels.map((model) => (
              <div
                key={model.id}
                className="px-4 py-3 hover:bg-secondary/50 transition-colors flex items-center justify-between group"
                data-testid={`watchlist-item-${model.id}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: model.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {model.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{model.provider}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveModel(model.id)}
                  data-testid={`remove-watchlist-${model.id}`}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Stats Footer */}
      {watchlistModels.length > 0 && (
        <div className="px-4 py-2 border-t border-border/50 text-xs text-muted-foreground text-center">
          {watchlistModels.length} model{watchlistModels.length !== 1 ? "s" : ""} tracked
        </div>
      )}
    </div>
  );
}
