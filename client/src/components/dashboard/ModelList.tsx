import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowUpDown, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const models = [
  { symbol: "GPT-4", provider: "OpenAI", value: 86.4, change: 0.5, type: "Proprietary" },
  { symbol: "CLAUDE-3", provider: "Anthropic", value: 85.2, change: 1.2, type: "Proprietary" },
  { symbol: "LLAMA-3", provider: "Meta", value: 81.8, change: 2.4, type: "Open Weights" },
  { symbol: "GEMINI-PRO", provider: "Google", value: 80.1, change: -0.3, type: "Proprietary" },
  { symbol: "MISTRAL-L", provider: "Mistral", value: 78.5, change: 0.8, type: "Open Weights" },
  { symbol: "QWEN-MAX", provider: "Alibaba", value: 79.2, change: 1.5, type: "Proprietary" },
  { symbol: "GROK-1", provider: "xAI", value: 76.4, change: -1.1, type: "Open Weights" },
  { symbol: "DBRX", provider: "Databricks", value: 77.9, change: 0.2, type: "Open Weights" },
  { symbol: "CMD-R+", provider: "Cohere", value: 75.6, change: 0.4, type: "Proprietary" },
  { symbol: "PHI-3", provider: "Microsoft", value: 72.1, change: 3.2, type: "Open Weights" },
  { symbol: "GPT-3.5", provider: "OpenAI", value: 70.0, change: -0.5, type: "Proprietary" },
  { symbol: "VICUNA", provider: "LMSYS", value: 68.2, change: -0.2, type: "Open Weights" },
];

export default function ModelList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"value" | "change" | "name">("value");
  const [filterType, setFilterType] = useState<"all" | "proprietary" | "open">("all");
  const [watchlist, setWatchlist] = useState<string[]>(["GPT-4", "CLAUDE-3", "LLAMA-3"]);

  const filtered = models
    .filter(m => {
      const matchesSearch = m.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           m.provider.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" ||
                         (filterType === "proprietary" && m.type === "Proprietary") ||
                         (filterType === "open" && m.type === "Open Weights");
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "value") return b.value - a.value;
      if (sortBy === "change") return b.change - a.change;
      return a.symbol.localeCompare(b.symbol);
    });

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="p-3 border-b border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm tracking-tight">Watchlist</span>
          <div className="flex gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Filter className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterType("all")}>All Types</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("proprietary")}>Proprietary</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("open")}>Open Weights</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortBy("value")}>By Score</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("change")}>By Change</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name")}>By Name</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
          <Input 
            placeholder="Search models..." 
            className="pl-7 h-7 text-xs bg-secondary/50 border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center px-3 py-1 bg-secondary/20 border-b border-border text-[10px] text-muted-foreground font-medium">
        <div className="w-12" />
        <div className="flex-1">Symbol</div>
        <div className="w-14 text-right">Score</div>
        <div className="w-12 text-right">Chg%</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {filtered.map((model) => (
            <div 
              key={model.symbol} 
              className="flex items-center px-3 py-2 hover:bg-secondary/50 cursor-pointer border-b border-border/50 transition-colors group"
            >
              <button
                onClick={() => setWatchlist(prev =>
                  prev.includes(model.symbol)
                    ? prev.filter(m => m !== model.symbol)
                    : [...prev, model.symbol]
                )}
                className="w-6 flex justify-center"
              >
                <Star 
                  className={`h-3.5 w-3.5 transition-colors ${
                    watchlist.includes(model.symbol) 
                      ? 'fill-primary text-primary' 
                      : 'text-muted-foreground'
                  }`}
                />
              </button>
              <div className="flex-1 flex flex-col pl-1">
                <span className="font-bold text-sm font-mono group-hover:text-primary transition-colors">{model.symbol}</span>
                <span className="text-[10px] text-muted-foreground">{model.provider}</span>
              </div>
              <div className="w-14 text-right font-mono text-sm text-foreground">
                {model.value.toFixed(1)}
              </div>
              <div className={`w-12 text-right font-mono text-xs ${model.change > 0 ? 'text-primary' : 'text-red-400'}`}>
                {model.change > 0 ? '+' : ''}{model.change}%
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
