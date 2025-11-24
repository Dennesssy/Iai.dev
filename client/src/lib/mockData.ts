// Mock data for LLMView - Models, Providers, and Benchmarks

export interface ModelData {
  id: string;
  name: string;
  creator: string;
  creatorLogo?: string;
  releaseDate: string;
  trainingDataCutoff: string;
  parameters: string;
  contextWindow: number;
  multimodal: boolean;
  reasoning: boolean;
  openSource: boolean;
  costTier: "free" | "budget" | "midmarket" | "enterprise";
  size: "nano" | "small" | "medium" | "large" | "frontier";
  color: string;
  trend?: "up" | "down" | "stable";
}

export interface ProviderEndpoint {
  modelId: string;
  inputPrice: number; // $/1M tokens
  outputPrice: number; // $/1M tokens
  ttftMs: number; // Time to first token
  outputTokensPerSec: number;
  region: string;
  status: "operational" | "degraded" | "down";
}

export interface Provider {
  id: string;
  name: string;
  status: "operational" | "degraded" | "down";
  endpoints: ProviderEndpoint[];
}

export interface BenchmarkScore {
  modelId: string;
  benchmark: string;
  score: number;
  rank: number;
  lastUpdated: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  type: "release" | "benchmark" | "pricing" | "provider" | "research";
  modelId?: string;
  timestamp: string;
  icon: string;
}

export interface Alert {
  id: string;
  type: "performance" | "price" | "release" | "provider";
  title: string;
  description: string;
  modelId?: string;
  severity: "info" | "warning" | "critical";
  timestamp: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  content: string;
  category: "discussion" | "tip" | "review";
  modelId?: string;
  upvotes: number;
  replies: number;
  timestamp: string;
}

// Models Database
export const MODELS: Record<string, ModelData> = {
  "gpt-4-turbo": {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    creator: "OpenAI",
    releaseDate: "2024-04-09",
    trainingDataCutoff: "2023-12",
    parameters: "≈1.76T",
    contextWindow: 128000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "enterprise",
    size: "frontier",
    color: "#0066FF",
    trend: "stable",
  },
  "gpt-4o": {
    id: "gpt-4o",
    name: "GPT-4o",
    creator: "OpenAI",
    releaseDate: "2024-05-13",
    trainingDataCutoff: "2024-04",
    parameters: "≈1.76T",
    contextWindow: 128000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "enterprise",
    size: "frontier",
    color: "#0066FF",
    trend: "up",
  },
  "gpt-4o-mini": {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    creator: "OpenAI",
    releaseDate: "2024-07-18",
    trainingDataCutoff: "2024-04",
    parameters: "≈14B",
    contextWindow: 128000,
    multimodal: true,
    reasoning: false,
    openSource: false,
    costTier: "midmarket",
    size: "small",
    color: "#0066FF",
    trend: "up",
  },
  "claude-3.5-sonnet": {
    id: "claude-3.5-sonnet",
    name: "Claude 3.5 Sonnet",
    creator: "Anthropic",
    releaseDate: "2024-06-20",
    trainingDataCutoff: "2024-04",
    parameters: "Unknown",
    contextWindow: 200000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "enterprise",
    size: "frontier",
    color: "#CA8F2B",
    trend: "up",
  },
  "claude-3.5-haiku": {
    id: "claude-3.5-haiku",
    name: "Claude 3.5 Haiku",
    creator: "Anthropic",
    releaseDate: "2024-11-15",
    trainingDataCutoff: "2024-07",
    parameters: "≈8B",
    contextWindow: 200000,
    multimodal: true,
    reasoning: false,
    openSource: false,
    costTier: "budget",
    size: "small",
    color: "#CA8F2B",
    trend: "up",
  },
  "llama-3.3-70b": {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    creator: "Meta",
    releaseDate: "2024-11-07",
    trainingDataCutoff: "2024-03",
    parameters: "70B",
    contextWindow: 8192,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "large",
    color: "#FF6B35",
    trend: "up",
  },
  "llama-3.1-8b": {
    id: "llama-3.1-8b",
    name: "Llama 3.1 8B",
    creator: "Meta",
    releaseDate: "2024-07-23",
    trainingDataCutoff: "2024-03",
    parameters: "8B",
    contextWindow: 128000,
    multimodal: false,
    reasoning: false,
    openSource: true,
    costTier: "free",
    size: "small",
    color: "#FF6B35",
    trend: "stable",
  },
  "deepseek-v2": {
    id: "deepseek-v2",
    name: "DeepSeek V2",
    creator: "DeepSeek",
    releaseDate: "2024-05-06",
    trainingDataCutoff: "2024-04",
    parameters: "236B (MoE)",
    contextWindow: 4096,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "frontier",
    color: "#0066FF",
    trend: "up",
  },
  "mixtral-8x7b": {
    id: "mixtral-8x7b",
    name: "Mixtral 8x7B",
    creator: "Mistral AI",
    releaseDate: "2023-12-11",
    trainingDataCutoff: "2023-12",
    parameters: "56B (MoE)",
    contextWindow: 32768,
    multimodal: false,
    reasoning: false,
    openSource: true,
    costTier: "budget",
    size: "large",
    color: "#FF8C42",
    trend: "down",
  },
  "mistral-large": {
    id: "mistral-large",
    name: "Mistral Large",
    creator: "Mistral AI",
    releaseDate: "2024-02-16",
    trainingDataCutoff: "2024-01",
    parameters: "Unknown",
    contextWindow: 32768,
    multimodal: false,
    reasoning: true,
    openSource: false,
    costTier: "midmarket",
    size: "large",
    color: "#FF8C42",
    trend: "stable",
  },
  "gemini-2.0-flash": {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    creator: "Google",
    releaseDate: "2024-12-11",
    trainingDataCutoff: "2024-10",
    parameters: "Unknown",
    contextWindow: 1000000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "enterprise",
    size: "frontier",
    color: "#4285F4",
    trend: "up",
  },
  "qwen2.5-72b": {
    id: "qwen2.5-72b",
    name: "Qwen2.5 72B",
    creator: "Alibaba",
    releaseDate: "2024-10-10",
    trainingDataCutoff: "2024-06",
    parameters: "72B",
    contextWindow: 131072,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "large",
    color: "#FF6B6B",
    trend: "up",
  },
};

