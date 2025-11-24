import { ExternalLink, Youtube, BookOpen, Github, Newspaper, Play, ArrowUpRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TrendingItem {
  id: string;
  title: string;
  description: string;
  source: "youtube" | "arxiv" | "github" | "news";
  provider?: string;
  date: string;
  link: string;
  size?: "small" | "medium" | "large" | "wide";
  imageGradient?: string;
  tags?: string[];
}

const TRENDING_CONTENT: TrendingItem[] = [
  // Large Feature - YouTube
  {
    id: "yt1",
    title: "GPT-5.1: The Next Frontier in AI",
    description: "Exclusive deep dive into OpenAI's latest frontier model. We analyze the reasoning capabilities, the new 2.2T parameter architecture, and what this means for the future of AGI.",
    source: "youtube",
    provider: "OpenAI",
    date: "2h ago",
    link: "#",
    size: "large",
    imageGradient: "from-green-500/20 to-emerald-900/60",
    tags: ["Reasoning", "Frontier"]
  },
  // Wide Feature - News
  {
    id: "news1",
    title: "Anthropic Releases Claude 3.5 Sonnet",
    description: "State-of-the-art performance in long-context reasoning with a 200k context window.",
    source: "news",
    provider: "Anthropic",
    date: "1d ago",
    link: "#",
    size: "wide",
    imageGradient: "from-orange-500/20 to-amber-900/60",
    tags: ["Release", "SOTA"]
  },
  // Medium - GitHub
  {
    id: "gh1",
    title: "DeepSeek V3 Open Source",
    description: "671B MoE model weights now available.",
    source: "github",
    provider: "DeepSeek",
    date: "1d ago",
    link: "#",
    size: "medium",
    imageGradient: "from-blue-500/20 to-indigo-900/60",
    tags: ["Open Source"]
  },
  // Small - Arxiv
  {
    id: "arxiv1",
    title: "Scaling Laws for Reasoning",
    description: "Optimal compute allocation for CoT.",
    source: "arxiv",
    date: "3h ago",
    link: "#",
    size: "small",
    imageGradient: "from-red-500/20 to-rose-900/60",
    tags: ["Research"]
  },
  // Small - News
  {
    id: "news2",
    title: "Google Gemini 3 Pro",
    description: "1M context window for all enterprise users.",
    source: "news",
    provider: "Google",
    date: "5h ago",
    link: "#",
    size: "small",
    imageGradient: "from-blue-400/20 to-cyan-900/60",
    tags: ["Enterprise"]
  },
  // Medium - YouTube
  {
    id: "yt2",
    title: "Building Agents with Replit",
    description: "Tutorial on creating autonomous coding agents.",
    source: "youtube",
    provider: "Replit",
    date: "6h ago",
    link: "#",
    size: "medium",
    imageGradient: "from-orange-500/20 to-red-900/60",
    tags: ["Dev", "Agents"]
  },
  // Wide - GitHub
  {
    id: "gh2",
    title: "Llama 4 Scout Release",
    description: "Meta's lightweight 8B parameter model optimized for edge devices and local inference.",
    source: "github",
    provider: "Meta",
    date: "2d ago",
    link: "#",
    size: "wide",
    imageGradient: "from-blue-600/20 to-blue-900/60",
    tags: ["Local LLM"]
  },
  // Small - Arxiv
  {
    id: "arxiv2",
    title: "MoE Architecture Analysis",
    description: "Comparative study of sparse activation.",
    source: "arxiv",
    date: "8h ago",
    link: "#",
    size: "small",
    imageGradient: "from-purple-500/20 to-violet-900/60",
    tags: ["Architecture"]
  },
  // Small - News
  {
    id: "news4",
    title: "Mistral Large 3",
    description: "New European champion model.",
    source: "news",
    provider: "Mistral",
    date: "3d ago",
    link: "#",
    size: "small",
    imageGradient: "from-yellow-500/20 to-amber-900/60",
    tags: ["Europe"]
  },
];

const BentoCard = ({ item }: { item: TrendingItem }) => {
  // Determine grid span based on size
  const spanClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-1", // Wide on desktop
    wide: "col-span-1 md:col-span-2 row-span-1",
    large: "col-span-1 md:col-span-2 row-span-2", // Big square/rect
  };

  const Icon = 
    item.source === "youtube" ? Youtube :
    item.source === "github" ? Github :
    item.source === "arxiv" ? BookOpen : Newspaper;

  return (
    <div className={`group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg ${spanClasses[item.size || "small"]}`}>
      {/* Background Gradient/Image Placeholder */}
      <div className={`absolute inset-0 bg-gradient-to-br ${item.imageGradient} opacity-30 group-hover:opacity-40 transition-opacity`} />
      
      {/* Content Container */}
      <div className="relative h-full p-5 flex flex-col justify-between">
        
        {/* Top Row: Badge & Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-background/50 backdrop-blur-md border-white/10 text-xs font-medium flex items-center gap-1.5">
               <Icon className="h-3 w-3" />
               {item.source === "youtube" ? "Watch" : item.source === "arxiv" ? "Paper" : item.source === "github" ? "Repo" : "News"}
            </Badge>
            {item.provider && (
              <Badge variant="outline" className="bg-background/30 backdrop-blur-sm border-white/10 text-[10px]">
                {item.provider}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground/80 -mt-1 -mr-1">
            <ArrowUpRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Main Info */}
        <div className="space-y-2">
          <h3 className={`font-bold text-foreground leading-tight ${item.size === 'large' ? 'text-2xl' : 'text-lg'}`}>
            {item.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {item.description}
          </p>
        </div>

        {/* Footer Info */}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground/70 font-medium">
          <div className="flex gap-2">
            {item.tags?.map(tag => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
          <span>{item.date}</span>
        </div>
      </div>
    </div>
  );
};

export default function TrendingContent() {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">For You</h2>
          <p className="text-muted-foreground">Curated insights from the AI ecosystem</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" size="sm" className="h-8">Latest</Button>
           <Button variant="ghost" size="sm" className="h-8">Trending</Button>
        </div>
      </div>

      {/* Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
        {TRENDING_CONTENT.map((item) => (
          <BentoCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
