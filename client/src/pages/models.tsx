import { useState, useEffect } from "react";
import Shell from "@/components/layout/Shell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, X, ExternalLink, Github, Star, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Static curated data
const BENCHMARKS = [
  { id: "humaneval", name: "HumanEval", description: "OpenAI's code generation benchmark", tags: ["Python", "Code Gen"], url: "https://github.com/openai/human-eval" },
  { id: "mbpp", name: "MBPP", description: "Mostly Basic Python Problems benchmark", tags: ["Python", "Beginner"], url: "https://github.com/google-research/google-research/tree/master/mbpp" },
  { id: "swebench", name: "SWE-bench Lite", description: "Real-world software engineering tasks", tags: ["Bug Fix", "Multi-file"], url: "https://www.swebench.com/" },
  { id: "codeforces", name: "Codeforces Problems", description: "Competitive programming challenges", tags: ["Algorithms", "Contest"], url: "https://codeforces.com/problemset" },
  { id: "leetcode", name: "LeetCode", description: "Coding interview practice platform", tags: ["Interview", "DSA"], url: "https://leetcode.com/problemset/" },
];

const AGENTS = [
  { id: "droid", name: "Droid", description: "#1 on Terminal-Bench; Factory AI's CLI coding agent", tags: ["CLI", "Terminal"], url: "https://docs.factory.ai/cli/getting-started/quickstart", github: "https://github.com/Factory-AI/factory" },
  { id: "kiro", name: "Kiro CLI", description: "AWS spec-driven AI development in terminal", tags: ["CLI", "AWS"], url: "https://kiro.dev/cli/", github: "https://github.com/kirodotdev/Kiro" },
  { id: "cline", name: "Cline CLI", description: "Open-source autonomous coding agent", tags: ["CLI", "Open Source"], url: "https://cline.bot/cline-cli", github: "https://github.com/cline/cline" },
  { id: "opencode", name: "OpenCode", description: "Go-based TUI/CLI AI coding assistant", tags: ["CLI", "TUI", "Go"], url: "https://opencode.ai/docs/cli/", github: "https://github.com/opencode-ai/opencode" },
  { id: "crush", name: "Crush", description: "Charmbracelet's glamorous terminal AI agent", tags: ["CLI", "TUI"], url: "https://github.com/charmbracelet/crush", github: "https://github.com/charmbracelet/crush" },
  { id: "openinterpreter", name: "Open Interpreter", description: "Natural language interface for computers", tags: ["CLI", "Python"], url: "https://github.com/openinterpreter/open-interpreter", github: "https://github.com/openinterpreter/open-interpreter" },
  { id: "aider", name: "Aider", description: "AI pair programming in your terminal", tags: ["CLI", "Git"], url: "https://aider.chat", github: "https://github.com/Aider-AI/aider" },
  { id: "copilot-cli", name: "GitHub Copilot CLI", description: "AI coding from the command line", tags: ["CLI", "GitHub"], url: "https://github.com/github/copilot-cli", github: "https://github.com/github/copilot-cli" },
  { id: "gemini-cli", name: "Gemini CLI", description: "Google's Gemini in your terminal", tags: ["CLI", "Google"], url: "https://github.com/google-gemini/gemini-cli", github: "https://github.com/google-gemini/gemini-cli" },
  { id: "grok-cli", name: "Grok CLI", description: "Superagent's Grok-powered terminal assistant", tags: ["CLI", "MCP"], url: "https://github.com/superagent-ai/grok-cli", github: "https://github.com/superagent-ai/grok-cli" },
  { id: "shellgpt", name: "ShellGPT", description: "ChatGPT command-line productivity tool", tags: ["CLI", "Shell"], url: "https://github.com/TheR1D/shell_gpt", github: "https://github.com/TheR1D/shell_gpt" },
  { id: "sgpt", name: "SGPT", description: "OpenAI models in your terminal", tags: ["CLI", "Go"], url: "https://github.com/tbckr/sgpt", github: "https://github.com/tbckr/sgpt" },
  { id: "sidekick", name: "Sidekick CLI", description: "Open-source agentic CLI developer", tags: ["CLI", "Agent"], url: "https://github.com/geekforbrains/sidekick-cli", github: "https://github.com/geekforbrains/sidekick-cli" },
  { id: "phidata", name: "Phidata", description: "Multi-modal agent framework", tags: ["CLI", "Agents"], url: "https://github.com/agno-agi/phidata", github: "https://github.com/agno-agi/phidata" },
  { id: "crewai", name: "CrewAI", description: "Role-playing autonomous AI agents", tags: ["CLI", "Multi-Agent"], url: "https://github.com/crewAIInc/crewAI", github: "https://github.com/crewAIInc/crewAI" },
  { id: "superagi", name: "SuperAGI", description: "Dev-first autonomous AI framework", tags: ["CLI", "Framework"], url: "https://github.com/TransformerOptimus/SuperAGI", github: "https://github.com/TransformerOptimus/SuperAGI" },
  { id: "autogpt", name: "AutoGPT", description: "Continuous autonomous AI agents", tags: ["CLI", "Autonomous"], url: "https://github.com/Significant-Gravitas/AutoGPT", github: "https://github.com/Significant-Gravitas/AutoGPT" },
  { id: "metagpt", name: "MetaGPT", description: "Multi-agent software company simulation", tags: ["CLI", "Multi-Agent"], url: "https://github.com/FoundationAgents/MetaGPT", github: "https://github.com/FoundationAgents/MetaGPT" },
  { id: "babyagi", name: "BabyAGI", description: "Self-improving AI agent prototype", tags: ["CLI", "Research"], url: "https://github.com/yoheinakajima/babyagi", github: "https://github.com/yoheinakajima/babyagi" },
  { id: "openhands", name: "OpenHands", description: "Formerly OpenDevin; autonomous software engineer", tags: ["CLI", "SWE"], url: "https://github.com/OpenDevin", github: "https://github.com/OpenDevin" },
  { id: "gpt-pilot", name: "GPT-Pilot", description: "Real AI developer from Pythagora", tags: ["CLI", "Full-Stack"], url: "https://github.com/Pythagora-io/gpt-pilot", github: "https://github.com/Pythagora-io/gpt-pilot" },
  { id: "opencodeinterpreter", name: "OpenCodeInterpreter", description: "Code generation with execution & refinement", tags: ["CLI", "Execution"], url: "https://github.com/OpenCodeInterpreter/OpenCodeInterpreter", github: "https://github.com/OpenCodeInterpreter/OpenCodeInterpreter" },
  { id: "termgpt-sentdex", name: "TermGPT (Sentdex)", description: "LLMs execute terminal commands", tags: ["CLI", "GPT-4"], url: "https://github.com/Sentdex/TermGPT", github: "https://github.com/Sentdex/TermGPT" },
  { id: "termgpt-tcapelle", name: "termGPT (tcapelle)", description: "ChatGPT wrapper for terminal", tags: ["CLI", "Python"], url: "https://github.com/tcapelle/termGPT", github: "https://github.com/tcapelle/termGPT" },
  { id: "terminalgpt", name: "TerminalGPT", description: "Terminal-based personal AI assistant", tags: ["CLI", "Assistant"], url: "https://github.com/adamyodinsky/TerminalGPT", github: "https://github.com/adamyodinsky/TerminalGPT" },
];

