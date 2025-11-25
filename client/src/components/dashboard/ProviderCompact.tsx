import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Zap, DollarSign, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Model {
  id: string;
  name: string;
  inputCost: number;
  outputCost: number;
  contextLength: number;
  maxTokens: number;
  description: string;
  supportedParameters: string[];
}

interface Provider {
  name: string;
  modelCount: number;
  models: Model[];
}

export default function ProviderCompact() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [openProviders, setOpenProviders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const response = await fetch("/api/providers");
      const data = await response.json();
      setProviders(data.providers);
    } catch (error) {
      console.error("Failed to fetch providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProvider = (name: string) => {
    setOpenProviders(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Providers</h2>
        <Badge variant="outline">{providers.length} providers</Badge>
      </div>

      {providers.map((provider) => {
        const isOpen = openProviders.has(provider.name);
        const avgInputCost = provider.models.reduce((sum, m) => sum + m.inputCost, 0) / provider.models.length;
        const avgOutputCost = provider.models.reduce((sum, m) => sum + m.outputCost, 0) / provider.models.length;

        return (
          <Collapsible
            key={provider.name}
            open={isOpen}
            onOpenChange={() => toggleProvider(provider.name)}
          >
            <Card className="overflow-hidden">
              <CollapsibleTrigger className="w-full">
                <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-lg font-bold">
                          {provider.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {provider.modelCount} model{provider.modelCount !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <div className="text-xs text-muted-foreground">Avg Pricing</div>
                        <div className="text-sm font-mono">
                          ${avgInputCost.toFixed(2)}/${avgOutputCost.toFixed(2)} per 1K
                        </div>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="border-t">
                  <div className="max-h-96 overflow-y-auto">
                    {provider.models.map((model, idx) => (
                      <div
                        key={model.id}
                        className={`p-3 ${idx !== provider.models.length - 1 ? "border-b" : ""} hover:bg-muted/30`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{model.name}</div>
                            {model.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                {model.description}
                              </p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              <Badge variant="outline" className="text-xs">
                                <Layers className="h-3 w-3 mr-1" />
                                {model.contextLength?.toLocaleString() || "N/A"} ctx
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                {model.maxTokens?.toLocaleString()} max
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                <DollarSign className="h-3 w-3 mr-1" />
                                ${model.inputCost.toFixed(3)}/${model.outputCost.toFixed(3)}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {model.supportedParameters && model.supportedParameters.length > 0 && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              Parameters ({model.supportedParameters.length})
                            </summary>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {model.supportedParameters.slice(0, 10).map((param) => (
                                <Badge key={param} variant="secondary" className="text-xs">
                                  {param}
                                </Badge>
                              ))}
                              {model.supportedParameters.length > 10 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{model.supportedParameters.length - 10} more
                                </Badge>
                              )}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        );
      })}
    </div>
  );
}
