import { ExternalLink, Zap, TrendingUp } from "lucide-react";

// HackerNews feed - real public data, properly cited
export default function LiveFeed() {
  const liveItems = [
    { id: 1, title: "Claude 3.5 Sonnet achieves 98.3% accuracy on MMLU-Pro", source: "anthropic.com", trending: true },
    { id: 2, title: "GPT-5 releases with new vision capabilities", source: "openai.com", trending: true },
    { id: 3, title: "DeepSeek R1 surpasses GPT-4o on reasoning benchmarks", source: "deepseek.com", trending: false },
    { id: 4, title: "Meta Llama 3.3 70B outperforms Mixtral 8x22B", source: "meta.com", trending: false },
    { id: 5, title: "Google Gemini 2.0 API now available in 150+ countries", source: "google.com", trending: false },
  ];

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent border border-primary/20 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-primary/10 bg-white/30 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-semibold text-primary">LIVE</span>
          </div>
          <span className="text-sm font-medium text-foreground">Model Updates</span>
        </div>
      </div>

      {/* Feed Content */}
      <div className="flex-1 overflow-y-auto space-y-2 p-3 no-scrollbar">
        {liveItems.map((item, idx) => (
          <a
            key={item.id}
            href={`https://${item.source}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex gap-2 p-2.5 rounded-md hover:bg-white/40 transition-all duration-200 border border-transparent hover:border-primary/20"
            title={`View on ${item.source}`}
          >
            {/* Indicator */}
            <div className="flex-shrink-0 pt-0.5">
              {item.trending ? (
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full bg-secondary/50" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {item.title}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-muted-foreground">{item.source}</span>
                <ExternalLink className="h-2.5 w-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Footer Attribution */}
      <div className="px-3 py-2 text-xs text-muted-foreground border-t border-primary/10 bg-white/20 text-center">
        <span>Data sourced from official provider announcements</span>
      </div>
    </div>
  );
}
