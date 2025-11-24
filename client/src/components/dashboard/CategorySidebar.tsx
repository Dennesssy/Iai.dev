import { useState } from "react";
import { ChevronDown, Grid2X2, Package, Bot, Building2, Code, Image, Video, Search, PenTool, Mic, Database, Microscope, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { MODELS, PROVIDERS, AGENT_CATEGORIES } from "@/lib/mockData";

interface CategorySidebarProps {
  comparisonMode?: boolean;
  onComparisonModeChange?: (enabled: boolean) => void;
}

export default function CategorySidebar({ comparisonMode = false, onComparisonModeChange }: CategorySidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    providers: true,
    models: true,
    agents: true,
  });
  
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleItem = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Build provider to models mapping
  const getModelsForProvider = (providerId: string) => {
    const provider = PROVIDERS[providerId];
    if (!provider) return [];
    return provider.endpoints.map(ep => MODELS[ep.modelId]).filter(Boolean);
  };

  // Build model to providers mapping
  const getProvidersForModel = (modelId: string) => {
    return Object.values(PROVIDERS).filter(provider =>
      provider.endpoints.some(ep => ep.modelId === modelId)
    );
  };

  const SectionHeader = ({ icon: Icon, title, section }: any) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors font-semibold text-sm"
    >
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </div>
      <ChevronDown
        className={`h-4 w-4 transition-transform ${expandedSections[section] ? '' : '-rotate-90'}`}
      />
    </button>
  );

  const ItemRow = ({ id, name, icon: Icon, onClick }: any) => (
    <button
      onClick={() => toggleItem(id)}
      className="w-full flex items-center justify-between px-6 py-2 text-xs hover:bg-secondary/30 transition-colors group"
    >
      <div className="flex items-center gap-2 min-w-0">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />}
        <span className="truncate text-foreground text-left">{name}</span>
      </div>
      <ChevronDown
        className={`h-3 w-3 transition-transform flex-shrink-0 ${expandedItems[id] ? '' : '-rotate-90'} text-muted-foreground group-hover:text-foreground`}
      />
    </button>
  );

  const NestedItem = ({ name, color, size = "small", description }: any) => (
    <div className="flex flex-col px-8 py-1.5 hover:bg-secondary/5 group/item">
      <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover/item:text-foreground">
        {color && (
          <div
            className={`rounded-full flex-shrink-0 ${size === "small" ? "w-2 h-2" : "w-2.5 h-2.5"}`}
            style={{ backgroundColor: color }}
          />
        )}
        <span className="truncate font-medium">{name}</span>
      </div>
      {description && (
        <span className="text-[10px] text-muted-foreground/60 truncate pl-4">{description}</span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full w-64 bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border space-y-3">
        <h2 className="font-bold text-lg tracking-tight">Navigator</h2>
        {/* Comparison Mode Toggle */}
        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/30 border border-border/50 hover:bg-secondary/40 transition-colors cursor-pointer">
          <Checkbox
            id="comparison-mode"
            checked={comparisonMode}
            onCheckedChange={(checked) => onComparisonModeChange?.(checked as boolean)}
            className="h-4 w-4"
            data-testid="toggle-comparison-mode"
          />
          <label
            htmlFor="comparison-mode"
            className="flex-1 text-xs font-semibold cursor-pointer select-none"
          >
            Comparison Mode
          </label>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {/* PROVIDERS SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={Building2} title="Providers" section="providers" />
            {expandedSections.providers && (
              <div className="bg-secondary/10">
                {Object.values(PROVIDERS).map((provider) => {
                  const itemId = `provider-${provider.id}`;
                  const models = getModelsForProvider(provider.id);
                  return (
                    <div key={provider.id}>
                      <ItemRow
                        id={itemId}
                        name={provider.name}
                        icon={Building2}
                      />
                      {expandedItems[itemId] && (
                        <div className="bg-secondary/5">
                          {models.map((model) => (
                            <NestedItem
                              key={model.id}
                              name={model.name}
                              color={model.color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* MODELS SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={Package} title="Models" section="models" />
            {expandedSections.models && (
              <div className="bg-secondary/10">
                {Object.values(MODELS).map((model) => {
                  const itemId = `model-${model.id}`;
                  const providers = getProvidersForModel(model.id);
                  return (
                    <div key={model.id}>
                      <ItemRow
                        id={itemId}
                        name={model.name}
                        icon={Package}
                      />
                      {expandedItems[itemId] && (
                        <div className="bg-secondary/5">
                          {providers.length > 0 ? (
                            providers.map((provider) => (
                              <NestedItem
                                key={provider.id}
                                name={provider.name}
                              />
                            ))
                          ) : (
                            <NestedItem name="No providers" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AGENTS SECTION */}
          <div className="border-b border-border/50">
            <SectionHeader icon={Bot} title="Agents" section="agents" />
            {expandedSections.agents && (
              <div className="bg-secondary/10">
                {AGENT_CATEGORIES.map((category) => {
                  const itemId = `agent-cat-${category.id}`;
                  return (
                    <div key={category.id}>
                      <ItemRow
                        id={itemId}
                        name={category.name}
                        icon={category.icon}
                      />
                      {expandedItems[itemId] && (
                        <div className="bg-secondary/5">
                          {category.agents.map((agent, idx) => (
                            <NestedItem
                              key={`${category.id}-${idx}`}
                              name={agent.name}
                              description={agent.description}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button className="w-full h-8 text-xs bg-primary/20 text-primary hover:bg-primary/30">
          Save View
        </Button>
        <Button variant="outline" className="w-full h-8 text-xs">
          Settings
        </Button>
      </div>
    </div>
  );
}
