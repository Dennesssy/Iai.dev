import { useState } from "react";
import { 
  Settings2, 
  Play, 
  Save, 
  RotateCcw, 
  Code, 
  MessageSquare, 
  Image as ImageIcon, 
  MoreHorizontal,
  Maximize2,
  X,
  ChevronDown,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Shell from "@/components/layout/Shell";
import { MODELS, COMPANY_LOGOS, POPULAR_MODELS } from "@/lib/mockData";

export default function Playground() {
  const [selectedModelId, setSelectedModelId] = useState("gpt-5.1");
  const [temperature, setTemperature] = useState([0.7]);
  const [maxLength, setMaxLength] = useState([1024]);
  const [topP, setTopP] = useState([1.0]);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const selectedModel = MODELS[selectedModelId];
  const creatorLogo = COMPANY_LOGOS[selectedModel?.creator || "OpenAI"];

  const handleRun = () => {
    setIsRunning(true);
    setResponse("");
    
    // Simulate streaming response
    const mockResponse = `Here is a sample response from ${selectedModel?.name}. \n\nBased on your prompt, I've analyzed the requirements and found that this approach provides the optimal balance between performance and accuracy.\n\n\`\`\`python\ndef calculate_metrics(data):\n    # Initialize metrics\n    results = []\n    \n    for item in data:\n        score = process_item(item)\n        results.append(score)\n        \n    return results\n\`\`\`\n\nLet me know if you need any further adjustments to this code.`;
    
    let i = 0;
    const interval = setInterval(() => {
      setResponse(mockResponse.substring(0, i));
      i += 5;
      if (i > mockResponse.length) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 10);
  };

  return (
    <Shell>
      <div className="flex h-full w-full bg-background overflow-hidden">
        {/* Left Sidebar - Settings */}
        <div className="w-80 border-r border-border bg-card flex flex-col h-full shrink-0">
          <div className="p-4 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              Run Settings
            </h2>
          </div>
          
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2 truncate">
                      {creatorLogo && (
                        <img src={creatorLogo} alt="logo" className="w-4 h-4 rounded-sm object-cover" />
                      )}
                      <span className="truncate">{selectedModel?.name}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {POPULAR_MODELS.map((id) => {
                      const model = MODELS[id];
                      const logo = COMPANY_LOGOS[model.creator];
                      return (
                        <SelectItem key={id} value={id}>
                          <div className="flex items-center gap-2">
                            {logo && <img src={logo} alt="" className="w-4 h-4 rounded-sm object-cover" />}
                            <span>{model.name}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2 mt-1">
                   <Badge variant="outline" className="text-[10px] h-5">{selectedModel?.creator}</Badge>
                   <Badge variant="secondary" className="text-[10px] h-5">{selectedModel?.parameters}</Badge>
                </div>
              </div>

              {/* Temperature */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Temperature</label>
                  <span className="text-xs text-muted-foreground">{temperature[0]}</span>
                </div>
                <Slider 
                  value={temperature} 
                  onValueChange={setTemperature} 
                  max={2} 
                  step={0.1} 
                  className="w-full" 
                />
              </div>

              {/* Max Length */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Max Output</label>
                  <span className="text-xs text-muted-foreground">{maxLength[0]} tokens</span>
                </div>
                <Slider 
                  value={maxLength} 
                  onValueChange={setMaxLength} 
                  max={8192} 
                  step={128} 
                  className="w-full" 
                />
              </div>

              {/* Top P */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Top P</label>
                  <span className="text-xs text-muted-foreground">{topP[0]}</span>
                </div>
                <Slider 
                  value={topP} 
                  onValueChange={setTopP} 
                  max={1} 
                  step={0.05} 
                  className="w-full" 
                />
              </div>

              {/* Advanced Toggles */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Safety Filters</label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">JSON Mode</label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Streaming</label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-secondary/10">
             <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
               <span>Cost Estimate</span>
               <span>$0.002</span>
             </div>
             <Button className="w-full gap-2" onClick={handleRun} disabled={isRunning}>
               {isRunning ? (
                 <RotateCcw className="h-4 w-4 animate-spin" />
               ) : (
                 <Play className="h-4 w-4 fill-current" />
               )}
               Run Request
             </Button>
          </div>
        </div>

        {/* Main Content - Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card">
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-lg">Untitled Prompt</h1>
              <Badge variant="outline" className="font-normal text-muted-foreground">Draft</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                <Code className="h-4 w-4" />
                Get Code
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Editor Area */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Input */}
            <div className="flex-1 flex flex-col border-r border-border min-h-[300px]">
              <div className="px-4 py-2 bg-secondary/30 border-b border-border flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">System / User Prompt</span>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Maximize2 className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1 p-4">
                <Textarea 
                  placeholder="Enter your prompt here..." 
                  className="h-full resize-none border-0 focus-visible:ring-0 p-0 text-base font-mono leading-relaxed bg-transparent"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>
              <div className="px-4 py-2 border-t border-border flex items-center gap-2">
                 <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                   <ImageIcon className="h-3 w-3" />
                   Add Image
                 </Button>
                 <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                   <Zap className="h-3 w-3" />
                   Optimize Prompt
                 </Button>
              </div>
            </div>

            {/* Output */}
            <div className="flex-1 flex flex-col bg-secondary/10">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-card">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Model Output</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Latency: 450ms</span>
                  <div className="h-3 w-px bg-border" />
                  <span className="text-xs text-muted-foreground">Tokens: 142</span>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-auto">
                {response ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none font-mono whitespace-pre-wrap">
                    {response}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                    <Zap className="h-12 w-12 mb-4" />
                    <p className="text-sm">Run the model to see output</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
