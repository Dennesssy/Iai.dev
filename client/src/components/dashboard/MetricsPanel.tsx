import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Share2, MoreHorizontal } from "lucide-react";

export default function MetricsPanel() {
  return (
    <div className="flex flex-col h-full bg-card border-t border-border">
      <Tabs defaultValue="overview" className="flex flex-col h-full">
        <div className="flex items-center justify-between px-4 border-b border-border bg-card shrink-0">
          <TabsList className="h-10 bg-transparent p-0">
            <TabsTrigger 
              value="overview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="benchmarks" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Benchmarks
            </TabsTrigger>
            <TabsTrigger 
              value="discussion" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Discussion <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">12</Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="code" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Code
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="flex-1 p-4 m-0 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Model Details</h3>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div className="text-muted-foreground">Provider</div>
                <div className="font-mono text-foreground">OpenAI</div>
                
                <div className="text-muted-foreground">Release Date</div>
                <div className="font-mono text-foreground">Mar 14, 2023</div>
                
                <div className="text-muted-foreground">Context Window</div>
                <div className="font-mono text-foreground">128k tokens</div>
                
                <div className="text-muted-foreground">Training Data</div>
                <div className="font-mono text-foreground">Undisclosed</div>
                
                <div className="text-muted-foreground">License</div>
                <div className="font-mono text-yellow-500">Proprietary</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">Performance Summary</h3>
              <div className="space-y-3">
                <MetricBar label="Reasoning (MMLU)" value={86.4} />
                <MetricBar label="Coding (HumanEval)" value={67.0} />
                <MetricBar label="Math (GSM8K)" value={92.0} />
                <MetricBar label="Knowledge (Arc-C)" value={96.3} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg text-foreground">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                GPT-4 is a large multimodal model (accepting image and text inputs, emitting text outputs) that exhibits human-level performance on various professional and academic benchmarks. For example, it passes a simulated bar exam with a score around the top 10% of test takers.
              </p>
              <div className="flex gap-2 pt-2">
                <Badge variant="outline" className="rounded-md font-mono border-primary/20 text-primary">#multimodal</Badge>
                <Badge variant="outline" className="rounded-md font-mono border-primary/20 text-primary">#reasoning</Badge>
                <Badge variant="outline" className="rounded-md font-mono border-primary/20 text-primary">#coding</Badge>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="benchmarks" className="flex-1 p-4 m-0 overflow-auto">
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Benchmark Comparison Tool
          </div>
        </TabsContent>

        <TabsContent value="discussion" className="flex-1 p-0 m-0 overflow-auto bg-background/50">
          <div className="divide-y divide-border">
            <DiscussionItem 
              user="Sarah Chen"
              handle="@schen_ai"
              time="2h ago"
              content="The new system prompts for GPT-4 seem to have reduced the 'lazy' coding behavior significantly. Seeing much better completion rates on large contexts."
              likes={24}
              replies={5}
            />
            <DiscussionItem 
              user="Devin Miller"
              handle="@devin_m"
              time="5h ago"
              content="Anyone else noticing higher latency on the API today? P99 is up about 200ms from yesterday's baseline."
              likes={12}
              replies={3}
            />
            <DiscussionItem 
              user="Alex Rivera"
              handle="@arivera"
              time="1d ago"
              content="Just published a new eval set for reasoning tasks. GPT-4 still holding the crown but Claude 3 Opus is getting dangerously close."
              likes={45}
              replies={12}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MetricBar({ label, value }: { label: string, value: number }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-foreground">{value}%</span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500" 
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function DiscussionItem({ user, handle, time, content, likes, replies }: any) {
  return (
    <div className="p-4 hover:bg-secondary/20 transition-colors">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${handle}`} />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">{user}</span>
              <span className="text-xs text-muted-foreground">{handle}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{time}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-foreground/90">{content}</p>
          <div className="flex items-center gap-4 pt-2">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{replies}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <ThumbsUp className="h-3.5 w-3.5" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
