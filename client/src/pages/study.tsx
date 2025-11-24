import Shell from "@/components/layout/Shell";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, Terminal, Cpu, GraduationCap, TestTube, Download, Hammer } from "lucide-react";

export default function Study() {
  return (
    <Shell>
      <div className="h-full flex flex-col bg-background">
        <div className="border-b border-border p-4 bg-card">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Study Center
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Comprehensive guide to LLM benchmarks, testing methodologies, and model creation.
          </p>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Overview Section */}
            <section>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="bg-secondary/20 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-blue-500" /> Testing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Methodologies for evaluating model performance and safety.</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/20 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Hammer className="h-4 w-4 text-orange-500" /> Creating
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Fine-tuning and training custom models for specific domains.</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/20 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Download className="h-4 w-4 text-green-500" /> Installing
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Deployment guides for local and cloud-based agents.</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/20 border-none">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-purple-500" /> Models & Agents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Architecture deep dives and agentic frameworks.</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            <Tabs defaultValue="benchmarks" className="w-full">
              <TabsList className="w-full justify-start border-b border-border bg-transparent p-0 h-auto rounded-none">
                <TabsTrigger 
                  value="benchmarks" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Benchmarks Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="testing" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Testing & Evaluation
                </TabsTrigger>
                <TabsTrigger 
                  value="installing" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                >
                  Installation & Setup
                </TabsTrigger>
              </TabsList>

              {/* Benchmarks Content */}
              <TabsContent value="benchmarks" className="mt-6 space-y-6">
                
                {/* Knowledge / General */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Knowledge & General Intelligence
                    </CardTitle>
                    <CardDescription>Evaluates broad world knowledge and reasoning capabilities across diverse subjects.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-bold text-sm mb-1">MMLU-Pro</h4>
                      <p className="text-xs text-muted-foreground mb-2">12k questions, 14 subjects</p>
                      <p className="text-xs">The professional standard for measuring general knowledge and problem solving.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-bold text-sm mb-1">GPQA Diamond</h4>
                      <p className="text-xs text-muted-foreground mb-2">198 expert questions</p>
                      <p className="text-xs">Highly difficult questions written by domain experts (PhD level).</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-bold text-sm mb-1">ARC-C</h4>
                      <p className="text-xs text-muted-foreground mb-2">7,787 science questions</p>
                      <p className="text-xs">Focuses on reasoning and scientific knowledge (Challenge set).</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-bold text-sm mb-1">Humanity's Last Exam</h4>
                      <p className="text-xs text-muted-foreground mb-2">2,500 multi-subject</p>
                      <p className="text-xs">Designed to be the final test for AGI capabilities.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Code className="h-5 w-5 text-green-500" />
                      Code Generation & Engineering
                    </CardTitle>
                    <CardDescription>Assesses programming proficiency, debugging, and software engineering tasks.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div className="p-3 rounded border border-border/50">
                        <h4 className="font-semibold text-sm">HumanEval</h4>
                        <Badge variant="outline" className="mt-1 text-[10px]">Python</Badge>
                        <p className="text-xs text-muted-foreground mt-2">Standard Python code generation benchmark.</p>
                      </div>
                      <div className="p-3 rounded border border-border/50">
                        <h4 className="font-semibold text-sm">Aider Polyglot</h4>
                        <Badge variant="outline" className="mt-1 text-[10px]">Multi-lang</Badge>
                        <p className="text-xs text-muted-foreground mt-2">225 Exercism exercises across 6 languages.</p>
                      </div>
                      <div className="p-3 rounded border border-border/50">
                        <h4 className="font-semibold text-sm">LiveCodeBench</h4>
                        <Badge variant="outline" className="mt-1 text-[10px]">Live</Badge>
                        <p className="text-xs text-muted-foreground mt-2">Continuously updated coding problems to prevent data leakage.</p>
                      </div>
                      <div className="p-3 rounded border border-border/50">
                        <h4 className="font-semibold text-sm">Aider Code Editing</h4>
                        <p className="text-xs text-muted-foreground mt-2">133 Python exercises focusing on modifying existing code.</p>
                      </div>
                      <div className="p-3 rounded border border-border/50">
                        <h4 className="font-semibold text-sm">Aider Refactoring</h4>
                        <p className="text-xs text-muted-foreground mt-2">89 large Python methods requiring refactoring.</p>
                      </div>
                      <div className="p-3 rounded border border-border/50">
                        <h4 className="font-semibold text-sm">CanAiCode</h4>
                        <p className="text-xs text-muted-foreground mt-2">Practical coding tasks evaluating real-world utility.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Reasoning & Math */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Brain className="h-5 w-5 text-purple-500" />
                      Reasoning & Math
                    </CardTitle>
                    <CardDescription>Tests logical deduction, mathematical problem solving, and complex reasoning chains.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 sm:grid-cols-3">
                     <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-bold text-sm mb-1">GSM8K</h4>
                      <p className="text-xs text-muted-foreground">Grade school math problems. The baseline for reasoning.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-bold text-sm mb-1">MATH 500</h4>
                      <p className="text-xs text-muted-foreground">Competition-level mathematics problems.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30">
                      <h4 className="font-bold text-sm mb-1">AIME 2025</h4>
                      <p className="text-xs text-muted-foreground">Olympiad-level difficulty, 30 curated problems.</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Specialized & Instructions */}
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Instruction Following</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-3 rounded bg-secondary/20">
                        <h4 className="font-bold text-sm">IFEval</h4>
                        <p className="text-xs text-muted-foreground mt-1">500+ verifiable instructions to test adherence to constraints and formatting.</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Specialized & Agentic</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center border-b border-border/50 pb-2">
                        <span className="text-sm font-medium">SciCode</span>
                        <span className="text-xs text-muted-foreground">80 scientific research tasks</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-2">
                        <span className="text-sm font-medium">MuSR</span>
                        <span className="text-xs text-muted-foreground">Multi-step reasoning puzzles</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-2">
                        <span className="text-sm font-medium">Terminal-Bench</span>
                        <span className="text-xs text-muted-foreground">Agentic reasoning in CLI</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">τ²-Bench</span>
                        <span className="text-xs text-muted-foreground">Conversational agents</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Testing & Creating Content (Placeholder for now based on request) */}
              <TabsContent value="testing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Testing Frameworks & Methodologies</CardTitle>
                    <CardDescription>How to rigorously evaluate LLM agents and models.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid gap-4 md:grid-cols-2">
                       <div className="p-4 border rounded-lg">
                         <h3 className="font-bold mb-2 flex items-center gap-2"><Terminal className="h-4 w-4"/> LLM-as-a-Judge</h3>
                         <p className="text-sm text-muted-foreground">Using stronger models (like GPT-4) to evaluate responses from smaller models. Cost-effective and scalable.</p>
                       </div>
                       <div className="p-4 border rounded-lg">
                         <h3 className="font-bold mb-2 flex items-center gap-2"><Code className="h-4 w-4"/> Unit Testing Prompts</h3>
                         <p className="text-sm text-muted-foreground">Creating deterministic test cases for prompts using assertions (e.g., "output must be JSON", "must contain X").</p>
                       </div>
                     </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="installing" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Installation & Deployment</CardTitle>
                    <CardDescription>Getting started with local and cloud models.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-secondary/20 p-4 rounded-lg">
                        <h3 className="font-bold text-sm mb-2">Local Inference</h3>
                        <code className="block bg-black/80 text-white p-3 rounded text-xs font-mono mb-2">
                          pip install ollama<br/>
                          ollama run llama3
                        </code>
                        <p className="text-xs text-muted-foreground">Simplest way to run open weights models locally on Mac/Linux/Windows.</p>
                      </div>
                      
                      <div className="bg-secondary/20 p-4 rounded-lg">
                         <h3 className="font-bold text-sm mb-2">vLLM Server</h3>
                         <p className="text-xs text-muted-foreground mb-2">High-throughput serving engine for production.</p>
                         <code className="block bg-black/80 text-white p-3 rounded text-xs font-mono">
                           pip install vllm<br/>
                           python -m vllm.entrypoints.openai.api_server --model meta-llama/Llama-3-8b
                         </code>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </div>
    </Shell>
  );
}
