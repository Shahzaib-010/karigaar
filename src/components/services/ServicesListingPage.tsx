"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Banknote,
  Clock,
  Search,
  SearchX,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import ServiceCard from "@/src/components/services/ServiceCard";
import SectionHeader from "@/src/components/services/SectionHeader";
import ServicesBreadcrumb from "@/src/components/services/ServicesBreadcrumb";
import {
  serviceCategories,
  servicesListing,
  TOTAL_SERVICES_COUNT,
  type ServiceCategoryFilter,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";

const whyChooseItems = [
  { icon: ShieldCheck, titleKey: "verified.title", bodyKey: "verified.body" },
  { icon: Banknote, titleKey: "pricing.title", bodyKey: "pricing.body" },
  { icon: Clock, titleKey: "booking.title", bodyKey: "booking.body" },
] as const;

export default function ServicesListingPage() {
  const t = useTranslations("servicesListing");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ServiceCategoryFilter>("all");

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return servicesListing.filter((service) => {
      const name = t(service.nameKey).toLowerCase();
      const description = t(service.descriptionKey).toLowerCase();
      const matchesCategory =
        activeCategory === "all" ||
        service.category.includes(activeCategory);

      if (!matchesCategory) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const matchesText =
        name.includes(normalizedQuery) ||
        description.includes(normalizedQuery) ||
        service.searchTerms.some((term) => term.includes(normalizedQuery)) ||
        service.slug.includes(normalizedQuery);

      return matchesText;
    });
  }, [activeCategory, query, t]);

  const popularServices = useMemo(
    () =>
      servicesListing.filter((service) => service.isPopular && service.available),
    []
  );

  const hasResults = filteredServices.length > 0;

  function clearFilters() {
    setQuery("");
    setActiveCategory("all");
  }

  return (
    <main className="flex-1 bg-[#F7F7F5] font-sans text-[#1A1A1A]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <ServicesBreadcrumb />

        <header className="mt-5">
          <h1 className="text-[32px] font-bold leading-tight text-[#1A1A1A]">
            {t("title")}
          </h1>
          <p className="mt-2 text-base text-[#6B6B6B]">{t("subtitle")}</p>
          <p className="mt-2 text-[13px] text-[#6B6B6B]">
            {t("count", { count: TOTAL_SERVICES_COUNT })}
          </p>
        </header>

        <div className="relative mt-6">
          <Search
            className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-[#6B6B6B]"
            aria-hidden
          />
          <Input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-12 rounded-[12px] border-[#E8E8E4] bg-white ps-12 text-sm text-[#1A1A1A] shadow-sm placeholder:text-[#6B6B6B] focus-visible:border-[#1D9E75] focus-visible:ring-[#1D9E75]/20"
            aria-label={t("searchAria")}
          />
        </div>

        <div
          className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          role="tablist"
          aria-label={t("categoriesAria")}
        >
          {serviceCategories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "shrink-0 rounded-[20px] border px-4 py-1.5 text-[13px] font-semibold transition-colors",
                  isActive
                    ? "border-[#1D9E75] bg-[#1D9E75] text-white"
                    : "border-[#E8E8E4] bg-white text-[#6B6B6B] hover:border-[#1D9E75]"
                )}
              >
                {t(`categories.${category}`)}
              </button>
            );
          })}
        </div>

        {hasResults ? (
          <section
            className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            aria-label={t("gridAria")}
          >
            {filteredServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </section>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center px-4 text-center">
            <SearchX className="size-11 text-[#6B6B6B]" strokeWidth={1.5} aria-hidden />
            <h2 className="mt-4 text-[17px] font-bold text-[#1A1A1A]">
              {t("empty.title")}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-[#6B6B6B]">
              {t("empty.subtitle")}
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-bold text-[#1D9E75] transition-opacity hover:opacity-80"
            >
              {t("empty.clear")}
            </button>
          </div>
        )}

        <section className="mt-14" aria-labelledby="popular-services-heading">
          <SectionHeader
            id="popular-services-heading"
            title={t("popularSection.title")}
            icon={TrendingUp}
            className="mb-5"
          />
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {popularServices.map((service) => (
              <ServiceCard
                key={`popular-${service.slug}`}
                service={service}
                isPopular
                className="w-[min(100%,280px)] shrink-0 sm:w-[280px]"
              />
            ))}
          </div>
        </section>

        <section
          className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3"
          aria-label={t("whyChoose.aria")}
        >
          {whyChooseItems.map((item) => {
            const Icon = item.icon;

            return (
              <article
                key={item.titleKey}
                className="rounded-[12px] border border-[#E8E8E4] bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex size-11 items-center justify-center rounded-full bg-[#E6F4EF]">
                  <Icon className="size-5 text-[#1D9E75]" strokeWidth={2} aria-hidden />
                </div>
                <h3 className="mt-4 text-[15px] font-bold text-[#1A1A1A]">
                  {t(`whyChoose.${item.titleKey}`)}
                </h3>
                <p className="mt-2 text-[13px] leading-5 text-[#6B6B6B]">
                  {t(`whyChoose.${item.bodyKey}`)}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
