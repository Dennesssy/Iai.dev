import { ALERTS, MODELS } from "@/lib/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Info, AlertTriangle } from "lucide-react";

export default function AlertsPanel() {
  const severityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const severityColor: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
    info: "bg-blue-100 text-blue-700",
  };

  return (
    <ScrollArea className="h-full">
      <div className="divide-y divide-border">
        {ALERTS.map((alert) => {
          const model = alert.modelId ? MODELS[alert.modelId] : null;

          return (
            <div key={alert.id} className="p-3 hover:bg-secondary/30 transition-colors border-b border-border/30">
              <div className="flex items-start gap-2.5 mb-2">
                {/* Icon */}
                <div className="mt-0.5 flex-shrink-0">{severityIcon(alert.severity)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-sm leading-tight">{alert.title}</h4>
                  </div>

                  <p className="text-xs text-muted-foreground mb-2">{alert.description}</p>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Badge
                        className={`text-xs capitalize border-0 ${severityColor[alert.severity]}`}
                      >
                        {alert.severity}
                      </Badge>
                      {model && (
                        <Badge
                          variant="outline"
                          className="text-xs"
                          style={{
                            borderColor: model.color,
                            color: model.color,
                          }}
                        >
                          {model.name}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {new Date(alert.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
