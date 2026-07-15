import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Covers order statuses (pending → assigned → in_progress → completed / cancelled)
// and worker statuses (available / busy / inactive).
const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  assigned: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300",
  in_progress:
    "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300",
  completed:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  cancelled: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300",
  available:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  busy: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  inactive: "bg-muted text-muted-foreground",
};

function labelFor(status: string) {
  return status
    .replace(/_/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const style = STATUS_STYLES[status] ?? "bg-muted text-muted-foreground";

  return (
    <Badge
      variant="outline"
      className={cn("border-transparent", style, className)}
    >
      {labelFor(status)}
    </Badge>
  );
}
