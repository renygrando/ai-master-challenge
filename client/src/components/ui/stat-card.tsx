import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}

export function StatCard({ title, value, description, icon: Icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("relative group hover-elevate transition-all duration-500 border-border/50 bg-card", className)}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1" data-testid={`text-stat-label-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {title}
            </p>
            <h3 className="text-3xl font-display font-bold text-foreground" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </h3>
            
            {(description || trend) && (
              <div className="mt-2 flex items-center gap-2 text-sm flex-wrap">
                {trend && (
                  <span className={cn(
                    "font-medium px-2 py-0.5 rounded-md",
                    trend.isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300" : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  )} data-testid={`text-stat-trend-${title.toLowerCase().replace(/\s+/g, '-')}`}>
                    {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                  </span>
                )}
                {description && (
                  <span className="text-muted-foreground">{description}</span>
                )}
              </div>
            )}
          </div>
          <div className="p-3 rounded-md bg-primary/5 text-primary group-hover:bg-secondary/10 group-hover:text-secondary transition-colors dark:bg-primary/10">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