// Providers Database
export const PROVIDERS: Record<string, Provider> = {
  openai: {
    id: "openai",
    name: "OpenAI",
    status: "operational",
    endpoints: [
      {
        modelId: "gpt-4-turbo",
        inputPrice: 10.0,
        outputPrice: 30.0,
        ttftMs: 450,
        outputTokensPerSec: 3.2,
        region: "us-east-1",
        status: "operational",
      },
      {
        modelId: "gpt-4o",
        inputPrice: 5.0,
        outputPrice: 15.0,
        ttftMs: 380,
        outputTokensPerSec: 3.8,
        region: "us-east-1",
        status: "operational",
      },
      {
        modelId: "gpt-4o-mini",
        inputPrice: 0.15,
        outputPrice: 0.6,
        ttftMs: 200,
        outputTokensPerSec: 5.2,
        region: "us-east-1",
        status: "operational",
      },
    ],
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    status: "operational",
    endpoints: [
      {
        modelId: "claude-3.5-sonnet",
        inputPrice: 3.0,
        outputPrice: 15.0,
        ttftMs: 520,
        outputTokensPerSec: 2.8,
        region: "us-east-1",
        status: "operational",
      },
      {
        modelId: "claude-3.5-haiku",
        inputPrice: 0.8,
        outputPrice: 4.0,
        ttftMs: 250,
        outputTokensPerSec: 4.5,
        region: "us-east-1",
        status: "operational",
      },
    ],
  },
  groq: {
    id: "groq",
    name: "Groq",
    status: "operational",
    endpoints: [
      {
        modelId: "llama-3.3-70b",
        inputPrice: 0.59,
        outputPrice: 0.79,
        ttftMs: 85,
        outputTokensPerSec: 12.5,
        region: "us-east-1",
        status: "operational",
      },
      {
        modelId: "mixtral-8x7b",
        inputPrice: 0.27,
        outputPrice: 0.27,
        ttftMs: 72,
        outputTokensPerSec: 14.2,
        region: "us-east-1",
        status: "operational",
      },
    ],
  },
  togetherai: {
    id: "togetherai",
    name: "Together AI",
    status: "operational",
    endpoints: [
      {
        modelId: "llama-3.3-70b",
        inputPrice: 0.9,
        outputPrice: 1.2,
        ttftMs: 320,
        outputTokensPerSec: 8.3,
        region: "us-west-1",
        status: "operational",
      },
      {
        modelId: "deepseek-v2",
        inputPrice: 0.27,
        outputPrice: 0.81,
        ttftMs: 150,
        outputTokensPerSec: 9.1,
        region: "us-west-1",
        status: "operational",
      },
    ],
  },
  huggingface: {
    id: "huggingface",
    name: "Hugging Face",
    status: "operational",
    endpoints: [
      {
        modelId: "llama-3.1-8b",
        inputPrice: 0.0,
        outputPrice: 0.0,
        ttftMs: 400,
        outputTokensPerSec: 5.0,
        region: "us-central-1",
        status: "operational",
      },
      {
        modelId: "mistral-large",
        inputPrice: 0.5,
        outputPrice: 1.5,
        ttftMs: 280,
        outputTokensPerSec: 7.2,
        region: "us-central-1",
        status: "operational",
      },
    ],
  },
  google: {
    id: "google",
    name: "Google Cloud",
    status: "operational",
    endpoints: [
      {
        modelId: "gemini-2.0-flash",
        inputPrice: 0.075,
        outputPrice: 0.3,
        ttftMs: 280,
        outputTokensPerSec: 6.8,
        region: "us-central-1",
        status: "operational",
      },
    ],
  },
};

