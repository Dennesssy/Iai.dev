import openaiLogo from '@assets/stock_images/minimalist_abstract__e5548587.jpg';
import anthropicLogo from '@assets/stock_images/minimalist_abstract__5e7a0fd4.jpg';
import googleLogo from '@assets/stock_images/minimalist_abstract__2335ffc6.jpg';
import metaLogo from '@assets/stock_images/minimalist_abstract__2335ffc6.jpg';
import mistralLogo from '@assets/stock_images/minimalist_abstract__927ff4b7.jpg';
import deepseekLogo from '@assets/stock_images/minimalist_abstract__2335ffc6.jpg';
import xaiLogo from '@assets/stock_images/minimalist_abstract__e5548587.jpg';
import genericLogo from '@assets/stock_images/minimalist_abstract__561e9037.jpg';

// Mock data for LLMView - Models, Providers, and Benchmarks

export const COMPANY_LOGOS: Record<string, string> = {
  "OpenAI": openaiLogo,
  "Anthropic": anthropicLogo,
  "Google": googleLogo,
  "Meta": metaLogo,
  "Mistral AI": mistralLogo,
  "DeepSeek": deepseekLogo,
  "xAI": xaiLogo,
  "Alibaba": genericLogo,
  "Microsoft": googleLogo,
  "Cohere": genericLogo,
  "MiniMax": genericLogo,
  "KwaiPilot": genericLogo,
  "Zhipu AI": genericLogo,
  "AI21 Labs": genericLogo,
  "Nous Research": genericLogo,
  "Moonshot AI": genericLogo,
};

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

import { Code, MonitorSmartphone, Image, Video, Microscope, PenTool, Mic, Search, Database } from "lucide-react";

// Updated Agent Categories
export const AGENT_CATEGORIES = [
  { 
    id: "cat-coding", 
    name: "Coding", 
    icon: Code,
    agents: [
      { name: "OpenCodeInterpreter", description: "Open source code execution" },
      { name: "Crush", description: "AI IDE Assistant" },
      { name: "Amazon Q", description: "AWS Developer Assistant" },
      { name: "Claude Code", description: "Anthropic's coding agent" },
      { name: "Void", description: "AI Code Editor" },
      { name: "Trae IDE", description: "Integrated Development Environment" },
      { name: "Cursor", description: "AI-first Code Editor" },
      { name: "Cline", description: "Autonomous coding agent" },
      { name: "Augmentcode", description: "Developer productivity tool" },
      { name: "RooCode", description: "AI coding assistant" }
    ]
  },
  { 
    id: "cat-web", 
    name: "Web Design", 
    icon: MonitorSmartphone,
    agents: [
      { name: "Replit", description: "Web site generator & IDE" },
      { name: "V0", description: "UI Component Generator" },
      { name: "Lovable", description: "Full-stack web builder" }
    ]
  },
  { 
    id: "cat-image", 
    name: "Image", 
    icon: Image,
    agents: [
      { name: "Midjourney", description: "Artistic image generation" },
      { name: "Flux", description: "High-fidelity image generation" },
      { name: "Ideogram", description: "Typography-focused generation" }
    ]
  },
  { 
    id: "cat-video", 
    name: "Video", 
    icon: Video,
    agents: [
      { name: "Runway Gen-3", description: "Cinematic video generation" },
      { name: "Sora", description: "OpenAI video model" },
      { name: "Kling", description: "High-motion video generation" }
    ]
  },
  { 
    id: "cat-research", 
    name: "Deep Research", 
    icon: Microscope,
    agents: [
      { name: "Perplexity", description: "AI Search Engine" },
      { name: "Consensus", description: "Scientific research assistant" },
      { name: "Elicit", description: "Research paper analysis" }
    ]
  },
  { 
    id: "cat-writing", 
    name: "Writing", 
    icon: PenTool,
    agents: [
      { name: "Jasper", description: "Marketing copywriter" },
      { name: "Copy.ai", description: "Content generation" },
      { name: "Lex", description: "AI writing processor" }
    ]
  },
  { 
    id: "cat-speech", 
    name: "Speech", 
    icon: Mic,
    agents: [
      { name: "ElevenLabs", description: "Voice synthesis" },
      { name: "PlayHT", description: "AI Voice Generation" }
    ]
  },
  { 
    id: "cat-search", 
    name: "Search", 
    icon: Search,
    agents: [
      { name: "Perplexity", description: "Real-time search" },
      { name: "You.com", description: "AI Search Assistant" }
    ]
  },
  { 
    id: "cat-science", 
    name: "Science", 
    icon: Microscope,
    agents: [
      { name: "AlphaFold", description: "Protein structure prediction" },
      { name: "Galactica", description: "Scientific knowledge base" }
    ]
  },
  { 
    id: "cat-embedding", 
    name: "Embedding", 
    icon: Database,
    agents: [
      { name: "Pinecone", description: "Vector database" },
      { name: "Weaviate", description: "Vector search engine" }
    ]
  }
];

