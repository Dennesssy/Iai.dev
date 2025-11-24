import { MODELS, PROVIDERS, getModelScores, BENCHMARKS } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ModelDetailsProps {
  modelId?: string;
}

export default function ModelDetails({ modelId }: ModelDetailsProps) {
  const model = modelId ? MODELS[modelId] : null;

  if (!model) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4">
        <p className="text-sm text-muted-foreground">Select a model to view details</p>
      </div>
    );
  }

  // Get providers offering this model
  const providersForModel = Object.values(PROVIDERS)
    .filter((p) => p.endpoints.some((e) => e.modelId === modelId))
    .map((p) => ({
      provider: p,
      endpoint: p.endpoints.find((e) => e.modelId === modelId)!,
    }));

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3 pb-3 border-b border-border">
          <div
            className="w-4 h-4 rounded flex-shrink-0"
            style={{ backgroundColor: model.color }}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight">{model.name}</h3>
            <p className="text-xs text-muted-foreground">{model.creator}</p>
          </div>
        </div>

        {/* Core Specs */}
        <div className="space-y-3">
          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Parameters</p>
            <p className="font-mono font-bold text-sm">{model.parameters}</p>
          </div>

          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Context Window</p>
            <p className="font-mono font-bold text-sm">{model.contextWindow.toLocaleString()} tokens</p>
          </div>

          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Training Data Cutoff</p>
            <p className="font-mono font-bold text-sm">{model.trainingDataCutoff}</p>
          </div>

          <div className="bg-secondary/30 rounded-lg p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">Released</p>
            <p className="font-mono font-bold text-sm">
              {new Date(model.releaseDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        <Separator />

        {/* Capabilities */}
        <div>
          <p className="text-xs font-bold mb-2 uppercase">Capabilities</p>
          <div className="flex gap-2 flex-wrap">
            {model.multimodal && <Badge>Multimodal</Badge>}
            {model.reasoning && <Badge>Reasoning</Badge>}
            {model.openSource && <Badge>Open Source</Badge>}
          </div>
        </div>

        <Separator />

        {/* Benchmarks */}
        <div>
          <p className="text-xs font-bold mb-3 uppercase">Benchmark Scores</p>
          <div className="space-y-2">
            {Object.entries(BENCHMARKS).map(([key, bench]) => {
              const { score } = getModelScores(modelId || "", key);
              return (
                <div
                  key={key}
                  className="flex items-center justify-between bg-secondary/30 rounded p-2"
                >
                  <div>
                    <p className="text-xs font-medium">{bench.name}</p>
                    <p className="text-[10px] text-muted-foreground">{bench.description}</p>
                  </div>
                  <p className="font-mono font-bold text-sm text-primary">{score.toFixed(1)}%</p>
                </div>
              );
            })}
          </div>
        </div>

        <Separator />

        {/* Providers */}
        <div>
          <p className="text-xs font-bold mb-3 uppercase">Available Providers</p>
          <div className="space-y-2">
            {providersForModel.map(({ provider, endpoint }) => (
              <div key={provider.id} className="bg-secondary/30 rounded p-2.5 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold">{provider.name}</p>
                  <Badge
                    className={`text-[10px] border-0 ${
                      provider.status === "operational"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {provider.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                  <div>
                    <p className="text-[10px]">Input: ${endpoint.inputPrice}/1M</p>
                    <p className="text-[10px]">Output: ${endpoint.outputPrice}/1M</p>
                  </div>
                  <div>
                    <p className="text-[10px]">TTFT: {endpoint.ttftMs}ms</p>
                    <p className="text-[10px]">Speed: {endpoint.outputTokensPerSec}t/s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
