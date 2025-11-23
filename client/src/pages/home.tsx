import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import Shell from "@/components/layout/Shell";
import CategorySidebar from "@/components/dashboard/CategorySidebar";
import ModelChart from "@/components/dashboard/ModelChart";
import ModelList from "@/components/dashboard/ModelList";
import MetricsPanel from "@/components/dashboard/MetricsPanel";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <Shell>
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Category Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block">
          <CategorySidebar />
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
                  <ModelChart />
                </ResizablePanel>
                
                <ResizableHandle withHandle />
                
                {/* Metrics / Bottom Panel */}
                <ResizablePanel defaultSize={40} minSize={10}>
                  <MetricsPanel />
                </ResizablePanel>

              </ResizablePanelGroup>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            {/* Right Sidebar (Model List) */}
            <ResizablePanel 
              defaultSize={20} 
              minSize={15} 
              maxSize={isMobile ? 100 : 30}
              className={isMobile ? "min-h-[200px]" : ""}
            >
              <ModelList />
            </ResizablePanel>
            
          </ResizablePanelGroup>
        </div>
      </div>
    </Shell>
  );
}
