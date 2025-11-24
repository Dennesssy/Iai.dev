import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavedModels from "./SavedModels";
import ModelDetails from "./ModelDetails";
import AiMarketNews from "./AiMarketNews";
import AlertsPanel from "./AlertsPanel";
import CommunityInsights from "./CommunityInsights";
import { Bookmark, BookOpen, TrendingUp, Bell, Users } from "lucide-react";

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
  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <Tabs defaultValue="saved" className="h-full flex flex-col">
        <TabsList className="w-full h-12 border-b border-border bg-card rounded-none px-2">
          <TabsTrigger
            value="saved"
            className="flex items-center gap-1.5 text-xs"
            title="Saved Models"
          >
            <Bookmark className="h-4 w-4" />
            <span className="hidden sm:inline">Saved</span>
          </TabsTrigger>
          <TabsTrigger
            value="details"
            className="flex items-center gap-1.5 text-xs"
            title="Model Details"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-1.5 text-xs" title="Market News">
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">News</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1.5 text-xs" title="Alerts">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alerts</span>
          </TabsTrigger>
          <TabsTrigger
            value="community"
            className="flex items-center gap-1.5 text-xs"
            title="Community"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Community</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="flex-1 overflow-hidden">
          <SavedModels
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onSelectModel={onSelectModel}
            selectedModel={selectedModel}
          />
        </TabsContent>

        <TabsContent value="details" className="flex-1 overflow-hidden">
          <ModelDetails modelId={selectedModel} />
        </TabsContent>

        <TabsContent value="news" className="flex-1 overflow-hidden">
          <AiMarketNews />
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 overflow-hidden">
          <AlertsPanel />
        </TabsContent>

        <TabsContent value="community" className="flex-1 overflow-hidden">
          <CommunityInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
}
