"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { serviceIcons, type Service } from "@/lib/services-data";
import { cn } from "@/lib/utils";

type ServiceCardProps = {
  service: Service;
  isPopular?: boolean;
  className?: string;
};

export default function ServiceCard({
  service,
  isPopular = service.isPopular,
  className,
}: ServiceCardProps) {
  const locale = useLocale();
  const t = useTranslations("servicesListing");
  const Icon = serviceIcons[service.slug];

  const cardBody = (
    <Card
      className={cn(
        "relative h-full gap-0 rounded-[12px] border border-[#E8E8E4] bg-white py-0 shadow-sm transition-all",
        service.available
          ? "hover:border-[#1D9E75] hover:shadow-md"
          : "opacity-95"
      )}
    >
      {isPopular && service.available ? (
        <Badge
          className="absolute end-3 top-3 z-10 rounded-full bg-[#1D9E75] px-2.5 py-0.5 text-[11px] font-bold text-white"
        >
          {t("popular")}
        </Badge>
      ) : null}

      {!service.available ? (
        <Badge
          variant="outline"
          className="absolute end-3 top-3 z-10 rounded-full border-[#E8E8E4] bg-[#F7F7F5] px-2.5 py-0.5 text-[11px] font-bold text-[#6B6B6B]"
        >
          {t("comingSoon")}
        </Badge>
      ) : null}

      <CardContent className="flex h-full flex-col px-5 pb-5 pt-6">
        <div
          className={cn(
            "mx-auto flex size-14 items-center justify-center rounded-full",
            service.available ? "bg-[#E6F4EF]" : "bg-[#F2F2EE] grayscale"
          )}
        >
          {Icon ? (
            <Icon
              className={cn(
                "size-6",
                service.available ? "text-[#1D9E75]" : "text-[#6B6B6B]"
              )}
              strokeWidth={2}
              aria-hidden
            />
          ) : null}
        </div>

        <h3
          className={cn(
            "mt-4 text-center text-[17px] font-bold leading-snug",
            service.available ? "text-[#1A1A1A]" : "text-[#6B6B6B]"
          )}
        >
          {t(service.nameKey)}
        </h3>

        <p className="mt-2 line-clamp-2 text-center text-[13px] leading-5 text-[#6B6B6B]">
          {t(service.descriptionKey)}
        </p>

        <Separator className="my-4 bg-[#E8E8E4]" />

        <p
          className={cn(
            "text-center text-sm font-bold",
            service.available ? "text-[#1D9E75]" : "text-[#6B6B6B]"
          )}
        >
          {t("fromPrice", { price: service.startingPrice })}
        </p>

        <div className="mt-2 flex items-center justify-center gap-1.5">
          <Star
            className="size-3.5 fill-[#F59E0B] text-[#F59E0B]"
            aria-hidden
          />
          <span className="text-xs font-semibold text-[#1A1A1A]">
            {service.rating.toFixed(1)}
          </span>
          <span className="text-xs text-[#6B6B6B]">
            {t("reviews", {
              count: service.totalReviews.toLocaleString(locale),
            })}
          </span>
        </div>

        <p className="mt-1 text-center text-xs text-[#6B6B6B]">
          {t("workersAvailable", { count: service.availableWorkers })}
        </p>

        <span
          className={cn(
            "mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-bold",
            service.available
              ? "bg-[#1D9E75] text-white transition-colors group-hover:bg-[#0F6E56]"
              : "border border-[#E8E8E4] bg-[#F7F7F5] text-[#6B6B6B]"
          )}
        >
          {service.available ? t("bookNow") : t("comingSoon")}
        </span>
      </CardContent>
    </Card>
  );

  if (!service.available) {
    return (
      <article className={cn("block h-full cursor-default", className)}>
        {cardBody}
      </article>
    );
  }

  return (
    <Link
      href={`/${locale}/services/${service.slug}`}
      className={cn("group block h-full", className)}
    >
      {cardBody}
    </Link>
  );
}
