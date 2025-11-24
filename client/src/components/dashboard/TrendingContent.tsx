import { useEffect, useRef, useState } from "react";
import { ExternalLink, Youtube, BookOpen, Github, Newspaper, ArrowUpRight, Loader2 } from "lucide-react";
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

// Content cache with multiple items per source
const CONTENT_CACHE = {
  youtube: {
    titles: [
      "GPT-5.1: The Next Frontier in AI",
      "Claude 3.5 Sonnet vs GPT-4o Comparison",
      "Gemini 3 Pro: Google's AI Breakthrough",
      "Building Autonomous Agents with LLMs",
      "Fine-tuning LLMs for Enterprise",
      "The Future of Multi-Modal AI",
      "Reasoning Models: Deep Dive",
      "Scaling Laws in Practice",
      "The MoE Revolution in AI",
      "Prompt Engineering Best Practices",
    ],
    descriptions: [
      "Exclusive deep dive into OpenAI's latest frontier model with 2.2T parameters.",
      "Comprehensive benchmark comparison between Anthropic and OpenAI models.",
      "Exploring Google's new 1M context window model capabilities.",
      "Step-by-step tutorial on creating autonomous coding agents.",
      "Advanced techniques for adapting large models to specific domains.",
      "The evolution of models that handle text, images, and video.",
      "Understanding chain-of-thought and reasoning capabilities.",
      "How to optimize compute and parameters for best results.",
      "Sparse mixture of experts architecture explained.",
      "Techniques to improve model outputs without fine-tuning.",
    ],
    providers: ["OpenAI", "Anthropic", "Google AI", "Replit", "DeepSeek", "Meta", "Mistral", "xAI"],
  },
  arxiv: {
    titles: [
      "Scaling Laws for Reasoning Models",
      "Efficient Fine-tuning of Large Language Models",
      "Mixture of Experts: The Future of LLMs",
      "Attention Mechanisms in Modern Transformers",
      "Retrieval-Augmented Generation Systems",
      "Reinforcement Learning from Human Feedback",
      "Tokenization and Vocabulary Optimization",
      "Context Window Optimization Techniques",
    ],
    descriptions: [
      "New research on optimal model scaling for reasoning tasks.",
      "Novel techniques for parameter-efficient adaptation.",
      "Analysis of MoE architectures and their performance.",
      "Deep dive into how transformers process information.",
      "Combining retrieval with generation for better answers.",
      "Training models using human preferences.",
      "Improving efficiency through better tokenization.",
      "Maximizing context windows without performance loss.",
    ],
    providers: ["Research Lab", "Stanford", "MIT", "Berkeley", "CMU", "Toronto", "Oxford"],
  },
  github: {
    titles: [
      "DeepSeek V3: Open Source Release",
      "Llama 4 Scout: Meta's Latest Open Model",
      "Mistral Large 3: Production-Ready Release",
      "Phi-4: Efficient Small Language Model",
      "BLOOM: Massive Open Multilingual Model",
      "MPT-30B: Open Foundation Model",
      "Falcon 40B: High Performance Open LLM",
      "OLMo: Open Language Model",
    ],
    descriptions: [
      "671B MoE model now available with full weights.",
      "10M context window open-source model.",
      "Optimized for enterprise deployments.",
      "Powerful small model for edge devices.",
      "Multilingual model trained on 46 languages.",
      "Fully open foundation model.",
      "Fast inference and training capabilities.",
      "Fully transparent training data and process.",
    ],
    providers: ["DeepSeek", "Meta", "Mistral AI", "Microsoft", "BigScience", "MosaicML", "Technology Innovation Institute", "Allen Institute"],
  },
  news: {
    titles: [
      "OpenAI Announces GPT-5.1 with Enhanced Reasoning",
      "Anthropic Releases Claude 3.5 Sonnet",
      "Google Expands Gemini 3 Pro Availability",
      "Replit Launches AI Code Generation Assistant",
      "xAI Releases Grok-3 for Enterprise",
      "DeepSeek Reaches New Benchmarks",
      "Meta Announces Open-Source LLM Initiative",
      "Mistral AI Wins EU AI Excellence Award",
    ],
    descriptions: [
      "New model achieves 89.5% on MMLU-Pro benchmark.",
      "State-of-the-art performance in long-context reasoning.",
      "1M token context now available to all users.",
      "New features for collaborative AI-powered development.",
      "Advanced reasoning for enterprise applications.",
      "New performance records on multiple benchmarks.",
      "Commitment to open and accessible AI.",
      "Recognition for responsible AI practices.",
    ],
    providers: ["OpenAI Blog", "Anthropic", "Google AI", "Replit", "xAI", "DeepSeek", "Meta", "Mistral AI"],
  },
};

