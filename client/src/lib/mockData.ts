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

// Models Database - Updated November 2025
export const MODELS: Record<string, ModelData> = {
  "gpt-5.1": {
    id: "gpt-5.1",
    name: "GPT-5.1",
    creator: "OpenAI",
    releaseDate: "2025-11-15",
    trainingDataCutoff: "2025-10",
    parameters: "≈2.2T",
    contextWindow: 400000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "enterprise",
    size: "frontier",
    color: "#0066FF",
    trend: "up",
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
    trend: "stable",
  },
  "claude-sonnet-4.5": {
    id: "claude-sonnet-4.5",
    name: "Claude Sonnet 4.5",
    creator: "Anthropic",
    releaseDate: "2025-11-10",
    trainingDataCutoff: "2025-09",
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
  "gemini-3-pro": {
    id: "gemini-3-pro",
    name: "Gemini 3 Pro",
    creator: "Google",
    releaseDate: "2025-11-20",
    trainingDataCutoff: "2025-10",
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
  "grok-4.1": {
    id: "grok-4.1",
    name: "Grok 4.1",
    creator: "xAI",
    releaseDate: "2025-11-18",
    trainingDataCutoff: "2025-09",
    parameters: "Unknown",
    contextWindow: 256000,
    multimodal: false,
    reasoning: true,
    openSource: false,
    costTier: "enterprise",
    size: "frontier",
    color: "#FF9D3D",
    trend: "up",
  },
  "kimi-k2-thinking": {
    id: "kimi-k2-thinking",
    name: "Kimi K2 Thinking",
    creator: "Moonshot AI",
    releaseDate: "2025-11-12",
    trainingDataCutoff: "2025-10",
    parameters: "Unknown",
    contextWindow: 200000,
    multimodal: false,
    reasoning: true,
    openSource: false,
    costTier: "enterprise",
    size: "frontier",
    color: "#6366F1",
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
  "llama-4-scout": {
    id: "llama-4-scout",
    name: "Llama 4 Scout",
    creator: "Meta",
    releaseDate: "2025-11-01",
    trainingDataCutoff: "2025-08",
    parameters: "Unknown",
    contextWindow: 10000000,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "large",
    color: "#FF6B35",
    trend: "up",
  },
  "deepseek-r1": {
    id: "deepseek-r1",
    name: "DeepSeek R1",
    creator: "DeepSeek",
    releaseDate: "2025-11-05",
    trainingDataCutoff: "2025-09",
    parameters: "Variable MoE",
    contextWindow: 128000,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "frontier",
    color: "#0066FF",
    trend: "up",
  },
  "deepseek-v3": {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    creator: "DeepSeek",
    releaseDate: "2025-10-15",
    trainingDataCutoff: "2025-08",
    parameters: "671B (MoE)",
    contextWindow: 65536,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "frontier",
    color: "#0066FF",
    trend: "up",
  },
  "qwen3-235b": {
    id: "qwen3-235b",
    name: "Qwen3-235B",
    creator: "Alibaba",
    releaseDate: "2025-11-08",
    trainingDataCutoff: "2025-09",
    parameters: "235B (MoE)",
    contextWindow: 200000,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "frontier",
    color: "#FF6B6B",
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
  "mistral-medium-3": {
    id: "mistral-medium-3",
    name: "Mistral Medium 3",
    creator: "Mistral AI",
    releaseDate: "2025-11-01",
    trainingDataCutoff: "2025-09",
    parameters: "Unknown",
    contextWindow: 32768,
    multimodal: false,
    reasoning: true,
    openSource: false,
    costTier: "budget",
    size: "medium",
    color: "#FF8C42",
    trend: "up",
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
};

// Providers Database
export const PROVIDERS: Record<string, Provider> = {
  openai: {
    id: "openai",
    name: "OpenAI",
    status: "operational",
    endpoints: [
      {
        modelId: "gpt-5.1",
        inputPrice: 15.0,
        outputPrice: 45.0,
        ttftMs: 420,
        outputTokensPerSec: 4.2,
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
        modelId: "claude-sonnet-4.5",
        inputPrice: 4.0,
        outputPrice: 20.0,
        ttftMs: 500,
        outputTokensPerSec: 3.2,
        region: "us-east-1",
        status: "operational",
      },
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
    ],
  },
  google: {
    id: "google",
    name: "Google Cloud",
    status: "operational",
    endpoints: [
      {
        modelId: "gemini-3-pro",
        inputPrice: 0.075,
        outputPrice: 0.3,
        ttftMs: 280,
        outputTokensPerSec: 7.2,
        region: "us-central-1",
        status: "operational",
      },
    ],
  },
  xai: {
    id: "xai",
    name: "xAI",
    status: "operational",
    endpoints: [
      {
        modelId: "grok-4.1",
        inputPrice: 8.0,
        outputPrice: 24.0,
        ttftMs: 350,
        outputTokensPerSec: 4.5,
        region: "us-west-1",
        status: "operational",
      },
    ],
  },
  together: {
    id: "together",
    name: "Together AI",
    status: "operational",
    endpoints: [
      {
        modelId: "deepseek-r1",
        inputPrice: 0.55,
        outputPrice: 1.65,
        ttftMs: 200,
        outputTokensPerSec: 8.5,
        region: "us-west-1",
        status: "operational",
      },
      {
        modelId: "qwen3-235b",
        inputPrice: 0.8,
        outputPrice: 2.4,
        ttftMs: 250,
        outputTokensPerSec: 7.8,
        region: "us-west-1",
        status: "operational",
      },
    ],
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    status: "operational",
    endpoints: [
      {
        modelId: "mistral-medium-3",
        inputPrice: 0.4,
        outputPrice: 1.2,
        ttftMs: 220,
        outputTokensPerSec: 6.5,
        region: "eu-west-1",
        status: "operational",
      },
      {
        modelId: "mistral-large",
        inputPrice: 0.8,
        outputPrice: 2.4,
        ttftMs: 320,
        outputTokensPerSec: 5.2,
        region: "eu-west-1",
        status: "operational",
      },
    ],
  },
};

// Benchmark Data (Mock with realistic scores - Updated November 2025)
export const BENCHMARKS = {
  "mmlu-pro": {
    name: "MMLU Pro",
    description: "Massive Multitask Language Understanding (Professional)",
  },
  gpqa: {
    name: "GPQA Diamond",
    description: "Google-Proof Q&A (Reasoning)",
  },
  aime: {
    name: "AIME 2025",
    description: "American Invitational Mathematics Exam",
  },
  "live-code": {
    name: "LiveCodeBench",
    description: "Real-time Code Generation",
  },
  "swe-bench": {
    name: "SWE-bench",
    description: "Software Engineering Benchmarks",
  },
  gsm8k: {
    name: "GSM8K",
    description: "Grade School Math 8K",
  },
};

export function getModelScores(
  modelId: string,
  benchmark: string
): { score: number; rank: number } {
  // Updated November 2025 benchmark scores
  const scoreMap: Record<string, Record<string, number>> = {
    "gpt-5.1": { "mmlu-pro": 89.5, gpqa: 88.1, aime: 94.2, "live-code": 87.5, "swe-bench": 86.3, gsm8k: 95.1 },
    "gpt-4o": { "mmlu-pro": 88.7, gpqa: 82.1, aime: 85.4, "live-code": 84.2, "swe-bench": 78.5, gsm8k: 93.2 },
    "gpt-4o-mini": { "mmlu-pro": 78.2, gpqa: 71.5, aime: 72.1, "live-code": 75.3, "swe-bench": 68.2, gsm8k: 85.3 },
    "claude-sonnet-4.5": { "mmlu-pro": 89.1, gpqa: 84.7, aime: 88.9, "live-code": 81.5, "swe-bench": 82.0, gsm8k: 94.3 },
    "claude-3.5-sonnet": { "mmlu-pro": 88.3, gpqa: 80.9, aime: 86.2, "live-code": 79.8, "swe-bench": 78.9, gsm8k: 94.1 },
    "claude-3.5-haiku": { "mmlu-pro": 75.8, gpqa: 68.2, aime: 71.5, "live-code": 72.1, "swe-bench": 65.3, gsm8k: 82.1 },
    "gemini-3-pro": { "mmlu-pro": 92.3, gpqa: 91.9, aime: 100.0, "live-code": 79.7, "swe-bench": 80.2, gsm8k: 97.2 },
    "grok-4.1": { "mmlu-pro": 88.9, gpqa: 87.5, aime: 92.1, "live-code": 79.0, "swe-bench": 76.8, gsm8k: 93.5 },
    "kimi-k2-thinking": { "mmlu-pro": 87.5, gpqa: 85.2, aime: 99.1, "live-code": 83.1, "swe-bench": 79.4, gsm8k: 96.8 },
    "llama-3.3-70b": { "mmlu-pro": 85.2, gpqa: 78.1, aime: 81.3, "live-code": 76.5, "swe-bench": 71.2, gsm8k: 90.2 },
    "llama-4-scout": { "mmlu-pro": 86.8, gpqa: 79.8, aime: 83.5, "live-code": 78.2, "swe-bench": 73.1, gsm8k: 91.7 },
    "deepseek-r1": { "mmlu-pro": 86.5, gpqa: 82.3, aime: 89.6, "live-code": 81.2, "swe-bench": 77.8, gsm8k: 92.1 },
    "deepseek-v3": { "mmlu-pro": 85.9, gpqa: 81.1, aime: 88.2, "live-code": 80.5, "swe-bench": 76.5, gsm8k: 91.3 },
    "qwen3-235b": { "mmlu-pro": 87.2, gpqa: 83.4, aime: 90.8, "live-code": 82.1, "swe-bench": 78.6, gsm8k: 93.2 },
    "qwen2.5-72b": { "mmlu-pro": 83.4, gpqa: 75.8, aime: 79.5, "live-code": 77.3, "swe-bench": 72.1, gsm8k: 87.4 },
    "mistral-medium-3": { "mmlu-pro": 81.5, gpqa: 72.9, aime: 75.2, "live-code": 74.8, "swe-bench": 70.3, gsm8k: 85.1 },
    "mistral-large": { "mmlu-pro": 81.2, gpqa: 74.5, aime: 76.8, "live-code": 73.6, "swe-bench": 69.5, gsm8k: 86.2 },
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
  "gpt-5.1",
  "gemini-3-pro",
  "claude-sonnet-4.5",
  "grok-4.1",
  "kimi-k2-thinking",
];

export const MODEL_CATEGORIES = {
  popular: {
    label: "Popular (Nov 2025)",
    models: ["gpt-5.1", "gemini-3-pro", "claude-sonnet-4.5", "grok-4.1", "kimi-k2-thinking"],
  },
  bySize: {
    label: "By Size",
    sections: {
      "Nano <1B": [],
      "Small 1-7B": ["claude-3.5-haiku"],
      "Medium 7-13B": ["mistral-medium-3"],
      "Large 13-70B": ["llama-3.3-70b", "qwen2.5-72b"],
      "Frontier >70B": ["gpt-5.1", "gemini-3-pro", "claude-sonnet-4.5", "grok-4.1", "kimi-k2-thinking", "deepseek-v3", "qwen3-235b", "llama-4-scout"],
    },
  },
  byCostTier: {
    label: "By Cost Tier",
    sections: {
      "Budget": ["llama-3.3-70b", "deepseek-r1", "deepseek-v3", "qwen3-235b", "qwen2.5-72b", "mistral-medium-3", "llama-4-scout"],
      "Mid-market": ["gpt-4o-mini", "claude-3.5-haiku", "mistral-large"],
      "Enterprise": ["gpt-5.1", "gpt-4o", "claude-sonnet-4.5", "claude-3.5-sonnet", "gemini-3-pro", "grok-4.1", "kimi-k2-thinking"],
    },
  },
  byProvider: {
    label: "By Provider",
    sections: {
      "OpenAI": ["gpt-5.1", "gpt-4o", "gpt-4o-mini"],
      "Anthropic": ["claude-sonnet-4.5", "claude-3.5-sonnet", "claude-3.5-haiku"],
      "Meta": ["llama-3.3-70b", "llama-4-scout"],
      "Google": ["gemini-3-pro"],
      "xAI": ["grok-4.1"],
      "Moonshot AI": ["kimi-k2-thinking"],
      "DeepSeek": ["deepseek-r1", "deepseek-v3"],
      "Alibaba": ["qwen3-235b", "qwen2.5-72b"],
      "Mistral AI": ["mistral-medium-3", "mistral-large"],
    },
  },
};

// News Feed - Updated November 2025
export const AI_MARKET_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "Gemini 3 Pro Achieves 100% on AIME 2025",
    description: "Google's Gemini 3 Pro sets new record with perfect score on mathematical reasoning benchmark",
    type: "benchmark",
    modelId: "gemini-3-pro",
    timestamp: "2025-11-23T14:00:00Z",
    icon: "🏆",
  },
  {
    id: "news-2",
    title: "Claude Sonnet 4.5 Released - 82% on SWE-bench",
    description: "Anthropic launches Claude Sonnet 4.5 with breakthrough agentic coding performance",
    type: "release",
    modelId: "claude-sonnet-4.5",
    timestamp: "2025-11-23T10:00:00Z",
    icon: "🚀",
  },
  {
    id: "news-3",
    title: "GPT-5.1 Expands to 400K Context Window",
    description: "OpenAI releases GPT-5.1 with 400K token context and improved reasoning capabilities",
    type: "release",
    modelId: "gpt-5.1",
    timestamp: "2025-11-22T09:30:00Z",
    icon: "🚀",
  },
  {
    id: "news-4",
    title: "DeepSeek R1 Hybrid Model Goes Live",
    description: "DeepSeek launches R1 combining API and open-source reasoning with sub-$1/M token pricing",
    type: "release",
    modelId: "deepseek-r1",
    timestamp: "2025-11-21T16:45:00Z",
    icon: "💰",
  },
  {
    id: "news-5",
    title: "Kimi K2 Thinking: 99.1% on AIME 2025",
    description: "Moonshot AI's K2 Thinking model demonstrates exceptional mathematical reasoning performance",
    type: "benchmark",
    modelId: "kimi-k2-thinking",
    timestamp: "2025-11-20T13:20:00Z",
    icon: "📈",
  },
  {
    id: "news-6",
    title: "Llama 4 Scout Enables 10M Token Context",
    description: "Meta releases Llama 4 Scout with unprecedented 10 million token context window for document analysis",
    type: "release",
    modelId: "llama-4-scout",
    timestamp: "2025-11-19T11:15:00Z",
    icon: "🚀",
  },
  {
    id: "news-7",
    title: "Mistral Medium 3: 90% Performance at 8x Savings",
    description: "Mistral AI's Medium 3 achieves 90% of frontier model performance at 8x lower cost",
    type: "pricing",
    modelId: "mistral-medium-3",
    timestamp: "2025-11-18T15:00:00Z",
    icon: "💰",
  },
];

// Alerts - Updated November 2025
export const ALERTS: Alert[] = [
  {
    id: "alert-1",
    type: "release",
    title: "New Frontier Models Available",
    description: "GPT-5.1, Gemini 3 Pro, and Claude Sonnet 4.5 now production-ready",
    severity: "info",
    timestamp: "2025-11-23T12:00:00Z",
  },
  {
    id: "alert-2",
    type: "performance",
    title: "Gemini 3 Pro Benchmark Leader",
    description: "Leading on GPQA (91.9%), AIME (100%), and MMLU-Pro (92.3%)",
    severity: "info",
    timestamp: "2025-11-23T11:30:00Z",
  },
  {
    id: "alert-3",
    type: "price",
    title: "Open Models Challenge Pricing",
    description: "DeepSeek R1 and Qwen3 offer frontier-level performance at <$1/M tokens",
    severity: "warning",
    timestamp: "2025-11-22T10:15:00Z",
  },
  {
    id: "alert-4",
    type: "performance",
    title: "MoE Models Gain Momentum",
    description: "Mixture-of-Experts architecture now standard: DeepSeek V3, Qwen3, GPT-5.1",
    severity: "info",
    timestamp: "2025-11-21T14:45:00Z",
  },
];

// Community - Updated November 2025
export const COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    author: "ml_engineer",
    avatar: "👨‍💻",
    title: "Gemini 3 Pro vs GPT-5.1: Real-world Comparison",
    content: "Tested both on production workloads. Gemini 3 Pro excels at reasoning, GPT-5.1 slightly faster. Cost difference negligible for most use cases.",
    category: "review",
    modelId: "gemini-3-pro",
    upvotes: 456,
    replies: 82,
    timestamp: "2025-11-23T18:20:00Z",
  },
  {
    id: "post-2",
    author: "cost_optimizer",
    avatar: "💰",
    title: "Frontier Performance at Budget Pricing with DeepSeek R1",
    content: "Deployed DeepSeek R1 across our inference pipeline. Getting 86%+ benchmark scores at $0.55/M tokens. This changes everything for cost optimization.",
    category: "tip",
    modelId: "deepseek-r1",
    upvotes: 892,
    replies: 156,
    timestamp: "2025-11-22T16:30:00Z",
  },
  {
    id: "post-3",
    author: "swe_bench_tracker",
    avatar: "🔧",
    title: "Claude Sonnet 4.5 Reaches 82% on SWE-bench",
    content: "Claude Sonnet 4.5 achieving 82% on software engineering tasks - best for agentic code generation",
    category: "discussion",
    modelId: "claude-sonnet-4.5",
    upvotes: 723,
    replies: 134,
    timestamp: "2025-11-23T14:15:00Z",
  },
  {
    id: "post-4",
    author: "ai_research",
    avatar: "🧬",
    title: "10M Context Window Game Changer",
    content: "Llama 4 Scout's 10M token context is revolutionary for document analysis. Successfully processed entire codebases and legal documents in single queries.",
    category: "review",
    modelId: "llama-4-scout",
    upvotes: 578,
    replies: 98,
    timestamp: "2025-11-21T12:45:00Z",
  },
];
