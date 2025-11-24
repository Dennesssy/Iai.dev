import { useState } from "react";
import { Bookmark, BookOpen, TrendingUp, Bell, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import SavedModels from "./SavedModels";
import ModelDetails from "./ModelDetails";
import AiMarketNews from "./AiMarketNews";
import AlertsPanel from "./AlertsPanel";
import CommunityInsights from "./CommunityInsights";

interface RightSidebarProps {
  favorites: string[];
  onToggleFavorite: (modelId: string) => void;
  selectedModel?: string;
  onSelectModel: (modelId: string) => void;
}

type TabValue = "saved" | "details" | "news" | "alerts" | "community";

export default function RightSidebar({
  favorites,
  onToggleFavorite,
  selectedModel,
  onSelectModel,
}: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<TabValue>("saved");

  const navItems: { id: TabValue; label: string; icon: React.ReactNode }[] = [
    { id: "saved", label: "Saved", icon: <Bookmark className="h-4 w-4" /> },
    { id: "details", label: "Details", icon: <BookOpen className="h-4 w-4" /> },
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
        <div className="flex-1 overflow-auto">
          {activeTab === "saved" && (
            <SavedModels
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              onSelectModel={onSelectModel}
              selectedModel={selectedModel}
            />
          )}

          {activeTab === "details" && <ModelDetails modelId={selectedModel} />}

          {activeTab === "news" && <AiMarketNews />}

          {activeTab === "alerts" && <AlertsPanel />}

          {activeTab === "community" && <CommunityInsights />}
        </div>
      </div>
    </div>
  );
}
