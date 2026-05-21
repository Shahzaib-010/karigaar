"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BriefcaseIcon,
  HomeIcon,
  SettingsIcon,
  StarIcon,
  UserCircleIcon,
  WalletIcon,
  WrenchIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const mainNav = [
  { title: "Overview", icon: HomeIcon, href: "" },
  { title: "Jobs", icon: BriefcaseIcon, href: "/jobs" },
  { title: "Services", icon: WrenchIcon, href: "/services" },
  { title: "Earnings", icon: WalletIcon, href: "/earnings" },
  { title: "Reviews", icon: StarIcon, href: "/reviews" },
];

const accountNav = [
  { title: "Profile", icon: UserCircleIcon, href: "/profile" },
  { title: "Settings", icon: SettingsIcon, href: "/settings" },
];

type WorkerDashboardSidebarProps = {
  locale: string;
};

export default function WorkerDashboardSidebar({
  locale,
}: WorkerDashboardSidebarProps) {
  const pathname = usePathname();
  const basePath = `/${locale}/dashboard`;

  const isActive = (href: string) => {
    const target = `${basePath}${href}`;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
            K
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold">Karigaar</span>
            <span className="text-xs text-muted-foreground">Worker</span>
          </div>
        </div>
        <SidebarInput placeholder="Search dashboard" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
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
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNav.map((item) => (
                <SidebarMenuItem key={item.title}>
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
      <SidebarFooter>
        <Button variant="ghost" className="justify-start">
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
