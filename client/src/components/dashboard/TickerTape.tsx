import { useMemo } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { MODELS, PROVIDERS } from "@/lib/mockData";

interface TickerItem {
  id: string;
  symbol: string;
  provider?: string;
  price: string;
  latency: string;
  trend: "up" | "down" | "stable";
  color?: string;
  isIndex?: boolean;
}

export default function TickerTape() {
  const tickerItems = useMemo(() => {
    const items: TickerItem[] = [];
    
    // Process providers to get pricing and latency data
    Object.values(PROVIDERS).forEach(provider => {
      provider.endpoints.forEach(endpoint => {
        const model = MODELS[endpoint.modelId];
        if (!model) return;
        
        items.push({
          id: `${provider.id}-${model.id}`,
          symbol: model.name,
          provider: provider.name,
          price: `$${endpoint.inputPrice.toFixed(3)}/$${endpoint.outputPrice.toFixed(3)}`,
          latency: `${endpoint.ttftMs}ms`,
          trend: model.trend || "stable",
          color: model.color
        });
      });
    });
    
    // Add some market indices/aggregates at the start
    const marketIndices: TickerItem[] = [
      { id: "idx-1", symbol: "MMLU AVG", price: "82.4%", latency: "+1.2%", trend: "up", isIndex: true },
      { id: "idx-2", symbol: "COST INDEX", price: "$2.45", latency: "-5.0%", trend: "down", isIndex: true },
      { id: "idx-3", symbol: "LATENCY AVG", price: "280ms", latency: "-12ms", trend: "down", isIndex: true },
    ];

    return [...marketIndices, ...items];
  }, []);

  return (
    <div className="w-full bg-slate-950 text-slate-300 border-b border-slate-800 overflow-hidden h-8 flex items-center relative z-40">
      <div className="ticker-track flex items-center gap-8 whitespace-nowrap animate-ticker hover:pause pl-4">
        {/* Double the list to create seamless loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={`${item.id}-${idx}`} className="flex items-center gap-2 text-xs font-mono">
            <span className={`font-bold ${item.isIndex ? "text-yellow-400" : "text-white"}`}>
              {item.isIndex ? item.symbol : `${item.symbol} (${item.provider})`}
            </span>
            
            <div className="flex items-center gap-1">
              {!item.isIndex && <span className="text-slate-500">P:</span>}
              <span>{item.price}</span>
            </div>
            
            <div className="flex items-center gap-1">
               {!item.isIndex && <span className="text-slate-500">L:</span>}
              <span className={item.trend === "up" ? "text-green-400" : item.trend === "down" ? "text-red-400" : "text-slate-400"}>
                {item.latency}
              </span>
              {item.trend === "up" && <ArrowUp className="h-3 w-3 text-green-500" />}
              {item.trend === "down" && <ArrowDown className="h-3 w-3 text-red-500" />}
              {item.trend === "stable" && <Minus className="h-3 w-3 text-slate-500" />}
            </div>
            
            <div className="w-px h-3 bg-slate-800 mx-2" />
          </div>
        ))}
      </div>
      
      <style>{`
        .animate-ticker {
          animation: ticker 120s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
