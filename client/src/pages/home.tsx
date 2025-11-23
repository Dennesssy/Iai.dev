import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable";
import Shell from "@/components/layout/Shell";
import ModelChart from "@/components/dashboard/ModelChart";
import ModelList from "@/components/dashboard/ModelList";
import MetricsPanel from "@/components/dashboard/MetricsPanel";
import { 
  Pencil, 
  Minus, 
  Type, 
  SplitSquareVertical, 
  Trash2,
  MousePointer2,
  Crosshair
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();

  return (
    <Shell>
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Left Toolbar (Trading View style) - Hidden on Mobile */}
        <div className="hidden md:flex w-12 flex-col items-center py-4 border-r border-border gap-4 bg-card shrink-0">
          <ToolbarButton icon={Crosshair} label="Crosshair" active />
          <ToolbarButton icon={Minus} label="Trend Line" />
          <ToolbarButton icon={Type} label="Text" />
          <ToolbarButton icon={Pencil} label="Brush" />
          <ToolbarButton icon={SplitSquareVertical} label="Patterns" />
          <div className="flex-1" />
          <ToolbarButton icon={Trash2} label="Clear" />
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

function ToolbarButton({ icon: Icon, label, active }: { icon: any, label: string, active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
