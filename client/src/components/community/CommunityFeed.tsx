import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, MessageSquare, Share2, Search, Award, Flame } from "lucide-react";

const communityPosts = [
  {
    id: 1,
    author: "Alex Chen",
    handle: "@alexchen_ai",
    avatar: "AC",
    time: "2h ago",
    title: "Found major efficiency gains with system prompt v3",
    description: "Tested new system prompt on 50k samples. GPT-4 latency down 23% with minimal accuracy loss.",
    tags: ["Prompting", "Performance", "GPT-4"],
    likes: 342,
    replies: 28,
    views: 2100,
    image: "📊",
    score: 4.2,
  },
  {
    id: 2,
    author: "Sarah Rivera",
    handle: "@sarahrivera",
    avatar: "SR",
    time: "4h ago",
    title: "Claude-3 vs GPT-4 on complex reasoning - Full benchmark",
    description: "Ran 1000 reasoning-heavy prompts comparing both models. Surprising results on edge cases.",
    tags: ["Benchmark", "Comparison", "Research"],
    likes: 1240,
    replies: 87,
    views: 8900,
    image: "📈",
    score: 4.8,
  },
  {
    id: 3,
    author: "Priya Patel",
    handle: "@priyapatel",
    avatar: "PP",
    time: "6h ago",
    title: "Open source Llama-3 fine-tuning guide for production",
    description: "Complete pipeline for fine-tuning Llama-3 with 70B params. Includes cost optimization tips.",
    tags: ["Open Source", "Fine-tuning", "Llama"],
    likes: 567,
    replies: 42,
    views: 3400,
    image: "🔧",
    score: 4.5,
  },
  {
    id: 4,
    author: "James Liu",
    handle: "@jamesliu_ml",
    avatar: "JL",
    time: "8h ago",
    title: "Token efficiency study across 12 major LLMs",
    description: "Analyzing token usage patterns. Surprising findings on how architecture affects efficiency.",
    tags: ["Analysis", "Efficiency", "Research"],
    likes: 423,
    replies: 19,
    views: 1800,
    image: "💾",
    score: 4.3,
  },
];

const topContributors = [
  { name: "Sarah Rivera", handle: "@sarahrivera", contributions: 342, followers: 2340 },
  { name: "Alex Chen", handle: "@alexchen_ai", contributions: 287, followers: 1890 },
  { name: "James Liu", handle: "@jamesliu_ml", contributions: 256, followers: 1650 },
  { name: "Priya Patel", handle: "@priyapatel", contributions: 198, followers: 1120 },
];

export default function CommunityFeed() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <div className="p-4 border-b border-border bg-card space-y-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Community Center</h1>
          <p className="text-sm text-muted-foreground">Share benchmarks, evaluations, and insights with the community</p>
        </div>
        
        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-10">
          + Share Evaluation
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search posts, models, benchmarks..." 
            className="pl-10 h-9 bg-secondary/50 border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="latest" className="flex flex-col h-full">
        <div className="px-4 border-b border-border bg-card">
          <TabsList className="h-10 bg-transparent p-0">
            <TabsTrigger 
              value="latest" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              Latest
            </TabsTrigger>
            <TabsTrigger 
              value="trending" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              <Flame className="h-4 w-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger 
              value="top" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent h-full px-4"
            >
              <Award className="h-4 w-4 mr-1" />
              Top Contributors
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="latest" className="flex-1 m-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="divide-y divide-border">
              {communityPosts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border">
                  <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.handle}`} />
                      <AvatarFallback>{post.avatar}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{post.author}</span>
                            <span className="text-xs text-muted-foreground">{post.handle}</span>
                            <span className="text-xs text-muted-foreground">·</span>
                            <span className="text-xs text-muted-foreground">{post.time}</span>
                          </div>
                        </div>
                        <div className="text-2xl">{post.image}</div>
                      </div>

                      <div>
                        <h3 className="font-bold text-foreground mb-1">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{post.description}</p>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-[10px] font-mono">{tag}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Heart className="h-3.5 w-3.5" />
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{post.replies}</span>
                        </button>
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <Share2 className="h-3.5 w-3.5" />
                        </button>
                        <div className="ml-auto font-mono text-primary">⭐ {post.score}/5</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="trending" className="flex-1 m-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="divide-y divide-border">
              {communityPosts.sort((a, b) => b.likes - a.likes).map((post) => (
                <div key={post.id} className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer border-b border-border">
                  <div className="flex gap-4">
                    <div className="text-2xl font-bold text-primary">🔥</div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-foreground">{post.author}</span>
                        <span className="text-xs text-muted-foreground">{post.handle}</span>
                      </div>
                      <h3 className="font-bold text-foreground">{post.title}</h3>
                      <p className="text-xs text-muted-foreground">{post.views} views • {post.likes} likes</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="top" className="flex-1 m-0 overflow-auto">
          <ScrollArea className="h-full">
            <div className="divide-y divide-border">
              {topContributors.map((contributor, idx) => (
                <div key={idx} className="p-4 hover:bg-secondary/30 transition-colors cursor-pointer flex items-center justify-between border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="text-lg font-bold text-primary w-6 text-center">{idx + 1}</div>
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contributor.handle}`} />
                      <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm text-foreground">{contributor.name}</div>
                      <div className="text-xs text-muted-foreground">{contributor.handle}</div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm font-bold text-primary">{contributor.contributions}</div>
                    <div className="text-[10px] text-muted-foreground">{contributor.followers} followers</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