// Generate new content item based on source
const generateContentItem = (source: string, index: number): TrendingItem => {
  const cache = CONTENT_CACHE[source as keyof typeof CONTENT_CACHE];
  if (!cache) return null as any;

  const titleIndex = index % cache.titles.length;
  const descriptionIndex = index % cache.descriptions.length;
  const providerIndex = index % cache.providers.length;

  const sizes: ("small" | "medium" | "large" | "wide")[] = ["small", "small", "medium", "wide", "large"];
  const sizeIndex = (index * 7) % sizes.length;
  const size = sizes[sizeIndex];

  const gradients = [
    "from-green-500/20 to-emerald-900/60",
    "from-orange-500/20 to-amber-900/60",
    "from-blue-500/20 to-indigo-900/60",
    "from-red-500/20 to-rose-900/60",
    "from-purple-500/20 to-violet-900/60",
    "from-yellow-500/20 to-amber-900/60",
    "from-pink-500/20 to-rose-900/60",
    "from-cyan-500/20 to-blue-900/60",
  ];
  const gradient = gradients[index % gradients.length];

  const tags: Record<string, string[]> = {
    youtube: ["Tutorial", "Deep Dive", "Guide"],
    arxiv: ["Research", "Paper", "Analysis"],
    github: ["Release", "Open Source", "SDK"],
    news: ["Breaking", "Update", "Announcement"],
  };

  return {
    id: `${source}-${index}`,
    title: cache.titles[titleIndex],
    description: cache.descriptions[descriptionIndex],
    source: source as "youtube" | "arxiv" | "github" | "news",
    provider: cache.providers[providerIndex],
    date: `${Math.floor(Math.random() * 7) + 1}d ago`,
    link: "#",
    size,
    imageGradient: gradient,
    tags: tags[source]?.slice(0, 2) || [],
  };
};

const BentoCard = ({ item }: { item: TrendingItem }) => {
  const spanClasses = {
    small: "col-span-1 row-span-1",
    medium: "col-span-1 md:col-span-2 row-span-1",
    wide: "col-span-1 md:col-span-2 row-span-1",
    large: "col-span-1 md:col-span-2 row-span-2",
  };

  const Icon =
    item.source === "youtube"
      ? Youtube
      : item.source === "github"
        ? Github
        : item.source === "arxiv"
          ? BookOpen
          : Newspaper;

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg ${spanClasses[item.size || "small"]}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${item.imageGradient} opacity-30 group-hover:opacity-40 transition-opacity`} />

      <div className="relative h-full p-5 flex flex-col justify-between">
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

        <div className="space-y-2">
          <h3 className={`font-bold text-foreground leading-tight ${item.size === "large" ? "text-2xl" : "text-lg"}`}>
            {item.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">{item.description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground/70 font-medium">
          <div className="flex gap-2">
            {item.tags?.map((tag) => (
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
  const [items, setItems] = useState<TrendingItem[]>(() => {
    const initial: TrendingItem[] = [];
    const sources = ["youtube", "arxiv", "github", "news"];
    for (let i = 0; i < 9; i++) {
      const source = sources[i % sources.length];
      initial.push(generateContentItem(source, i));
    }
    return initial;
  });

  const [isLoading, setIsLoading] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoading && !loadMoreRef.current) {
          loadMoreRef.current = true;
          setIsLoading(true);

          // Simulate loading delay for better UX
          setTimeout(() => {
            setItems((prev) => {
              const newItems: TrendingItem[] = [];
              const sources = ["youtube", "arxiv", "github", "news"];

              for (let i = 0; i < 9; i++) {
                const source = sources[i % sources.length];
                const itemIndex = prev.length + i;
                newItems.push(generateContentItem(source, itemIndex));
              }

              return [...prev, ...newItems];
            });

            setIsLoading(false);
            loadMoreRef.current = false;
          }, 400);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [isLoading]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">For You</h2>
          <p className="text-muted-foreground">Curated insights from the AI ecosystem</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8">
            Latest
          </Button>
          <Button variant="ghost" size="sm" className="h-8">
            Trending
          </Button>
        </div>
      </div>

      {/* Mosaic Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4">
        {items.map((item) => (
          <BentoCard key={item.id} item={item} />
        ))}
      </div>

      {/* Intersection Observer Target */}
      <div ref={observerTarget} className="w-full flex justify-center py-8">
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Loading more content...</span>
          </div>
        )}
      </div>
    </div>
  );
}
