import { useState } from "react";
import { Bookmark, BookOpen, TrendingUp, Bell, Users, Database, Box, ChevronDown } from "lucide-react";
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
import { ScrollArea } from "@/components/ui/scroll-area";

interface RightSidebarProps {
  favorites: string[];
  onToggleFavorite: (modelId: string) => void;
  selectedModel?: string;
  onSelectModel: (modelId: string) => void;
}

export default function RightSidebar({
  favorites,
  onToggleFavorite,
  selectedModel,
  onSelectModel,
}: RightSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    providers: true,
    models: true,
    news: true,
    alerts: false,
    community: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const SectionHeader = ({ icon: Icon, title, section }: any) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors font-semibold text-sm border-b border-border/50"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <ChevronDown
        className={`h-4 w-4 transition-transform ${expandedSections[section] ? '' : '-rotate-90'}`}
      />
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="font-bold text-lg tracking-tight">Insights</h2>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {/* PROVIDERS SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={Database} title="Providers" section="providers" />
            {expandedSections.providers && (
              <div className="bg-secondary/10 p-0">
                 <ProviderRegistry selectedModelIds={selectedModel ? [selectedModel] : []} />
              </div>
            )}
          </div>

          {/* MODELS SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={Box} title="Models" section="models" />
            {expandedSections.models && (
              <div className="bg-secondary/10 p-4">
                <label className="text-xs font-medium text-muted-foreground mb-2 block">Select Model</label>
                <Select value={selectedModel} onValueChange={onSelectModel}>
                  <SelectTrigger className="w-full mb-4 h-8 text-xs">
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
                
                {selectedModel ? (
                  <ModelDetails modelId={selectedModel} />
                ) : (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    Select a model to view details
                  </div>
                )}
              </div>
            )}
          </div>

          {/* NEWS SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={TrendingUp} title="News" section="news" />
            {expandedSections.news && (
              <div className="bg-secondary/10">
                <AiMarketNews />
              </div>
            )}
          </div>

          {/* ALERTS SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={Bell} title="Alerts" section="alerts" />
            {expandedSections.alerts && (
              <div className="bg-secondary/10">
                <AlertsPanel />
              </div>
            )}
          </div>

          {/* COMMUNITY SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={Users} title="Community" section="community" />
            {expandedSections.community && (
              <div className="bg-secondary/10">
                <CommunityInsights />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
