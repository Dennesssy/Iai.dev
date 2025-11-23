import { useState } from "react";
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LayoutGrid, 
  LineChart, 
  MessageSquare, 
  Database, 
  Menu 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLocation } from "wouter";
import logo from "@assets/generated_images/a_sleek,_modern,_abstract_logo_for_an_ai_analytics_platform_called_llmview.png";

export default function Shell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();

  const navItems = [
    { label: "Charts", path: "/", icon: LineChart },
    { label: "Compare", path: "/comparison", icon: LayoutGrid },
    { label: "Community", path: "/community", icon: MessageSquare },
    { label: "Models", path: "/models", icon: Database },
  ];

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-card p-0">
              <div className="flex flex-col h-full">
                <div className="h-14 flex items-center px-4 border-b border-border">
                  <span className="font-bold text-lg tracking-tight">LLMView</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                  {navItems.map(({ label, path, icon: Icon }) => (
                    <button
                      key={path}
                      onClick={() => {
                        setLocation(path);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                        location === path
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>

          <button 
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={logo} alt="LLMView Logo" className="h-8 w-8 rounded" />
            <span className="hidden md:block font-bold text-xl tracking-tight">LLMView</span>
          </button>

          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map(({ label, path }) => (
              <button
                key={path}
                onClick={() => setLocation(path)}
                className={`px-3 py-1 rounded-md transition-colors text-sm ${
                  location === path
                    ? "text-foreground bg-secondary/50"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end max-w-xl ml-4">
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search models, benchmarks, users..." 
              className="pl-9 h-9 bg-secondary/50 border-transparent focus-visible:bg-background focus-visible:border-primary"
            />
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <User className="h-5 w-5" />
            </Button>
            <Button className="hidden md:flex ml-2 bg-primary text-primary-foreground hover:bg-primary/90 h-8">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
}