// Benchmark Data (Mock with realistic scores)
export const BENCHMARKS = {
  "mmlu-pro": {
    name: "MMLU Pro",
    description: "Massive Multitask Language Understanding (Professional)",
  },
  gpqa: {
    name: "GPQA",
    description: "Google-Proof Q&A",
  },
  ifeval: {
    name: "IFEval",
    description: "Instruction Following Evaluation",
  },
  "human-eval": {
    name: "HumanEval",
    description: "Code Generation",
  },
  gsm8k: {
    name: "GSM8K",
    description: "Grade School Math 8K",
  },
  math: {
    name: "MATH",
    description: "Mathematical Problem Solving",
  },
};

export function getModelScores(
  modelId: string,
  benchmark: string
): { score: number; rank: number } {
  // Generate consistent mock scores based on model ID and benchmark
  const scoreMap: Record<string, Record<string, number>> = {
    "gpt-4-turbo": { "mmlu-pro": 86.4, gpqa: 79.2, ifeval: 88.1, "human-eval": 92.4, gsm8k: 92.0, math: 68.5 },
    "gpt-4o": { "mmlu-pro": 88.7, gpqa: 82.1, ifeval: 89.2, "human-eval": 95.2, gsm8k: 93.2, math: 71.2 },
    "gpt-4o-mini": { "mmlu-pro": 78.2, gpqa: 71.5, ifeval: 82.4, "human-eval": 87.1, gsm8k: 85.3, math: 52.1 },
    "claude-3.5-sonnet": { "mmlu-pro": 88.3, gpqa: 80.9, ifeval: 87.5, "human-eval": 93.8, gsm8k: 94.1, math: 70.3 },
    "claude-3.5-haiku": { "mmlu-pro": 75.8, gpqa: 68.2, ifeval: 80.1, "human-eval": 84.2, gsm8k: 82.1, math: 48.5 },
    "llama-3.3-70b": { "mmlu-pro": 85.2, gpqa: 78.1, ifeval: 85.9, "human-eval": 89.4, gsm8k: 90.2, math: 65.3 },
    "llama-3.1-8b": { "mmlu-pro": 66.3, gpqa: 55.4, ifeval: 71.2, "human-eval": 71.5, gsm8k: 72.1, math: 35.8 },
    "deepseek-v2": { "mmlu-pro": 84.1, gpqa: 76.3, ifeval: 84.2, "human-eval": 87.2, gsm8k: 88.5, math: 62.1 },
    "mixtral-8x7b": { "mmlu-pro": 77.5, gpqa: 69.2, ifeval: 79.8, "human-eval": 81.2, gsm8k: 80.1, math: 51.2 },
    "mistral-large": { "mmlu-pro": 81.2, gpqa: 74.5, ifeval: 83.1, "human-eval": 85.6, gsm8k: 86.2, math: 58.9 },
    "gemini-2.0-flash": { "mmlu-pro": 87.1, gpqa: 81.2, ifeval: 88.9, "human-eval": 94.1, gsm8k: 91.8, math: 69.7 },
    "qwen2.5-72b": { "mmlu-pro": 83.4, gpqa: 75.8, ifeval: 82.6, "human-eval": 86.3, gsm8k: 87.4, math: 60.1 },
  };

  const score = (scoreMap[modelId]?.[benchmark] || 0) + (Math.random() - 0.5) * 2;
  const rank = Math.floor(Math.random() * 20) + 1;
  return { score: Math.min(100, Math.max(0, score)), rank };
}

