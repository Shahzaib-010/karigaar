import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type StarRatingProps = {
  rating: number;
  max?: number;
  className?: string;
  starClassName?: string;
};

export default function StarRating({
  rating,
  max = 5,
  className,
  starClassName = "size-4",
}: StarRatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: max }, (_, index) => {
        const filled = index < Math.round(rating);

        return (
          <Star
            key={index}
            className={cn(
              starClassName,
              filled
                ? "fill-[#F59E0B] text-[#F59E0B]"
                : "fill-transparent text-slate-300"
            )}
            strokeWidth={filled ? 0 : 1.5}
          />
        );
      })}
    </div>
  );
}
