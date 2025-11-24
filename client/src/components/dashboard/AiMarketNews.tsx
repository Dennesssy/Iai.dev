import { AI_MARKET_NEWS, MODELS } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function AiMarketNews() {
  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-border">
        {AI_MARKET_NEWS.map((news) => {
          const model = news.modelId ? MODELS[news.modelId] : null;
          const typeColors: Record<string, string> = {
            release: "bg-blue-100 text-blue-700",
            benchmark: "bg-green-100 text-green-700",
            pricing: "bg-orange-100 text-orange-700",
            provider: "bg-purple-100 text-purple-700",
            research: "bg-indigo-100 text-indigo-700",
          };

          return (
            <div key={news.id} className="p-3 hover:bg-secondary/30 transition-colors border-b border-border/30">
              <div className="flex items-start gap-3 mb-2">
                <div className="text-lg flex-shrink-0">{news.icon}</div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm leading-tight mb-1">{news.title}</h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{news.description}</p>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge className={`text-xs capitalize border-0 ${typeColors[news.type]}`}>
                      {news.type}
                    </Badge>
                    {model && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: model.color,
                          color: model.color,
                        }}
                      >
                        {model.name}
                      </Badge>
                    )}
                    <span className="text-[10px] text-muted-foreground ml-auto">
                      {new Date(news.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
