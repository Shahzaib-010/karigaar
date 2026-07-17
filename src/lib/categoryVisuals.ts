// Real catalog categories carry no icon/colour, so we derive one: match the
// name against common trade keywords, falling back to a stable cycle by index.
// Shared by the landing hero, "browse" grid, and the services drill-down so a
// category always looks the same wherever it appears.
import {
  BrushIcon,
  HammerIcon,
  HomeIcon,
  LeafIcon,
  PaintRollerIcon,
  PlugIcon,
  ShowerHeadIcon,
  SparklesIcon,
  WindIcon,
  WrenchIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react";

const KEYWORD_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /plumb|pipe|water|tap|drain|sanitary|leak/i, icon: WrenchIcon },
  { match: /electric|wiring|switch|power|socket|fan/i, icon: ZapIcon },
  { match: /paint|putty|polish/i, icon: PaintRollerIcon },
  { match: /carpenter|wood|furniture|door|cabinet/i, icon: HammerIcon },
  { match: /\bac\b|air|cool|hvac|fridge|refriger|geyser|heater/i, icon: WindIcon },
  { match: /clean|wash|maid|sofa|carpet/i, icon: SparklesIcon },
  { match: /garden|lawn|plant|tree/i, icon: LeafIcon },
  { match: /mason|wall|tile|roof|construct|cement/i, icon: HomeIcon },
  { match: /appliance|machine|motor/i, icon: PlugIcon },
  { match: /bath|shower|geyser/i, icon: ShowerHeadIcon },
];

const FALLBACK_ICONS: LucideIcon[] = [
  WrenchIcon,
  ZapIcon,
  PaintRollerIcon,
  WindIcon,
  SparklesIcon,
  HammerIcon,
  LeafIcon,
  BrushIcon,
];

const CATEGORY_COLORS = [
  "#096C44",
  "#0EA5E9",
  "#8B5CF6",
  "#F59E0B",
  "#F43F5E",
  "#14B8A6",
  "#6366F1",
  "#0F766E",
];

export function categoryIcon(name: string, index = 0): LucideIcon {
  for (const { match, icon } of KEYWORD_ICONS) {
    if (match.test(name)) return icon;
  }
  return FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

export function categoryColor(index: number): string {
  return CATEGORY_COLORS[index % CATEGORY_COLORS.length];
}
