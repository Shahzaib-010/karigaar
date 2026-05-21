"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BellIcon, ChevronDownIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

const titleMap: Record<string, string> = {
  "": "Overview",
  "/jobs": "Jobs",
  "/services": "Services",
  "/profile": "Profile",
  "/earnings": "Earnings",
  "/reviews": "Reviews",
  "/settings": "Settings",
};

type WorkerDashboardTopbarProps = {
  locale: string;
};

export default function WorkerDashboardTopbar({
  locale,
}: WorkerDashboardTopbarProps) {
  const pathname = usePathname();
  const basePath = `/${locale}/dashboard`;
  const currentPath = pathname?.replace(basePath, "") ?? "";
  const title = titleMap[currentPath] ?? "Dashboard";

  return (
    <header className="flex h-16 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="md:hidden" />
      <div className="flex flex-col">
        <span className="text-xs text-muted-foreground">Worker dashboard</span>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>
      <div className="ml-auto hidden w-64 md:block">
        <Input placeholder="Search jobs, services" />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="hidden md:inline-flex">
          Post service
        </Button>
        <Button variant="ghost" size="icon-sm" aria-label="Notifications">
          <BellIcon />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <Avatar className="size-7">
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">Worker</span>
              <ChevronDownIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/profile`}>View profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`${basePath}/settings`}>Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
