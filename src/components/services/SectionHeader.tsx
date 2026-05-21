import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  icon?: LucideIcon;
  className?: string;
  id?: string;
};

export default function SectionHeader({
  title,
  icon: Icon,
  className,
  id,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {Icon ? <Icon className="size-5 text-[#1D9E75]" strokeWidth={2} aria-hidden /> : null}
      <h2 id={id} className="text-xl font-bold text-[#1A1A1A]">
        {title}
      </h2>
    </div>
  );
}
