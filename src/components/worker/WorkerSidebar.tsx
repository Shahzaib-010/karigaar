"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ClipboardListIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

type NavItem = { title: string; icon: LucideIcon; href: string };

const NAV: NavItem[] = [
  { title: "Dashboard", icon: LayoutDashboardIcon, href: "/dashboard" },
  { title: "My jobs", icon: ClipboardListIcon, href: "/jobs" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function WorkerSidebar({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const basePath = `/${locale}/worker`;

  const isActive = (href: string) => {
    const target = `${basePath}${href}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  function handleLogout() {
    logout();
    router.replace(`/${locale}/login`);
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">
              K
            </div>
            <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate text-sm font-semibold tracking-tight">Karigaar</span>
              <span className="truncate text-[11px] text-muted-foreground">Worker portal</span>
            </div>
          </div>
          <SidebarTrigger className="shrink-0" />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-1">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/70">
            Work
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.title}
                      className={cn(
                        "relative h-9 rounded-lg font-medium transition-colors",
                        active &&
                          "before:absolute before:left-0 before:top-1/2 before:h-4 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-primary",
                      )}
                    >
                      <Link href={`${basePath}${item.href}`}>
                        <item.icon className={cn(active && "text-primary")} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t border-sidebar-border p-2">
        <div className="space-y-1">
          {user ? (
            <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <Avatar className="size-8 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate text-sm font-medium text-sidebar-foreground">
                  {user.name}
                </span>
                <span className="truncate text-[11px] text-muted-foreground">Worker</span>
              </div>
            </div>
          ) : null}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
          >
            <LogOutIcon className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