const SAAS = [
  { id: "cursor", name: "Cursor", description: "AI-first code editor built for productivity", tags: ["IDE", "Commercial"], url: "https://cursor.sh" },
  { id: "windsurf", name: "Windsurf", description: "Codeium's agentic IDE", tags: ["IDE", "Agent"], url: "https://codeium.com/windsurf" },
  { id: "replit", name: "Replit Agent", description: "Build apps from natural language", tags: ["Cloud", "No-Code"], url: "https://replit.com/ai" },
  { id: "amazonq", name: "Amazon Q Developer", description: "AWS AI assistant for developers", tags: ["CLI", "IDE", "AWS"], url: "https://aws.amazon.com/q/developer/" },
  { id: "copilot", name: "GitHub Copilot", description: "AI pair programmer from GitHub", tags: ["IDE", "GitHub"], url: "https://github.com/features/copilot" },
  { id: "perplexity-dev", name: "Perplexity Dev Assist", description: "AI-powered development assistant", tags: ["Assistant", "Search"], url: "https://www.perplexity.ai" },
];

export default function Models() {
  const [activeTab, setActiveTab] = useState<"models" | "benchmarks" | "agents" | "saas">("models");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Fetch live models from Hugging Face
  const { data: hfData, isLoading } = useQuery({
    queryKey: ["/api/huggingface/models", searchQuery],
    enabled: activeTab === "models",
    staleTime: 60000,
  });

  const hfModels = (hfData as any)?.models || [];

  // Filter function
  const filterItems = (items: any[]) => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(
      (item) =>
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.tags?.some((t: string) => t.toLowerCase().includes(q)) ||
        item.id?.toLowerCase().includes(q)
    );
  };

  const getActiveItems = () => {
    switch (activeTab) {
      case "models":
        return filterItems(hfModels || []);
      case "benchmarks":
        return filterItems(BENCHMARKS);
      case "agents":
        return filterItems(AGENTS);
      case "saas":
        return filterItems(SAAS);
      default:
        return [];
    }
  };

  const activeItems = getActiveItems();

  return (
    <Shell>
      <div className="h-full flex flex-col bg-background">
        {/* Header */}
        <div className="border-b border-border bg-card">
          <div className="container mx-auto p-6 space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Research</h1>
              <p className="text-sm text-muted-foreground">Explore AI models, benchmarks, agents, and tools</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name, tags, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-12 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="flex-1 flex flex-col">
          <div className="border-b border-border bg-card">
            <div className="container mx-auto">
              <TabsList className="h-12 bg-transparent border-0 rounded-none w-full justify-start">
                <TabsTrigger value="models" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Models</TabsTrigger>
                <TabsTrigger value="benchmarks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Benchmarks</TabsTrigger>
                <TabsTrigger value="agents" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">Agents</TabsTrigger>
                <TabsTrigger value="saas" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">SaaS</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="container mx-auto p-6">
              {/* Loading State */}
              {activeTab === "models" && isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-48 bg-card border border-border rounded-lg animate-pulse" />
                  ))}
                </div>
              )}

              {/* Cards Grid */}
              {!isLoading && activeItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {activeItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="group bg-card border border-border rounded-lg p-4 cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                          {item.name || item.id}
                        </h3>
                        {item.downloads && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Download className="h-3 w-3" />
                            {item.downloads > 1000 ? `${(item.downloads / 1000).toFixed(1)}k` : item.downloads}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {item.description || "No description available"}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {item.tags?.slice(0, 3).map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {!isLoading && activeItems.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Tabs>

        {/* Modal */}
        {selectedItem && (
          <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <div
              className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-card border-b border-border p-4 flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-1">{selectedItem.name || selectedItem.id}</h2>
                  <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-muted-foreground hover:text-foreground p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                <div className="space-y-2">
                  {selectedItem.url && (
                    <a
                      href={selectedItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Details
                    </a>
                  )}
                  {selectedItem.github && (
                    <a
                      href={selectedItem.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub Repository
                    </a>
                  )}
                </div>

                {/* Model-specific info */}
                {selectedItem.id && activeTab === "models" && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Model ID</h3>
                    <code className="text-xs bg-secondary px-2 py-1 rounded">{selectedItem.id}</code>
                  </div>
                )}

                {selectedItem.downloads && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Downloads</h3>
                    <p className="text-sm text-muted-foreground">{selectedItem.downloads.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
