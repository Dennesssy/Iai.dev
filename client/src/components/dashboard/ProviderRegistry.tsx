import { useState } from "react";
import { PROVIDERS, MODELS } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, ChevronDown } from "lucide-react";

interface ProviderRegistryProps {
  selectedModelIds?: string[];
}

export default function ProviderRegistry({ selectedModelIds = [] }: ProviderRegistryProps) {
  const [expandedProviders, setExpandedProviders] = useState<Record<string, boolean>>({});

  const toggleProvider = (id: string) => {
    setExpandedProviders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const statusIcon = (status: "operational" | "degraded" | "down") => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-3 w-3 text-green-600" />;
      case "degraded":
        return <AlertCircle className="h-3 w-3 text-yellow-600" />;
      case "down":
        return <XCircle className="h-3 w-3 text-red-600" />;
    }
  };

  return (
    <div className="flex flex-col divide-y divide-border/50">
      {Object.values(PROVIDERS).map((provider) => (
        <div key={provider.id} className="flex flex-col">
          {/* Provider Row (Like Left Sidebar) */}
          <button
            onClick={() => toggleProvider(provider.id)}
            className="w-full flex items-center justify-between px-6 py-2 text-xs hover:bg-secondary/30 transition-colors group text-left"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className="truncate text-foreground font-medium">{provider.name}</span>
              {statusIcon(provider.status)}
            </div>
            <ChevronDown
              className={`h-3 w-3 transition-transform flex-shrink-0 ${expandedProviders[provider.id] ? '' : '-rotate-90'} text-muted-foreground group-hover:text-foreground`}
            />
          </button>

          {/* Expanded Details */}
          {expandedProviders[provider.id] && (
            <div className="bg-secondary/5 px-6 py-2 space-y-2">
              {provider.endpoints
                .filter((ep) => !selectedModelIds.length || selectedModelIds.includes(ep.modelId))
                .map((endpoint) => {
                  const model = MODELS[endpoint.modelId];
                  if (!model) return null;

                  return (
                    <div
                      key={`${provider.id}-${endpoint.modelId}`}
                      className="flex flex-col gap-1 pb-2 border-b border-border/30 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: model.color }}
                        />
                        <span className="text-[10px] font-semibold text-foreground/80">{model.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{endpoint.region}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Input:</span>
                          <span className="font-mono">${endpoint.inputPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Output:</span>
                          <span className="font-mono">${endpoint.outputPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Latency:</span>
                          <span className="font-mono text-primary">{endpoint.ttftMs}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Speed:</span>
                          <span className="font-mono text-primary">{endpoint.outputTokensPerSec.toFixed(1)}t/s</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {provider.endpoints.filter((ep) => !selectedModelIds.length || selectedModelIds.includes(ep.modelId)).length === 0 && (
                   <div className="text-[10px] text-muted-foreground italic">No matching models</div>
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