export function generateBenchmarkTimeSeries(modelId: string, benchmark: string, days: number = 100) {
  const baseScore = (getModelScores(modelId, benchmark).score || 50);
  const data = [];
  
  for (let i = 0; i < days; i++) {
    data.push({
      time: i,
      [`${modelId}`]: baseScore + (Math.random() - 0.5) * 15 + Math.sin(i / 15) * 8,
    });
  }
  
  return data;
}

export const POPULAR_MODELS = [
  "gpt-4o",
  "claude-3.5-sonnet",
  "llama-3.3-70b",
  "deepseek-v2",
  "gemini-2.0-flash",
];

export const MODEL_CATEGORIES = {
  popular: {
    label: "Popular",
    models: ["gpt-4o", "claude-3.5-sonnet", "llama-3.3-70b", "deepseek-v2", "gemini-2.0-flash"],
  },
  bySize: {
    label: "By Size",
    sections: {
      "Nano <1B": [],
      "Small 1-7B": ["llama-3.1-8b", "gpt-4o-mini", "claude-3.5-haiku"],
      "Medium 7-13B": [],
      "Large 13-70B": ["llama-3.3-70b", "mixtral-8x7b", "qwen2.5-72b"],
      "Frontier >70B": ["gpt-4-turbo", "gpt-4o", "claude-3.5-sonnet", "deepseek-v2", "gemini-2.0-flash"],
    },
  },
  byCostTier: {
    label: "By Cost Tier",
    sections: {
      "Free": ["llama-3.1-8b"],
      "Budget": ["llama-3.3-70b", "deepseek-v2", "mixtral-8x7b", "qwen2.5-72b"],
      "Mid-market": ["gpt-4o-mini", "claude-3.5-haiku", "mistral-large"],
      "Enterprise": ["gpt-4-turbo", "gpt-4o", "claude-3.5-sonnet", "gemini-2.0-flash"],
    },
  },
  byProvider: {
    label: "By Provider",
    sections: {
      "OpenAI": ["gpt-4-turbo", "gpt-4o", "gpt-4o-mini"],
      "Anthropic": ["claude-3.5-sonnet", "claude-3.5-haiku"],
      "Meta": ["llama-3.3-70b", "llama-3.1-8b"],
      "Mistral AI": ["mixtral-8x7b", "mistral-large"],
      "DeepSeek": ["deepseek-v2"],
      "Google": ["gemini-2.0-flash"],
      "Alibaba": ["qwen2.5-72b"],
    },
  },
};

