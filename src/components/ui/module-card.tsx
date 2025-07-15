import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
  badge?: string;
}

export function ModuleCard({
  title,
  description,
  icon: Icon,
  onClick,
  className,
  disabled = false,
  badge
}: ModuleCardProps) {
  return (
    <Card 
      className={cn(
        "module-card relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {badge && (
                <span className="inline-block px-2 py-1 text-xs font-medium bg-accent/20 text-accent-foreground rounded-md mt-1">
                  {badge}
                </span>
              )}
            </div>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <Button 
          onClick={onClick}
          disabled={disabled}
          variant="outline"
          className="w-full interactive-hover"
        >
          Abrir Toolbox
        </Button>
      </CardContent>
    </Card>
  );
}