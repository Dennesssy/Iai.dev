import { useState } from "react";
import { PROVIDERS, MODELS } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface ProviderRegistryProps {
  selectedModelIds?: string[];
}

export default function ProviderRegistry({ selectedModelIds = [] }: ProviderRegistryProps) {
  const [sortBy, setSortBy] = useState<"price" | "latency" | "name">("latency");

  const statusIcon = (status: "operational" | "degraded" | "down") => {
    switch (status) {
      case "operational":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "degraded":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "down":
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const statusColor = (status: "operational" | "degraded" | "down") => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-700";
      case "degraded":
        return "bg-yellow-100 text-yellow-700";
      case "down":
        return "bg-red-100 text-red-700";
    }
  };

  return (
    <div className="flex flex-col h-full bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Provider Registry</h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "price" | "latency" | "name")}
            className="text-xs px-2 py-1 rounded border border-border bg-background"
          >
            <option value="latency">Sort by Latency</option>
            <option value="price">Sort by Price</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
        <p className="text-sm text-muted-foreground">
          {Object.keys(PROVIDERS).length} providers • Real-time pricing & latency
        </p>
      </div>

      {/* Providers List */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {Object.values(PROVIDERS).map((provider) => (
            <div key={provider.id} className="p-4 hover:bg-secondary/30 transition-colors">
              {/* Provider Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground">{provider.name}</h4>
                  </div>
                </div>
                <Badge className={`${statusColor(provider.status)} border-0`}>
                  <span className="flex items-center gap-1">
                    {statusIcon(provider.status)}
                    {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                  </span>
                </Badge>
              </div>

              {/* Endpoints Table */}
              <div className="space-y-2">
                {provider.endpoints
                  .filter((ep) => !selectedModelIds.length || selectedModelIds.includes(ep.modelId))
                  .map((endpoint) => {
                    const model = MODELS[endpoint.modelId];
                    if (!model) return null;

                    return (
                      <div
                        key={`${provider.id}-${endpoint.modelId}`}
                        className="bg-background/50 rounded-lg p-3 border border-border/50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: model.color }}
                            />
                            <span className="font-medium text-sm">{model.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{endpoint.region}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          {/* Input Price */}
                          <div>
                            <p className="text-muted-foreground">Input</p>
                            <p className="font-mono font-medium text-foreground">
                              ${endpoint.inputPrice.toFixed(2)}/1M
                            </p>
                          </div>

                          {/* Output Price */}
                          <div>
                            <p className="text-muted-foreground">Output</p>
                            <p className="font-mono font-medium text-foreground">
                              ${endpoint.outputPrice.toFixed(2)}/1M
                            </p>
                          </div>

                          {/* TTFT */}
                          <div>
                            <p className="text-muted-foreground">TTFT</p>
                            <p className="font-mono font-medium text-primary">
                              {endpoint.ttftMs}ms
                            </p>
                          </div>

                          {/* Output Speed */}
                          <div>
                            <p className="text-muted-foreground">Speed</p>
                            <p className="font-mono font-medium text-primary">
                              {endpoint.outputTokensPerSec.toFixed(1)}t/s
                            </p>
                          </div>
                        </div>

                        {/* Status Bar */}
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Blended (3:1 ratio): ${((endpoint.inputPrice + endpoint.outputPrice * 3) / 4).toFixed(3)}/1M
                            </span>
                            <Badge
                              variant="outline"
                              className={`${statusColor(endpoint.status)} border-0 text-xs`}
                            >
                              {endpoint.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
