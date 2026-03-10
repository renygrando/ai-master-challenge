import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    Low: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    Medium: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
    High: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800",
    Critical: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800",
  };
  
  return (
    <Badge variant="outline" className={cn("font-medium no-default-hover-elevate no-default-active-elevate", styles[priority] || styles.Medium)} data-testid={`badge-priority-${priority?.toLowerCase()}`}>
      {priority}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Open: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800",
    "In Progress": "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900 dark:text-amber-300 dark:border-amber-800",
    Resolved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
    Closed: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
  
  return (
    <Badge variant="outline" className={cn("font-medium uppercase tracking-wide text-[10px] no-default-hover-elevate no-default-active-elevate", styles[status] || styles.Open)} data-testid={`badge-status-${status?.toLowerCase().replace(/\s+/g, '-')}`}>
      {status}
    </Badge>
  );
}
