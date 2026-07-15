import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { InfoIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  icon?: LucideIcon;
  /** Optional tooltip text (e.g. the revenue-timing caveat). */
  hint?: string;
  className?: string;
}) {
  return (
    <Card className={cn("gap-0 py-4", className)}>
      <CardContent className="px-4">
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            {label}
            {hint ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label={hint}
                    className="text-muted-foreground/70 hover:text-foreground"
                  >
                    <InfoIcon className="size-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-56 text-xs">
                  {hint}
                </TooltipContent>
              </Tooltip>
            ) : null}
          </span>
          {Icon ? (
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
          ) : null}
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
