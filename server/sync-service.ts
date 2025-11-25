import { storage } from "./storage";
import type { InsertModelSettings } from "@shared/schema";

// OpenRouter rate limit: 200 requests/minute = ~3 requests/second
// We'll use 1 request every 5 minutes to stay well below limits
const SYNC_INTERVAL_MINUTES = parseInt(process.env.SYNC_INTERVAL_MINUTES || "5", 10);
const SYNC_INTERVAL_MS = SYNC_INTERVAL_MINUTES * 60 * 1000;

interface OpenRouterModel {
  id: string;
  name: string;
  description: string;
  context_length: number;
  pricing: {
    prompt: string;
    completion: string;
  };
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type: string | null;
  };
  top_provider: {
    max_completion_tokens: number;
  };
  supported_parameters: string[];
}

export class SyncService {
  private syncTimer: NodeJS.Timeout | null = null;
  private isSyncing = false;

  async syncOpenRouterModels(): Promise<void> {
    if (this.isSyncing) {
      console.log("[Sync] Already syncing, skipping...");
      return;
    }

    this.isSyncing = true;
    const syncJob = await storage.createSyncJob({
      source: "openrouter",
      status: "running",
      startedAt: new Date(),
    });

    try {
      console.log("[Sync] Fetching models from OpenRouter...");
      
      const response = await fetch("https://openrouter.ai/api/v1/models", {
        headers: {
          "Authorization": process.env.OPENROUTER_API_KEY ? `Bearer ${process.env.OPENROUTER_API_KEY}` : "",
          "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
          "X-Title": "LLMView Platform",
        },
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const models: OpenRouterModel[] = data.data;

      console.log(`[Sync] Received ${models.length} models from OpenRouter`);

      // Transform and prepare for database
      const dbModels: InsertModelSettings[] = models.map((model) => {
        const promptCost = parseFloat(model.pricing?.prompt || "0") * 1000; // per 1K tokens
        const completionCost = parseFloat(model.pricing?.completion || "0") * 1000;

        // Extract provider from model ID (e.g., "anthropic/claude-3" -> "anthropic")
        const provider = model.id.split("/")[0] || "unknown";

        return {
          modelId: model.id,
          displayName: model.name,
          provider: provider,
          inputCostPer1k: promptCost.toString(),
          outputCostPer1k: completionCost.toString(),
          maxTokens: model.top_provider?.max_completion_tokens || model.context_length || 4096,
          contextLength: model.context_length,
          description: model.description,
          architecture: model.architecture as any,
          supportedParameters: model.supported_parameters as any,
          isActive: true,
          metadata: {
            source: "openrouter",
            rawData: model,
          } as any,
          lastSynced: new Date(),
        };
      });

      // Bulk upsert to database
      await storage.bulkUpsertModels(dbModels);

      await storage.updateSyncJob(syncJob.id, {
        status: "completed",
        modelsCount: models.length,
        completedAt: new Date(),
      });

      console.log(`[Sync] Successfully synced ${models.length} models to database`);
    } catch (error) {
      console.error("[Sync] Error syncing OpenRouter models:", error);
      
      await storage.updateSyncJob(syncJob.id, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      });
    } finally {
      this.isSyncing = false;
    }
  }

  async syncHuggingFaceModels(): Promise<void> {
    if (this.isSyncing) {
      console.log("[Sync] Already syncing, skipping...");
      return;
    }

    this.isSyncing = true;
    const syncJob = await storage.createSyncJob({
      source: "huggingface",
      status: "running",
      startedAt: new Date(),
    });

    try {
      console.log("[Sync] Fetching models from Hugging Face...");
      
      const url = new URL("https://huggingface.co/api/models");
      url.searchParams.set("limit", "100");
      url.searchParams.set("sort", "trending");
      url.searchParams.set("filter", "text-generation");

      const response = await fetch(url.toString(), {
        headers: process.env.HUGGINGFACE_API_KEY ? { 
          "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}` 
        } : {},
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.status}`);
      }

      const data = await response.json();

      console.log(`[Sync] Received ${data.length} models from Hugging Face`);

      // Transform and prepare for database
      const dbModels: InsertModelSettings[] = data.map((model: any) => {
        const author = model.author || model.id.split("/")[0];
        const name = model.id.split("/").pop() || model.id;

        return {
          modelId: model.id,
          displayName: name,
          provider: author,
          inputCostPer1k: "0", // Hugging Face models are typically free/self-hosted
          outputCostPer1k: "0",
          maxTokens: 4096, // Default, can be overridden with actual config
          contextLength: null,
          description: model.description || `${name} by ${author}`,
          architecture: {
            library: model.library_name,
            pipeline: model.pipeline_tag,
            model_type: model.config?.model_type,
          } as any,
          supportedParameters: model.tags as any,
          isActive: true,
          metadata: {
            source: "huggingface",
            downloads: model.downloads,
            likes: model.likes,
            tags: model.tags,
            private: model.private,
            gated: model.gated,
            created_at: model.createdAt,
            last_modified: model.lastModified,
          } as any,
          lastSynced: new Date(),
        };
      });

      // Bulk upsert to database
      await storage.bulkUpsertModels(dbModels);

      await storage.updateSyncJob(syncJob.id, {
        status: "completed",
        modelsCount: data.length,
        completedAt: new Date(),
      });

      console.log(`[Sync] Successfully synced ${data.length} Hugging Face models to database`);
    } catch (error) {
      console.error("[Sync] Error syncing Hugging Face models:", error);
      
      await storage.updateSyncJob(syncJob.id, {
        status: "failed",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      });
    } finally {
      this.isSyncing = false;
    }
  }

  start(): void {
    console.log(`[Sync] Starting sync service (interval: ${SYNC_INTERVAL_MS / 1000}s)`);
    
    // Run initial sync for both sources
    this.syncOpenRouterModels();
    
    // Stagger Hugging Face sync by 2 minutes to avoid overlapping
    setTimeout(() => {
      this.syncHuggingFaceModels();
    }, 2 * 60 * 1000);

    // Schedule periodic syncs
    this.syncTimer = setInterval(() => {
      this.syncOpenRouterModels();
      
      // Stagger Hugging Face sync
      setTimeout(() => {
        this.syncHuggingFaceModels();
      }, 2 * 60 * 1000);
    }, SYNC_INTERVAL_MS);
  }

  stop(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
      console.log("[Sync] Sync service stopped");
    }
  }
}

export const syncService = new SyncService();
