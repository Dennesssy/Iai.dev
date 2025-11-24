import { useState } from "react";
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Shell from "@/components/layout/Shell";
import ModelNavigator from "@/components/dashboard/ModelNavigator";
import ModelChart from "@/components/dashboard/ModelChart";
import ProviderRegistry from "@/components/dashboard/ProviderRegistry";
import MetricsPanel from "@/components/dashboard/MetricsPanel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  const [selectedModels, setSelectedModels] = useState<string[]>(["gpt-4o"]);

  const handleModelSelect = (modelId: string) => {
    if (!selectedModels.includes(modelId)) {
      setSelectedModels([...selectedModels, modelId]);
    }
  };

  const handleModelDeselect = (modelId: string) => {
    setSelectedModels(selectedModels.filter((id) => id !== modelId));
  };

  const handleModelRemove = (modelId: string) => {
    handleModelDeselect(modelId);
  };

  return (
    <Shell>
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Sidebar - Model Navigator */}
        <div className="hidden lg:block w-80 border-r border-border shrink-0">
          <ModelNavigator
            selectedModels={selectedModels}
            onModelSelect={handleModelSelect}
            onModelDeselect={handleModelDeselect}
          />
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col min-w-0">
          <ResizablePanelGroup 
            direction={isMobile ? "vertical" : "horizontal"} 
            className="flex-1"
          >
            
            {/* Center + Bottom Area */}
            <ResizablePanel defaultSize={80} minSize={50}>
              <ResizablePanelGroup direction="vertical">
                
                {/* Chart Area */}
                <ResizablePanel defaultSize={60} minSize={30}>
                  <ModelChart 
                    selectedModels={selectedModels} 
                    onModelRemove={handleModelRemove}
                  />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Metrics / Provider Panel */}
                <ResizablePanel defaultSize={40} minSize={10}>
                  <Tabs defaultValue="metrics" className="h-full flex flex-col">
                    <TabsList className="h-10 border-b border-border bg-card rounded-none">
                      <TabsTrigger value="metrics" className="text-sm">Metrics</TabsTrigger>
                      <TabsTrigger value="providers" className="text-sm">Providers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="metrics" className="flex-1 overflow-hidden">
                      <MetricsPanel />
                    </TabsContent>
                    <TabsContent value="providers" className="flex-1 overflow-hidden">
                      <ProviderRegistry selectedModelIds={selectedModels} />
                    </TabsContent>
                  </Tabs>
                </ResizablePanel>

              </ResizablePanelGroup>
            </ResizablePanel>
            
          </ResizablePanelGroup>
        </div>
      </div>
    </Shell>
  );
}
