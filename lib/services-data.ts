import type { LucideIcon } from "lucide-react";
import {
  Flame,
  Hammer,
  HardHat,
  Paintbrush,
  Sparkles,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";

import { getServiceBySlug, serviceCardLinks } from "@/src/data/services";

export interface Service {
  slug: string;
  nameKey: string;
  descriptionKey: string;
  category: string[];
  searchTerms: string[];
  startingPrice: number;
  rating: number;
  totalReviews: number;
  availableWorkers: number;
  isPopular: boolean;
  /** Matches homepage Browse by Trade — links to detail page only when true */
  available: boolean;
}

export const serviceIcons: Record<string, LucideIcon> = {
  plumber: Wrench,
  electrician: Zap,
  carpenter: Hammer,
  painter: Paintbrush,
  "ac-repair": Wind,
  mason: HardHat,
  welder: Flame,
  cleaning: Sparkles,
};

const listingMeta: Record<
  string,
  Omit<Service, "slug" | "nameKey" | "descriptionKey" | "available">
> = {
  plumber: {
    category: ["plumbing", "repair"],
    searchTerms: ["plumber", "plumbing", "pipe", "leak", "tap", "bathroom"],
    startingPrice: 300,
    rating: 4.7,
    totalReviews: 1840,
    availableWorkers: 24,
    isPopular: true,
  },
  electrician: {
    category: ["electrical", "repair", "installation"],
    searchTerms: ["electrician", "electrical", "wiring", "switch", "fan", "power"],
    startingPrice: 300,
    rating: 4.8,
    totalReviews: 2105,
    availableWorkers: 31,
    isPopular: true,
  },
  carpenter: {
    category: ["carpentry", "repair", "installation"],
    searchTerms: ["carpenter", "carpentry", "furniture", "door", "wardrobe"],
    startingPrice: 500,
    rating: 4.6,
    totalReviews: 920,
    availableWorkers: 18,
    isPopular: false,
  },
  painter: {
    category: ["painting", "repair"],
    searchTerms: ["painter", "painting", "wall", "putty", "polish"],
    startingPrice: 800,
    rating: 4.5,
    totalReviews: 740,
    availableWorkers: 15,
    isPopular: false,
  },
  "ac-repair": {
    category: ["appliances", "repair", "installation"],
    searchTerms: ["ac", "air conditioner", "cooling", "gas refill", "hvac"],
    startingPrice: 400,
    rating: 4.7,
    totalReviews: 1560,
    availableWorkers: 22,
    isPopular: true,
  },
  mason: {
    category: ["repair", "installation"],
    searchTerms: ["mason", "masonry", "wall", "roof", "tile"],
    startingPrice: 1000,
    rating: 4.4,
    totalReviews: 510,
    availableWorkers: 12,
    isPopular: false,
  },
  welder: {
    category: ["repair", "installation"],
    searchTerms: ["welder", "welding", "grill", "gate", "iron"],
    startingPrice: 600,
    rating: 4.5,
    totalReviews: 430,
    availableWorkers: 9,
    isPopular: false,
  },
  cleaning: {
    category: ["cleaning"],
    searchTerms: ["cleaning", "deep clean", "sofa", "carpet", "home clean"],
    startingPrice: 1500,
    rating: 4.6,
    totalReviews: 980,
    availableWorkers: 20,
    isPopular: false,
  },
};

const nameKeys: Record<string, string> = {
  plumber: "plumber.name",
  electrician: "electrician.name",
  carpenter: "carpenter.name",
  painter: "painter.name",
  "ac-repair": "acRepair.name",
  mason: "mason.name",
  welder: "welder.name",
  cleaning: "cleaning.name",
};

const descriptionKeys: Record<string, string> = {
  plumber: "plumber.description",
  electrician: "electrician.description",
  carpenter: "carpenter.description",
  painter: "painter.description",
  "ac-repair": "acRepair.description",
  mason: "mason.description",
  welder: "welder.description",
  cleaning: "cleaning.description",
};

/** Same services as homepage Browse by Trade — detail page only when profile exists */
export const servicesListing: Service[] = serviceCardLinks.map((link) => {
  const meta = listingMeta[link.slug];
  const hasDetailPage = Boolean(getServiceBySlug(link.slug));

  return {
    slug: link.slug,
    nameKey: nameKeys[link.slug],
    descriptionKey: descriptionKeys[link.slug],
    available: link.available && hasDetailPage,
    ...meta,
  };
});

export const serviceCategories = [
  "all",
  "repair",
  "installation",
  "cleaning",
  "electrical",
  "plumbing",
  "carpentry",
  "painting",
  "appliances",
] as const;

export type ServiceCategoryFilter = (typeof serviceCategories)[number];

export const TOTAL_SERVICES_COUNT = servicesListing.length;

export function isServiceDetailAvailable(slug: string) {
  const link = serviceCardLinks.find((item) => item.slug === slug);
  return Boolean(link?.available && getServiceBySlug(slug));
}
