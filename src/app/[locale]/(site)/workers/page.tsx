"use client";

import React, { useEffect, useReducer, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

type WorkerListItem = {
  id: string;
  name: string;
  photo: string | null;
  trade: string;
  skills: string[];
  city: string;
  area: string;
  rating: number;
  totalJobs: number;
  experienceYears: number;
  startingPrice: number;
  isVerified: boolean;
  isAvailable: boolean;
  avgResponseMinutes: number;
};

type FilterState = {
  categories: string[];
  city: string;
  sortBy: "top_rated" | "most_jobs" | "price_asc" | "price_desc" | "nearest";
  minRating: number | null;
  availableOnly: boolean;
  page: number;
};

const initialState: FilterState = {
  categories: ["all"],
  city: "all",
  sortBy: "top_rated",
  minRating: null,
  availableOnly: false,
  page: 1,
};

function reducer(state: FilterState, action: any): FilterState {
  switch (action.type) {
    case "set":
      return { ...state, ...action.payload };
    case "toggleCategory": {
      const cat = action.payload;
      if (cat === "all") return { ...state, categories: ["all"], page: 1 };
      const set = new Set(state.categories.filter((c) => c !== "all"));
      if (set.has(cat)) set.delete(cat);
      else set.add(cat);
      const categories = set.size ? Array.from(set) : ["all"];
      return { ...state, categories, page: 1 };
    }
    case "clear":
      return { ...initialState };
    default:
      return state;
  }
}

const CATEGORIES = [
  "All",
  "Plumber",
  "Electrician",
  "Carpenter",
  "Painter",
  "AC Repair",
  "Mason",
  "Welder",
  "Cleaning",
  "Geyser",
  "Tile Work",
  "Gate & Grill",
];
const CITIES = [
  "All Cities",
  "Lahore",
  "Karachi",
  "Islamabad",
  "Rawalpindi",
  "Faisalabad",
  "Multan",
  "Gujranwala",
  "Peshawar",
  "Quetta",
];

export default function WorkersPage() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workers, setWorkers] = useState<WorkerListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(Array.from(searchParams.entries()));
    const categories = searchParams.getAll("category");
    dispatch({
      type: "set",
      payload: {
        categories: categories.length ? categories : ["all"],
        city: params.city || "all",
        sortBy: (params.sort as any) || "top_rated",
        minRating: params.rating ? Number(params.rating) : null,
        availableOnly: params.availableOnly === "1",
        page: params.page ? Number(params.page) : 1,
      },
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    const activeCategories = state.categories.filter((c) => c !== "all");
    activeCategories.forEach((c) => params.append("category", c.toLowerCase()));
    if (state.city && state.city !== "all") {
      params.set("city", state.city.toLowerCase());
    }
    if (state.sortBy && state.sortBy !== "top_rated") {
      params.set("sort", state.sortBy);
    }
    if (state.minRating) params.set("rating", String(state.minRating));
    if (state.availableOnly) params.set("availableOnly", "1");
    if (state.page > 1) params.set("page", String(state.page));
    const url = `${pathname}?${params.toString()}`;
    const currentParams = searchParams.toString();
    const nextParams = params.toString();
    if (currentParams !== nextParams) {
      router.replace(url);
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/workers?${params.toString()}`);
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        setWorkers(json.data);
        setTotal(json.total);
      } catch (e: any) {
        setError(e.message || "error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [
    state.page,
    state.categories,
    state.city,
    state.sortBy,
    state.minRating,
    state.availableOnly,
  ]);

  function toggleCategory(cat: string) {
    dispatch({ type: "toggleCategory", payload: cat.toLowerCase() });
  }

  function clearAll() {
    dispatch({ type: "clear" });
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#F7F7F5] p-4 sm:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 h-5 w-40 rounded border border-[#E8E8E4] bg-white" />
          <div className="h-8 w-64 rounded border border-[#E8E8E4] bg-white" />
          <div className="mt-3 h-4 w-96 rounded border border-[#E8E8E4] bg-white" />
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-40 animate-pulse rounded-[12px] border border-[#E8E8E4] bg-white p-4"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <nav className="mb-4 text-sm text-[#6B6B6B]">
          {t("nav.home")} → {t("workers.browse")}
        </nav>
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[#1A1A1A]">
            {t("workers.title")}
          </h1>
          <p className="mt-2 text-base text-[#6B6B6B]">
            {t("workers.subtitle")}
          </p>
          <div className="mt-2 text-sm text-[#6B6B6B]">
            {t("workers.showing", { count: total })}
          </div>
        </header>

        <section className="bg-transparent">
          <div className="overflow-x-auto pb-2">
            <div className="flex items-center gap-3">
              {CATEGORIES.map((c) => {
                const active = state.categories.includes(c.toLowerCase());
                return (
                  <button
                    key={c}
                    onClick={() => toggleCategory(c)}
                    className={`whitespace-nowrap rounded-[20px] px-4 py-1.5 text-sm ${
                      active
                        ? "bg-[#1D9E75] text-white border-none"
                        : "bg-white text-[#6B6B6B] border border-[#E8E8E4] hover:border-[#1D9E75]"
                    }`}
                  >
                    {t(`categories.${c.replace(/\s+/g, "_").toLowerCase()}`)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <select
                value={state.city}
                onChange={(e) =>
                  dispatch({
                    type: "set",
                    payload: { city: e.target.value, page: 1 },
                  })
                }
                className="h-10 rounded-md border border-[#E8E8E4] bg-white px-3 text-sm"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c.toLowerCase()}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={state.sortBy}
                onChange={(e) =>
                  dispatch({
                    type: "set",
                    payload: { sortBy: e.target.value as any, page: 1 },
                  })
                }
                className="h-10 rounded-md border border-[#E8E8E4] bg-white px-3 text-sm"
              >
                <option value="top_rated">{t("sort.top_rated")}</option>
                <option value="most_jobs">{t("sort.most_jobs")}</option>
                <option value="nearest">{t("sort.nearest")}</option>
                <option value="price_asc">{t("sort.price_asc")}</option>
                <option value="price_desc">{t("sort.price_desc")}</option>
              </select>
              {/* <button
                onClick={() =>
                  dispatch({ type: "set", payload: { minRating: 4, page: 1 } })
                }
                className={`h-10 rounded-md border px-3 ${
                  state.minRating === 4
                    ? "bg-[#1D9E75] text-white border-none"
                    : "border-[#E8E8E4] text-[#6B6B6B]"
                }`}
              >
                4★ & above
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "set",
                    payload: { availableOnly: !state.availableOnly, page: 1 },
                  })
                }
                className={`h-10 rounded-md border px-3 ${
                  state.availableOnly
                    ? "bg-[#1D9E75] text-white border-none"
                    : "border-[#E8E8E4] text-[#6B6B6B]"
                }`}
              >
                {t("filters.available")}
              </button> */}
            </div>
            <div className="text-sm text-[#6B6B6B]">
              {total} {t("workers.found")}
            </div>
          </div>
        </section>

        <main className="pt-6">
          {loading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-40 animate-pulse rounded-[12px] border border-[#E8E8E4] bg-white p-4"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {workers.map((worker) => (
                <article
                  key={worker.id}
                  className="rounded-[14px] border border-[#E8E8E4] bg-white p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative size-14 overflow-hidden rounded-full bg-[#F2F2EE]">
                      {worker.photo ? (
                        <Image
                          src={worker.photo}
                          alt={worker.name}
                          fill
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-semibold text-[#1A1A1A]">
                          {worker.name}
                        </h3>
                        {worker.isVerified && (
                          <span className="rounded-full bg-[#E6F4EF] px-2 py-0.5 text-xs font-medium text-[#1D9E75]">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[#6B6B6B]">
                        {worker.trade} • {worker.city}
                      </p>
                      <p className="text-xs text-[#6B6B6B]">
                        {worker.experienceYears}+ yrs experience
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-[#1A1A1A]">
                        {worker.rating.toFixed(1)}★
                      </div>
                      <div className="text-xs text-[#6B6B6B]">
                        {worker.totalJobs} jobs
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {worker.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[#E8E8E4] px-2 py-0.5 text-xs text-[#6B6B6B]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-[#6B6B6B]">Starting</div>
                      <div className="text-sm font-semibold text-[#1A1A1A]">
                        PKR {worker.startingPrice}
                      </div>
                    </div>
                    <button
                      className="rounded-full bg-[#1D9E75] px-4 py-1.5 text-sm font-medium text-white"
                      onClick={() => router.push(`${pathname}/${worker.id}`)}
                    >
                      View profile
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && !error && workers.length === 0 ? (
            <div className="rounded-[12px] border border-[#E8E8E4] bg-white p-6 text-center text-sm text-[#6B6B6B]">
              {t("workers.empty")}
            </div>
          ) : null}

          {error ? (
            <div className="rounded-[12px] border border-[#E8E8E4] bg-white p-6 text-center text-sm text-red-500">
              {error}
            </div>
          ) : null}

          {workers.length > 0 ? (
            <div className="mt-6 flex justify-center gap-2">
              <button
                onClick={() =>
                  dispatch({
                    type: "set",
                    payload: { page: Math.max(1, state.page - 1) },
                  })
                }
                className="rounded-md border border-[#E8E8E4] px-3 py-1.5 text-sm"
                disabled={state.page === 1}
              >
                Prev
              </button>
              <button
                onClick={() =>
                  dispatch({
                    type: "set",
                    payload: { page: state.page + 1 },
                  })
                }
                className="rounded-md border border-[#E8E8E4] px-3 py-1.5 text-sm"
                disabled={workers.length < 10}
              >
                Next
              </button>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
