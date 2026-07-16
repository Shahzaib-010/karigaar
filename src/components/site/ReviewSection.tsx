"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon, StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useCreateReviewMutation,
  useGetMyReviewsQuery,
} from "@/src/store/clientApi";

function errMessage(e: unknown): string {
  if (
    e &&
    typeof e === "object" &&
    "message" in e &&
    typeof (e as { message: unknown }).message === "string"
  ) {
    return (e as { message: string }).message;
  }
  return "Could not submit your review.";
}

function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={cn(!onChange && "cursor-default")}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
        >
          <StarIcon
            className={cn(
              "size-6",
              n <= value
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300",
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ orderId }: { orderId: number }) {
  const { data: reviews, isLoading } = useGetMyReviewsQuery();
  const [createReview, { isLoading: submitting }] = useCreateReviewMutation();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (isLoading) return null;

  const existing = (reviews ?? []).find(
    (r) => r.order_id === orderId || r.order?.id === orderId,
  );

  async function handleSubmit() {
    if (rating < 1) return;
    try {
      await createReview({
        order_id: orderId,
        rating,
        comment: comment.trim() || undefined,
      }).unwrap();
      toast.success("Thanks for your review!");
    } catch (e) {
      toast.error(errMessage(e));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          {existing ? "Your review" : "Rate this service"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {existing ? (
          <>
            <Stars value={existing.rating} />
            {existing.comment ? (
              <p className="text-sm text-slate-700">{existing.comment}</p>
            ) : null}
          </>
        ) : (
          <>
            <Stars value={rating} onChange={setRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="How was the service? (optional)"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/40"
            />
            <Button disabled={rating < 1 || submitting} onClick={handleSubmit}>
              {submitting ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              Submit review
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
