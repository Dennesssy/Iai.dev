import { useState } from "react";
import { Bookmark, BookOpen, TrendingUp, Bell, Users, Database, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ModelDetails from "./ModelDetails";
import AiMarketNews from "./AiMarketNews";
import AlertsPanel from "./AlertsPanel";
import CommunityInsights from "./CommunityInsights";
import ProviderRegistry from "./ProviderRegistry";
import { MODELS } from "@/lib/mockData";

interface RightSidebarProps {
  favorites: string[];
  onToggleFavorite: (modelId: string) => void;
  selectedModel?: string;
  onSelectModel: (modelId: string) => void;
}

type TabValue = "providers" | "models" | "news" | "alerts" | "community";

export default function RightSidebar({
  favorites,
  onToggleFavorite,
  selectedModel,
  onSelectModel,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("providers");

  const navItems: { id: TabValue; label: string; icon: React.ReactNode }[] = [
    { id: "providers", label: "Providers", icon: <Database className="h-4 w-4" /> },
    { id: "models", label: "Models", icon: <Box className="h-4 w-4" /> },
    { id: "news", label: "News", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "alerts", label: "Alerts", icon: <Bell className="h-4 w-4" /> },
    { id: "community", label: "Community", icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <div className="flex h-full bg-card border-l border-border">
      {/* Left Navigation Panel */}
      <div className="w-32 border-r border-border bg-card/50 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-border">
          <h3 className="font-bold text-xs tracking-wider text-foreground uppercase">Insights</h3>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 flex flex-col gap-1 p-2 overflow-y-auto">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-2 h-9 text-xs font-medium ${
                activeTab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Header */}
        <div className="px-4 py-3 border-b border-border bg-card">
          <h2 className="font-semibold text-sm">
            {navItems.find((item) => item.id === activeTab)?.label}
          </h2>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto flex flex-col h-full">
          {activeTab === "providers" && (
            <ProviderRegistry selectedModelIds={selectedModel ? [selectedModel] : []} />
          )}

          {activeTab === "models" && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-border bg-card/50">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Model to View Details</label>
                <Select value={selectedModel} onValueChange={onSelectModel}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a model..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(MODELS).map((model) => (
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
              </div>
              <div className="flex-1 overflow-auto">
                {selectedModel ? (
                  <ModelDetails modelId={selectedModel} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                    <Box className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">Select a model from the dropdown above to view its technical specifications and benchmarks.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "news" && <AiMarketNews />}

          {activeTab === "alerts" && <AlertsPanel />}

          {activeTab === "community" && <CommunityInsights />}
        </div>
      </div>
    </div>
  );
}
