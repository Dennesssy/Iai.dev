import { ExternalLink, Youtube, BookOpen, Github, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrendingItem {
  id: string;
  title: string;
  description: string;
  source: "youtube" | "arxiv" | "github" | "news";
  provider?: string;
  image?: string;
  date: string;
  link: string;
}

const TRENDING_CONTENT: TrendingItem[] = [
  // YouTube
  {
    id: "yt1",
    title: "GPT-5.1: The Next Frontier in AI",
    description: "Deep dive into OpenAI's latest model and its capabilities",
    source: "youtube",
    provider: "OpenAI",
    date: "2 hours ago",
    link: "#",
  },
  {
    id: "yt2",
    title: "Claude 3.5 Sonnet vs GPT-4o Comparison",
    description: "Comprehensive benchmark comparison between Anthropic and OpenAI models",
    source: "youtube",
    provider: "AI Research Hub",
    date: "4 hours ago",
    link: "#",
  },
  {
    id: "yt3",
    title: "Gemini 3 Pro: Google's AI Breakthrough",
    description: "Exploring Google's new 1M context window model",
    source: "youtube",
    provider: "Google AI",
    date: "6 hours ago",
    link: "#",
  },
  // arXiv
  {
    id: "arxiv1",
    title: "Scaling Laws for Reasoning Models",
    description: "New research on optimal model scaling for reasoning tasks",
    source: "arxiv",
    date: "3 hours ago",
    link: "#",
  },
  {
    id: "arxiv2",
    title: "Efficient Fine-tuning of Large Language Models",
    description: "Novel techniques for parameter-efficient adaptation",
    source: "arxiv",
    date: "5 hours ago",
    link: "#",
  },
  {
    id: "arxiv3",
    title: "Mixture of Experts: The Future of LLMs",
    description: "Analysis of MoE architectures and their performance characteristics",
    source: "arxiv",
    date: "8 hours ago",
    link: "#",
  },
  // GitHub
  {
    id: "gh1",
    title: "DeepSeek V3: Open Source Release",
    description: "671B MoE model now available with full weights",
    source: "github",
    provider: "DeepSeek",
    date: "1 day ago",
    link: "#",
  },
  {
    id: "gh2",
    title: "Llama 4 Scout: Meta's Latest Open Model",
    description: "10M context window open-source model",
    source: "github",
    provider: "Meta",
    date: "2 days ago",
    link: "#",
  },
  {
    id: "gh3",
    title: "Mistral Large 3: Production-Ready Release",
    description: "Optimized for enterprise deployments",
    source: "github",
    provider: "Mistral AI",
    date: "3 days ago",
    link: "#",
  },
  // News
  {
    id: "news1",
    title: "OpenAI Announces GPT-5.1 with Enhanced Reasoning",
    description: "New model achieves 89.5% on MMLU-Pro benchmark",
    source: "news",
    provider: "OpenAI Blog",
    date: "2 hours ago",
    link: "#",
  },
  {
    id: "news2",
    title: "Anthropic Releases Claude 3.5 Sonnet",
    description: "State-of-the-art performance in long-context reasoning",
    source: "news",
    provider: "Anthropic",
    date: "1 day ago",
    link: "#",
  },
  {
    id: "news3",
    title: "Google Expands Gemini 3 Pro Availability",
    description: "1M token context now available to all users",
    source: "news",
    provider: "Google AI",
    date: "1 day ago",
    link: "#",
  },
  {
    id: "news4",
    title: "Replit Launches AI Code Generation Assistant",
    description: "New features for collaborative AI-powered development",
    source: "news",
    provider: "Replit",
    date: "2 days ago",
    link: "#",
  },
];

const getSourceIcon = (source: string) => {
  switch (source) {
    case "youtube":
      return <Youtube className="h-4 w-4" />;
    case "arxiv":
      return <BookOpen className="h-4 w-4" />;
    case "github":
      return <Github className="h-4 w-4" />;
    case "news":
      return <Newspaper className="h-4 w-4" />;
    default:
      return <ExternalLink className="h-4 w-4" />;
  }
};

const getSourceColor = (source: string) => {
  switch (source) {
    case "youtube":
      return "bg-red-100 text-red-700";
    case "arxiv":
      return "bg-orange-100 text-orange-700";
    case "github":
      return "bg-slate-100 text-slate-700";
    case "news":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function TrendingContent() {
  const groupedBySource = {
    youtube: TRENDING_CONTENT.filter(item => item.source === "youtube"),
    arxiv: TRENDING_CONTENT.filter(item => item.source === "arxiv"),
    github: TRENDING_CONTENT.filter(item => item.source === "github"),
    news: TRENDING_CONTENT.filter(item => item.source === "news"),
  };

  return (
    <div className="w-full h-full flex flex-col bg-background overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-card">
        <h2 className="font-bold text-lg">Trending in AI</h2>
        <p className="text-xs text-muted-foreground mt-0.5">YouTube • arXiv • GitHub • News</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* YouTube Section */}
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-secondary/5 sticky top-0 flex items-center gap-2">
            <Youtube className="h-4 w-4 text-red-600" />
            <h3 className="font-semibold text-sm">YouTube</h3>
            <span className="text-xs text-muted-foreground ml-auto">{groupedBySource.youtube.length} trending</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
            {groupedBySource.youtube.map(item => (
              <a
                key={item.id}
                href={item.link}
                className="group p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      {item.provider && (
                        <Badge variant="outline" className="text-[10px]">{item.provider}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground/60">{item.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* arXiv Section */}
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-secondary/5 sticky top-0 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-orange-600" />
            <h3 className="font-semibold text-sm">arXiv Research</h3>
            <span className="text-xs text-muted-foreground ml-auto">{groupedBySource.arxiv.length} papers</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
            {groupedBySource.arxiv.map(item => (
              <a
                key={item.id}
                href={item.link}
                className="group p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <span className="text-[10px] text-muted-foreground/60 mt-2 block">{item.date}</span>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* GitHub Section */}
        <div className="border-b border-border">
          <div className="px-4 py-2 bg-secondary/5 sticky top-0 flex items-center gap-2">
            <Github className="h-4 w-4 text-slate-700" />
            <h3 className="font-semibold text-sm">GitHub Releases</h3>
            <span className="text-xs text-muted-foreground ml-auto">{groupedBySource.github.length} releases</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
            {groupedBySource.github.map(item => (
              <a
                key={item.id}
                href={item.link}
                className="group p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      {item.provider && (
                        <Badge variant="outline" className="text-[10px]">{item.provider}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground/60">{item.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div>
          <div className="px-4 py-2 bg-secondary/5 sticky top-0 flex items-center gap-2">
            <Newspaper className="h-4 w-4 text-blue-600" />
            <h3 className="font-semibold text-sm">Latest News</h3>
            <span className="text-xs text-muted-foreground ml-auto">{groupedBySource.news.length} stories</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
            {groupedBySource.news.map(item => (
              <a
                key={item.id}
                href={item.link}
                className="group p-3 rounded-lg border border-border hover:border-primary hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-2">
                      {item.provider && (
                        <Badge variant="outline" className="text-[10px]">{item.provider}</Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground/60">{item.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-1" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
