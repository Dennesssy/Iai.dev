import { useState } from "react";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Shell from "@/components/layout/Shell";
import CategorySidebar from "@/components/dashboard/CategorySidebar";
import ModelChart from "@/components/dashboard/ModelChart";
import RightSidebar from "@/components/dashboard/RightSidebar";
import ProviderRegistry from "@/components/dashboard/ProviderRegistry";
import MetricsPanel from "@/components/dashboard/MetricsPanel";
import TrendingContent from "@/components/dashboard/TrendingContent";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4o"]);
  const [favorites, setFavorites] = useState<string[]>(["gpt-4o", "claude-3.5-sonnet", "llama-3.3-70b"]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);

  const handleToggleFavorite = (modelId: string) => {
    setFavorites((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId]
    );
  };

  const handleModelRemove = (modelId: string) => {
    setSelectedModels(selectedModels.filter((id) => id !== modelId));
  };

  return (
    <Shell>
      {/* Main Scroll Container */}
      <div className="h-full overflow-y-auto bg-background">
        
        {/* Page 1: Dashboard View (Full Height) */}
        <div className="h-[calc(100vh-3.5rem)] min-h-[600px] flex flex-col border-b border-border/50">
          <div className="flex-1 flex w-full overflow-hidden">
            {/* Left Sidebar - Categories with Comparison Toggle */}
            <div className="hidden lg:block w-64 border-r border-border shrink-0 bg-card">
              <CategorySidebar 
                comparisonMode={comparisonMode}
                onComparisonModeChange={setComparisonMode}
              />
            </div>

            {/* Main Workspace */}
            <div className="flex-1 flex flex-col min-w-0 bg-background">
              <ResizablePanelGroup 
                direction={isMobile ? "vertical" : "horizontal"} 
                className="flex-1"
              >
                
                {/* Center + Bottom Area */}
                <ResizablePanel defaultSize={70} minSize={50}>
                  <ResizablePanelGroup direction="vertical">
                    
                    {/* Chart Area */}
                    <ResizablePanel defaultSize={comparisonMode ? 100 : 60} minSize={30}>
                      <ModelChart 
                        selectedModels={selectedModels} 
                        onModelRemove={handleModelRemove}
                        comparisonMode={comparisonMode}
                      />
                    </ResizablePanel>
                    
                    {!comparisonMode && (
                      <>
                        <ResizableHandle withHandle />
                        
                        {/* Metrics / Provider Panel */}
                        <ResizablePanel defaultSize={40} minSize={10}>
                          <Tabs defaultValue="metrics" className="h-full flex flex-col bg-card">
                            <TabsList className="h-10 border-b border-border bg-card rounded-none w-full justify-start px-2">
                              <TabsTrigger value="metrics" className="text-sm">Metrics</TabsTrigger>
                              <TabsTrigger value="providers" className="text-sm">Providers</TabsTrigger>
                            </TabsList>
                            <TabsContent value="metrics" className="flex-1 overflow-hidden m-0">
                              <MetricsPanel />
                            </TabsContent>
                            <TabsContent value="providers" className="flex-1 overflow-hidden m-0">
                              <ProviderRegistry selectedModelIds={selectedModels} />
                            </TabsContent>
                          </Tabs>
                        </ResizablePanel>
                      </>
                    )}

                  </ResizablePanelGroup>
                </ResizablePanel>
                
                {!comparisonMode && (
                  <>
                    <ResizableHandle withHandle />
                    
                    {/* Right Sidebar */}
                    <ResizablePanel 
                      defaultSize={30}
                      minSize={20}
                      maxSize={isMobile ? 100 : 40}
                      className={isMobile ? "min-h-[300px]" : ""}
                    >
                      <RightSidebar
                        favorites={favorites}
                        onToggleFavorite={handleToggleFavorite}
                        selectedModel={selectedModel}
                        onSelectModel={setSelectedModel}
                      />
                    </ResizablePanel>
                  </>
                )}
                
              </ResizablePanelGroup>
            </div>
          </div>
        </div>

        {/* Page 2: Trending Content (Mosaic Grid) */}
        <div className="min-h-screen w-full bg-secondary/5 p-8">
          <TrendingContent />
        </div>

      </div>
    </Shell>
  );
}
