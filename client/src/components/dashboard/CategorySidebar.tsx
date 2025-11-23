import { useState } from "react";
import { 
  TrendingUp, 
  Zap, 
  DollarSign, 
  Lock, 
  Unlock, 
  BarChart3, 
  Brain,
  Code,
  Lightbulb,
  Users,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const categories = [
  {
    name: "Performance",
    items: [
      { icon: TrendingUp, label: "Reasoning (MMLU)", active: true },
      { icon: Code, label: "Coding (HumanEval)" },
      { icon: Brain, label: "Math (GSM8K)" },
      { icon: BarChart3, label: "Knowledge (ARC-C)" },
    ]
  },
  {
    name: "Cost Analysis",
    items: [
      { icon: DollarSign, label: "Input Pricing" },
      { icon: Zap, label: "Throughput" },
      { icon: Lightbulb, label: "Efficiency Ratio" },
    ]
  },
  {
    name: "Model Type",
    items: [
      { icon: Lock, label: "Proprietary Models" },
      { icon: Unlock, label: "Open Source" },
      { icon: Users, label: "Frontier Models" },
    ]
  }
];

export default function CategorySidebar() {
  const [expanded, setExpanded] = useState<string | null>("Performance");

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border">
      <div className="p-4 border-b border-border">
        <h2 className="font-bold text-lg tracking-tight">Categories</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {categories.map((category) => (
            <div key={category.name} className="border-b border-border/50">
              <button
                onClick={() => setExpanded(expanded === category.name ? null : category.name)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors text-foreground font-semibold text-sm"
              >
                {category.name}
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${expanded === category.name ? '' : '-rotate-90'}`}
                />
              </button>
              
              {expanded === category.name && (
                <div className="bg-secondary/20 flex flex-col">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        className={`flex items-center gap-3 px-6 py-2 text-xs transition-colors ${
                          item.active
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border space-y-2">
        <Button className="w-full h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30">
          Save View
        </Button>
        <Button variant="outline" className="w-full h-8 text-xs">
          Settings
        </Button>
      </div>
    </div>
  );
}
