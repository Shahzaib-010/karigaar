"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarClockIcon,
  ClipboardListIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  ShieldCheckIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePermissions } from "@/src/lib/permissions";

type NavItem = {
  title: string;
  icon: LucideIcon;
  href: string;
  show: (p: ReturnType<typeof usePermissions>) => boolean;
};

const NAV: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboardIcon, href: "/dashboard", show: () => true },
  {
    title: "Orders",
    icon: ClipboardListIcon,
    href: "/orders",
    show: (p) => p.can("order.view"),
  },
  {
    title: "Workers",
    icon: UsersIcon,
    href: "/workers",
    show: (p) => p.can("worker.view"),
  },
  {
    title: "Booking Slots",
    icon: CalendarClockIcon,
    href: "/slots",
    show: (p) => p.isAdmin,
  },
  {
    title: "Catalog",
    icon: LayoutGridIcon,
    href: "/catalog",
    show: (p) => p.can("category.view"),
  },
  {
    title: "Roles & Permissions",
    icon: ShieldCheckIcon,
    href: "/roles",
    show: (p) => p.can("role.view"),
  },
];

export default function AdminSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const perms = usePermissions();
  const basePath = `/${locale}/admin`;

  const isActive = (href: string) => {
    const target = `${basePath}${href}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  const items = NAV.filter((item) => item.show(perms));

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            K
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold">Karigaar</span>
            <span className="text-xs text-muted-foreground">
              {perms.isSuperadmin ? "Superadmin" : "Admin"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Manage</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                  >
                    <Link href={`${basePath}${item.href}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