// Models Database - Top 50 Models (Nov 2025)
export const MODELS: Record<string, ModelData> = {
  // --- Frontier Closed Models ---
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
    color: "#00A67E",
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
    color: "#00A67E",
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
    color: "#00A67E",
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
    color: "#D97757",
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
    color: "#D97757",
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
    color: "#D97757",
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
    color: "#1A73E8",
    trend: "up",
  },
  "gemini-2.5-flash": {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    creator: "Google",
    releaseDate: "2025-11-15",
    trainingDataCutoff: "2025-09",
    parameters: "Unknown",
    contextWindow: 1000000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "midmarket",
    size: "large",
    color: "#1A73E8",
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
    color: "#FFFFFF",
    trend: "up",
  },
  "grok-code-fast": {
    id: "grok-code-fast",
    name: "Grok Code Fast",
    creator: "xAI",
    releaseDate: "2025-11-22",
    trainingDataCutoff: "2025-10",
    parameters: "Unknown",
    contextWindow: 128000,
    multimodal: false,
    reasoning: false,
    openSource: false,
    costTier: "budget",
    size: "medium",
    color: "#FFFFFF",
    trend: "up",
  },

  // --- Open Source / Open Weights ---
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
    color: "#0668E1",
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
    color: "#0668E1",
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
    color: "#4E46E5",
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
    color: "#4E46E5",
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
    color: "#6C5CE7",
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
    color: "#6C5CE7",
    trend: "up",
  },
  "qwen3-coder": {
    id: "qwen3-coder",
    name: "Qwen3 Coder",
    creator: "Alibaba",
    releaseDate: "2025-11-12",
    trainingDataCutoff: "2025-10",
    parameters: "32B",
    contextWindow: 128000,
    multimodal: false,
    reasoning: false,
    openSource: true,
    costTier: "budget",
    size: "medium",
    color: "#6C5CE7",
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
    color: "#F59F00",
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
    color: "#F59F00",
    trend: "stable",
  },
  "mixtral-8x22b": {
    id: "mixtral-8x22b",
    name: "Mixtral 8x22B",
    creator: "Mistral AI",
    releaseDate: "2024-04-10",
    trainingDataCutoff: "2024-02",
    parameters: "141B (MoE)",
    contextWindow: 65536,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "budget",
    size: "large",
    color: "#F59F00",
    trend: "stable",
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
  "minimax-m2": {
    id: "minimax-m2",
    name: "Minimax M2",
    creator: "MiniMax",
    releaseDate: "2025-11-05",
    trainingDataCutoff: "2025-09",
    parameters: "Unknown",
    contextWindow: 128000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "midmarket",
    size: "large",
    color: "#FF4757",
    trend: "up",
  },
  "kat-coder-pro": {
    id: "kat-coder-pro",
    name: "KAT Coder Pro",
    creator: "KwaiPilot",
    releaseDate: "2025-11-15",
    trainingDataCutoff: "2025-10",
    parameters: "55B",
    contextWindow: 128000,
    multimodal: false,
    reasoning: false,
    openSource: true,
    costTier: "budget",
    size: "large",
    color: "#2ED573",
    trend: "up",
  },
  "glm-4.6": {
    id: "glm-4.6",
    name: "GLM-4.6",
    creator: "Zhipu AI",
    releaseDate: "2025-11-10",
    trainingDataCutoff: "2025-09",
    parameters: "Unknown",
    contextWindow: 128000,
    multimodal: true,
    reasoning: true,
    openSource: false,
    costTier: "midmarket",
    size: "large",
    color: "#5352ED",
    trend: "up",
  },
  "phi-4-mini": {
    id: "phi-4-mini",
    name: "Phi-4 Mini",
    creator: "Microsoft",
    releaseDate: "2025-10-25",
    trainingDataCutoff: "2025-08",
    parameters: "3.8B",
    contextWindow: 128000,
    multimodal: true,
    reasoning: true,
    openSource: true,
    costTier: "free",
    size: "small",
    color: "#0078D4",
    trend: "up",
  },
  "hermes-3-70b": {
    id: "hermes-3-70b",
    name: "Hermes 3 70B",
    creator: "Nous Research",
    releaseDate: "2025-08-15",
    trainingDataCutoff: "2025-06",
    parameters: "70B",
    contextWindow: 128000,
    multimodal: false,
    reasoning: false,
    openSource: true,
    costTier: "budget",
    size: "large",
    color: "#A3CB38",
    trend: "stable",
  },
  "command-r-plus-08-2025": {
    id: "command-r-plus-08-2025",
    name: "Command R+ (Aug 2025)",
    creator: "Cohere",
    releaseDate: "2025-08-20",
    trainingDataCutoff: "2025-07",
    parameters: "104B",
    contextWindow: 128000,
    multimodal: false,
    reasoning: true,
    openSource: true,
    costTier: "midmarket",
    size: "large",
    color: "#3944BC",
    trend: "stable",
  },
  "jamba-1.5-large": {
    id: "jamba-1.5-large",
    name: "Jamba 1.5 Large",
    creator: "AI21 Labs",
    releaseDate: "2025-09-10",
    trainingDataCutoff: "2025-07",
    parameters: "90B (SSM)",
    contextWindow: 256000,
    multimodal: false,
    reasoning: true,
    openSource: false,
    costTier: "midmarket",
    size: "large",
    color: "#FF9FF3",
    trend: "stable",
  },
};