// News Feed
export const AI_MARKET_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Gemini 2.0 Flash Released",
    description: "Google releases Gemini 2.0 Flash with 1M context window and native tool use",
    type: "release",
    modelId: "gemini-2.0-flash",
    timestamp: "2025-11-23T10:00:00Z",
    icon: "🚀",
  },
  {
    id: "news-2",
    title: "Claude 3.5 Haiku Now Available",
    description: "Anthropic launches new small but powerful Claude 3.5 Haiku model",
    type: "release",
    modelId: "claude-3.5-haiku",
    timestamp: "2025-11-21T14:30:00Z",
    icon: "🚀",
  },
  {
    id: "news-3",
    title: "OpenAI Cuts GPT-4 Pricing by 20%",
    description: "OpenAI announces significant price reductions for GPT-4 and GPT-4o",
    type: "pricing",
    timestamp: "2025-11-20T09:15:00Z",
    icon: "💰",
  },
  {
    id: "news-4",
    title: "Llama 3.3 70B Hits 85.2% on MMLU-Pro",
    description: "Meta's latest model shows strong performance improvements on key benchmarks",
    type: "benchmark",
    modelId: "llama-3.3-70b",
    timestamp: "2025-11-10T16:45:00Z",
    icon: "📈",
  },
  {
    id: "news-5",
    title: "Groq Expands API Availability",
    description: "Groq API now available in 5 new regions with improved uptime SLA",
    type: "provider",
    timestamp: "2025-11-18T11:20:00Z",
    icon: "🌍",
  },
];

// Alerts
export const ALERTS: Alert[] = [
  {
    id: "alert-1",
    type: "performance",
    title: "GPT-4 Benchmark Improved",
    description: "GPT-4o MMLU-Pro score up 2.1% - now 88.7%",
    modelId: "gpt-4o",
    severity: "info",
    timestamp: "2025-11-23T08:30:00Z",
  },
  {
    id: "alert-2",
    type: "price",
    title: "Anthropic API Price Alert",
    description: "Claude 3.5 Sonnet pricing increased 5% effective next month",
    modelId: "claude-3.5-sonnet",
    severity: "warning",
    timestamp: "2025-11-22T15:45:00Z",
  },
  {
    id: "alert-3",
    type: "release",
    title: "New Model Released",
    description: "Gemini 2.0 Flash is now available for production use",
    modelId: "gemini-2.0-flash",
    severity: "info",
    timestamp: "2025-11-23T09:00:00Z",
  },
  {
    id: "alert-4",
    type: "provider",
    title: "OpenAI Maintenance Window",
    description: "Scheduled maintenance on Dec 24. Brief interruptions expected",
    severity: "info",
    timestamp: "2025-11-23T12:00:00Z",
  },
];

// Community
export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "alex_ml",
    avatar: "👨‍💻",
    title: "GPT-4o vs Claude 3.5: Cost Analysis",
    content: "Running a comparison across our production workloads. GPT-4o is 30% cheaper but Claude slightly better for reasoning tasks.",
    category: "review",
    modelId: "gpt-4o",
    upvotes: 234,
    replies: 45,
    timestamp: "2025-11-23T14:20:00Z",
  },
  {
    id: "post-2",
    author: "dev_insights",
    avatar: "🔧",
    title: "Pro Tip: Route Complex Queries to Opus",
    content: "Discovered that routing only 15% of queries to Claude for reasoning saves 40% on compute while maintaining quality. Simple QA still works great with GPT-4o Mini.",
    category: "tip",
    upvotes: 512,
    replies: 87,
    timestamp: "2025-11-22T10:45:00Z",
  },
  {
    id: "post-3",
    author: "budget_conscious",
    avatar: "💸",
    title: "Llama 3.3 70B is Actually Production Ready",
    content: "Been testing Llama 3.3 for 2 weeks. At $0.59/1M tokens via Groq, it's unbeatable. Performance is 85%+ across benchmarks. Real game changer.",
    category: "review",
    modelId: "llama-3.3-70b",
    upvotes: 867,
    replies: 143,
    timestamp: "2025-11-21T16:30:00Z",
  },
  {
    id: "post-4",
    author: "ai_researcher",
    avatar: "🧬",
    title: "Multimodal Reasoning: GPT-4o vs Gemini 2.0",
    content: "Preliminary tests show Gemini 2.0 Flash excels at image understanding while GPT-4o stronger on text reasoning. Context window matters!",
    category: "discussion",
    upvotes: 445,
    replies: 92,
    timestamp: "2025-11-23T13:15:00Z",
  },
];