// Providers Database - Including OpenRouter & Hugging Face Aggregators
export const PROVIDERS: Record<string, Provider> = {
  openrouter: {
    id: "openrouter",
    name: "OpenRouter",
    status: "operational",
    endpoints: [
      // Top Models by Usage
      { modelId: "grok-code-fast", inputPrice: 0.5, outputPrice: 1.5, ttftMs: 150, outputTokensPerSec: 18.5, region: "auto", status: "operational" },
      { modelId: "claude-sonnet-4.5", inputPrice: 4.0, outputPrice: 20.0, ttftMs: 500, outputTokensPerSec: 3.2, region: "auto", status: "operational" },
      { modelId: "minimax-m2", inputPrice: 0.8, outputPrice: 2.4, ttftMs: 220, outputTokensPerSec: 12.0, region: "auto", status: "operational" },
      { modelId: "qwen3-coder", inputPrice: 0.3, outputPrice: 0.9, ttftMs: 180, outputTokensPerSec: 15.0, region: "auto", status: "operational" },
      { modelId: "gemini-3-pro", inputPrice: 0.075, outputPrice: 0.3, ttftMs: 280, outputTokensPerSec: 7.2, region: "auto", status: "operational" },
      { modelId: "kat-coder-pro", inputPrice: 0.25, outputPrice: 0.75, ttftMs: 190, outputTokensPerSec: 14.2, region: "auto", status: "operational" },
      { modelId: "claude-3.5-sonnet", inputPrice: 3.0, outputPrice: 15.0, ttftMs: 520, outputTokensPerSec: 2.8, region: "auto", status: "operational" },
      { modelId: "gemini-2.5-flash", inputPrice: 0.05, outputPrice: 0.2, ttftMs: 200, outputTokensPerSec: 22.0, region: "auto", status: "operational" },
      { modelId: "glm-4.6", inputPrice: 1.0, outputPrice: 3.0, ttftMs: 250, outputTokensPerSec: 9.5, region: "auto", status: "operational" },
      { modelId: "grok-4.1", inputPrice: 8.0, outputPrice: 24.0, ttftMs: 350, outputTokensPerSec: 4.5, region: "auto", status: "operational" },
      { modelId: "gpt-5.1", inputPrice: 15.0, outputPrice: 45.0, ttftMs: 420, outputTokensPerSec: 4.2, region: "auto", status: "operational" },
      { modelId: "gpt-4o", inputPrice: 5.0, outputPrice: 15.0, ttftMs: 380, outputTokensPerSec: 3.8, region: "auto", status: "operational" },
      { modelId: "deepseek-v3", inputPrice: 0.55, outputPrice: 1.65, ttftMs: 210, outputTokensPerSec: 11.5, region: "auto", status: "operational" },
      { modelId: "llama-3.3-70b", inputPrice: 0.59, outputPrice: 0.79, ttftMs: 180, outputTokensPerSec: 12.5, region: "auto", status: "operational" },
    ],
  },
  huggingface: {
    id: "huggingface",
    name: "Hugging Face",
    status: "operational",
    endpoints: [
      // Top Open Source Models (Inference API)
      { modelId: "qwen2.5-72b", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 450, outputTokensPerSec: 6.5, region: "us-east-1", status: "operational" },
      { modelId: "llama-3.3-70b", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 420, outputTokensPerSec: 7.0, region: "us-east-1", status: "operational" },
      { modelId: "deepseek-r1", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 500, outputTokensPerSec: 5.5, region: "us-east-1", status: "operational" },
      { modelId: "mistral-medium-3", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 480, outputTokensPerSec: 6.2, region: "eu-west-1", status: "operational" },
      { modelId: "phi-4-mini", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 150, outputTokensPerSec: 25.0, region: "us-east-1", status: "operational" },
      { modelId: "hermes-3-70b", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 430, outputTokensPerSec: 6.8, region: "us-east-1", status: "operational" },
      { modelId: "mixtral-8x22b", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 550, outputTokensPerSec: 4.5, region: "us-east-1", status: "operational" },
      { modelId: "qwen3-coder", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 380, outputTokensPerSec: 8.5, region: "us-east-1", status: "operational" },
      { modelId: "command-r-plus-08-2025", inputPrice: 0.0, outputPrice: 0.0, ttftMs: 520, outputTokensPerSec: 5.0, region: "us-east-1", status: "operational" },
    ],
  },
  openai: {
    id: "openai",
    name: "OpenAI",
    status: "operational",
    endpoints: [
      { modelId: "gpt-5.1", inputPrice: 15.0, outputPrice: 45.0, ttftMs: 420, outputTokensPerSec: 4.2, region: "us-east-1", status: "operational" },
      { modelId: "gpt-4o", inputPrice: 5.0, outputPrice: 15.0, ttftMs: 380, outputTokensPerSec: 3.8, region: "us-east-1", status: "operational" },
      { modelId: "gpt-4o-mini", inputPrice: 0.15, outputPrice: 0.6, ttftMs: 200, outputTokensPerSec: 5.2, region: "us-east-1", status: "operational" },
    ],
  },
  anthropic: {
    id: "anthropic",
    name: "Anthropic",
    status: "operational",
    endpoints: [
      { modelId: "claude-sonnet-4.5", inputPrice: 4.0, outputPrice: 20.0, ttftMs: 500, outputTokensPerSec: 3.2, region: "us-east-1", status: "operational" },
      { modelId: "claude-3.5-sonnet", inputPrice: 3.0, outputPrice: 15.0, ttftMs: 520, outputTokensPerSec: 2.8, region: "us-east-1", status: "operational" },
      { modelId: "claude-3.5-haiku", inputPrice: 0.8, outputPrice: 4.0, ttftMs: 250, outputTokensPerSec: 4.5, region: "us-east-1", status: "operational" },
    ],
  },
  groq: {
    id: "groq",
    name: "Groq",
    status: "operational",
    endpoints: [
      { modelId: "llama-3.3-70b", inputPrice: 0.59, outputPrice: 0.79, ttftMs: 85, outputTokensPerSec: 12.5, region: "us-east-1", status: "operational" },
    ],
  },
  google: {
    id: "google",
    name: "Google Cloud",
    status: "operational",
    endpoints: [
      { modelId: "gemini-3-pro", inputPrice: 0.075, outputPrice: 0.3, ttftMs: 280, outputTokensPerSec: 7.2, region: "us-central-1", status: "operational" },
      { modelId: "gemini-2.5-flash", inputPrice: 0.05, outputPrice: 0.2, ttftMs: 200, outputTokensPerSec: 22.0, region: "us-central-1", status: "operational" },
    ],
  },
  xai: {
    id: "xai",
    name: "xAI",
    status: "operational",
    endpoints: [
      { modelId: "grok-4.1", inputPrice: 8.0, outputPrice: 24.0, ttftMs: 350, outputTokensPerSec: 4.5, region: "us-west-1", status: "operational" },
      { modelId: "grok-code-fast", inputPrice: 0.5, outputPrice: 1.5, ttftMs: 150, outputTokensPerSec: 18.5, region: "us-west-1", status: "operational" },
    ],
  },
  together: {
    id: "together",
    name: "Together AI",
    status: "operational",
    endpoints: [
      { modelId: "deepseek-r1", inputPrice: 0.55, outputPrice: 1.65, ttftMs: 200, outputTokensPerSec: 8.5, region: "us-west-1", status: "operational" },
      { modelId: "qwen3-235b", inputPrice: 0.8, outputPrice: 2.4, ttftMs: 250, outputTokensPerSec: 7.8, region: "us-west-1", status: "operational" },
      { modelId: "mixtral-8x22b", inputPrice: 0.9, outputPrice: 2.7, ttftMs: 280, outputTokensPerSec: 6.5, region: "us-west-1", status: "operational" },
    ],
  },
  mistral: {
    id: "mistral",
    name: "Mistral AI",
    status: "operational",
    endpoints: [
      { modelId: "mistral-medium-3", inputPrice: 0.4, outputPrice: 1.2, ttftMs: 220, outputTokensPerSec: 6.5, region: "eu-west-1", status: "operational" },
      { modelId: "mistral-large", inputPrice: 0.8, outputPrice: 2.4, ttftMs: 320, outputTokensPerSec: 5.2, region: "eu-west-1", status: "operational" },
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
    "gemini-2.5-flash": { "mmlu-pro": 87.1, gpqa: 82.5, aime: 86.8, "live-code": 78.5, "swe-bench": 74.2, gsm8k: 92.5 },
    "grok-4.1": { "mmlu-pro": 88.9, gpqa: 87.5, aime: 92.1, "live-code": 79.0, "swe-bench": 76.8, gsm8k: 93.5 },
    "grok-code-fast": { "mmlu-pro": 82.5, gpqa: 75.8, aime: 81.2, "live-code": 86.4, "swe-bench": 75.2, gsm8k: 88.9 },
    "kimi-k2-thinking": { "mmlu-pro": 87.5, gpqa: 85.2, aime: 99.1, "live-code": 83.1, "swe-bench": 79.4, gsm8k: 96.8 },
    "llama-3.3-70b": { "mmlu-pro": 85.2, gpqa: 78.1, aime: 81.3, "live-code": 76.5, "swe-bench": 71.2, gsm8k: 90.2 },
    "llama-4-scout": { "mmlu-pro": 86.8, gpqa: 79.8, aime: 83.5, "live-code": 78.2, "swe-bench": 73.1, gsm8k: 91.7 },
    "deepseek-r1": { "mmlu-pro": 86.5, gpqa: 82.3, aime: 89.6, "live-code": 81.2, "swe-bench": 77.8, gsm8k: 92.1 },
    "deepseek-v3": { "mmlu-pro": 85.9, gpqa: 81.1, aime: 88.2, "live-code": 80.5, "swe-bench": 76.5, gsm8k: 91.3 },
    "qwen3-235b": { "mmlu-pro": 87.2, gpqa: 83.4, aime: 90.8, "live-code": 82.1, "swe-bench": 78.6, gsm8k: 93.2 },
    "qwen2.5-72b": { "mmlu-pro": 83.4, gpqa: 75.8, aime: 79.5, "live-code": 77.3, "swe-bench": 72.1, gsm8k: 87.4 },
    "qwen3-coder": { "mmlu-pro": 82.1, gpqa: 74.2, aime: 78.5, "live-code": 84.5, "swe-bench": 77.1, gsm8k: 88.5 },
    "mistral-medium-3": { "mmlu-pro": 81.5, gpqa: 72.9, aime: 75.2, "live-code": 74.8, "swe-bench": 70.3, gsm8k: 85.1 },
    "mistral-large": { "mmlu-pro": 81.2, gpqa: 74.5, aime: 76.8, "live-code": 73.6, "swe-bench": 69.5, gsm8k: 86.2 },
    "mixtral-8x22b": { "mmlu-pro": 79.8, gpqa: 73.5, aime: 74.1, "live-code": 72.5, "swe-bench": 68.1, gsm8k: 84.5 },
    "minimax-m2": { "mmlu-pro": 85.4, gpqa: 80.2, aime: 82.5, "live-code": 77.8, "swe-bench": 73.5, gsm8k: 90.1 },
    "kat-coder-pro": { "mmlu-pro": 80.5, gpqa: 71.5, aime: 76.8, "live-code": 83.2, "swe-bench": 75.8, gsm8k: 87.2 },
    "glm-4.6": { "mmlu-pro": 86.1, gpqa: 81.5, aime: 84.2, "live-code": 79.5, "swe-bench": 74.8, gsm8k: 91.5 },
    "phi-4-mini": { "mmlu-pro": 76.8, gpqa: 68.5, aime: 72.5, "live-code": 74.1, "swe-bench": 66.5, gsm8k: 83.2 },
    "hermes-3-70b": { "mmlu-pro": 83.5, gpqa: 76.2, aime: 78.5, "live-code": 75.1, "swe-bench": 70.8, gsm8k: 88.5 },
    "command-r-plus-08-2025": { "mmlu-pro": 84.2, gpqa: 77.5, aime: 79.8, "live-code": 76.5, "swe-bench": 72.1, gsm8k: 89.1 },
    "jamba-1.5-large": { "mmlu-pro": 82.5, gpqa: 75.8, aime: 77.2, "live-code": 74.8, "swe-bench": 70.5, gsm8k: 87.8 },
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
  "grok-code-fast",
  "minimax-m2",
];

export const MODEL_CATEGORIES = {
  popular: {
    label: "Popular (Nov 2025)",
    models: ["gpt-5.1", "gemini-3-pro", "claude-sonnet-4.5", "grok-code-fast", "minimax-m2"],
  },
  bySize: {
    label: "By Size",
    sections: {
      "Nano <1B": [],
      "Small 1-7B": ["claude-3.5-haiku", "phi-4-mini"],
      "Medium 7-13B": ["mistral-medium-3", "qwen3-coder"],
      "Large 13-70B": ["llama-3.3-70b", "qwen2.5-72b", "hermes-3-70b", "kat-coder-pro"],
      "Frontier >70B": ["gpt-5.1", "gemini-3-pro", "claude-sonnet-4.5", "grok-4.1", "kimi-k2-thinking", "deepseek-v3", "qwen3-235b", "llama-4-scout", "command-r-plus-08-2025", "jamba-1.5-large"],
    },
  },
  byCostTier: {
    label: "By Cost Tier",
    sections: {
      "Free": ["phi-4-mini", "llama-3.3-70b", "qwen2.5-72b"], // Via free inference providers
      "Budget": ["grok-code-fast", "deepseek-r1", "deepseek-v3", "qwen3-235b", "kat-coder-pro", "mistral-medium-3", "llama-4-scout"],
      "Mid-market": ["gpt-4o-mini", "claude-3.5-haiku", "mistral-large", "gemini-2.5-flash", "minimax-m2", "glm-4.6", "jamba-1.5-large"],
      "Enterprise": ["gpt-5.1", "gpt-4o", "claude-sonnet-4.5", "claude-3.5-sonnet", "gemini-3-pro", "grok-4.1", "kimi-k2-thinking"],
    },
  },
  byProvider: {
    label: "By Provider",
    sections: {
      "OpenRouter": ["grok-code-fast", "claude-sonnet-4.5", "minimax-m2", "qwen3-coder", "gemini-3-pro", "kat-coder-pro", "glm-4.6", "deepseek-v3"],
      "Hugging Face": ["qwen2.5-72b", "llama-3.3-70b", "deepseek-r1", "phi-4-mini", "hermes-3-70b", "mixtral-8x22b", "command-r-plus-08-2025"],
      "OpenAI": ["gpt-5.1", "gpt-4o", "gpt-4o-mini"],
      "Anthropic": ["claude-sonnet-4.5", "claude-3.5-sonnet", "claude-3.5-haiku"],
      "Meta": ["llama-3.3-70b", "llama-4-scout"],
      "Google": ["gemini-3-pro", "gemini-2.5-flash"],
      "xAI": ["grok-4.1", "grok-code-fast"],
      "Moonshot AI": ["kimi-k2-thinking"],
      "DeepSeek": ["deepseek-r1", "deepseek-v3"],
      "Alibaba": ["qwen3-235b", "qwen2.5-72b", "qwen3-coder"],
      "Mistral AI": ["mistral-medium-3", "mistral-large", "mixtral-8x22b"],
    },
  },
};

// News Feed - Updated November 2025
export const AI_MARKET_NEWS: NewsItem[] = [
  {
    id: "news-1",
    title: "OpenRouter Usage Report: Grok Dominates",
    description: "Grok Code Fast captures 49% of OpenRouter traffic, signaling shift to specialized coding models",
    type: "benchmark",
    modelId: "grok-code-fast",
    timestamp: "2025-11-24T09:00:00Z",
    icon: "📊",
  },
  {
    id: "news-2",
    title: "Gemini 3 Pro Achieves 100% on AIME 2025",
    description: "Google's Gemini 3 Pro sets new record with perfect score on mathematical reasoning benchmark",
    type: "benchmark",
    modelId: "gemini-3-pro",
    timestamp: "2025-11-23T14:00:00Z",
    icon: "🏆",
  },
  {
    id: "news-3",
    title: "Claude Sonnet 4.5 Released - 82% on SWE-bench",
    description: "Anthropic launches Claude Sonnet 4.5 with breakthrough agentic coding performance",
    type: "release",
    modelId: "claude-sonnet-4.5",
    timestamp: "2025-11-23T10:00:00Z",
    icon: "🚀",
  },
  {
    id: "news-4",
    title: "Hugging Face Trending: Qwen3 Coder",
    description: "Qwen3 Coder becomes #1 trending model on Hugging Face with 500k downloads in 24h",
    type: "release",
    modelId: "qwen3-coder",
    timestamp: "2025-11-22T16:30:00Z",
    icon: "📈",
  },
  {
    id: "news-5",
    title: "GPT-5.1 Expands to 400K Context Window",
    description: "OpenAI releases GPT-5.1 with 400K token context and improved reasoning capabilities",
    type: "release",
    modelId: "gpt-5.1",
    timestamp: "2025-11-22T09:30:00Z",
    icon: "🚀",
  },
  {
    id: "news-6",
    title: "DeepSeek R1 Hybrid Model Goes Live",
    description: "DeepSeek launches R1 combining API and open-source reasoning with sub-$1/M token pricing",
    type: "release",
    modelId: "deepseek-r1",
    timestamp: "2025-11-21T16:45:00Z",
    icon: "💰",
  },
  {
    id: "news-7",
    title: "Llama 4 Scout Enables 10M Token Context",
    description: "Meta releases Llama 4 Scout with unprecedented 10 million token context window for document analysis",
    type: "release",
    modelId: "llama-4-scout",
    timestamp: "2025-11-19T11:15:00Z",
    icon: "🚀",
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
    type: "provider",
    title: "OpenRouter Integration",
    description: "Added support for 50+ new models via OpenRouter API aggregator",
    severity: "info",
    timestamp: "2025-11-24T08:00:00Z",
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
    author: "open_router_fan",
    avatar: "🌐",
    title: "Grok Code Fast is insanely good/cheap",
    content: "I'm routing all my code completion to Grok Code Fast via OpenRouter. It's literally half the price of Haiku and feels smarter for Python.",
    category: "tip",
    modelId: "grok-code-fast",
    upvotes: 1205,
    replies: 210,
    timestamp: "2025-11-24T10:15:00Z",
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
    author: "hf_daily",
    avatar: "🤗",
    title: "Qwen3 Coder taking over Hugging Face",
    content: "The download stats don't lie. Qwen3 Coder is the new default for local dev environments. Runs great on a 4090.",
    category: "review",
    modelId: "qwen3-coder",
    upvotes: 650,
    replies: 98,
    timestamp: "2025-11-22T12:45:00Z",
  },
];
