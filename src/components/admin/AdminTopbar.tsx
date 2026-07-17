"use client";

import { SearchIcon } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { usePermissions } from "@/src/lib/permissions";
import AdminNotificationsBell from "@/src/components/admin/AdminNotificationsBell";

export default function AdminTopbar() {
  const { user } = useAuth();
  const perms = usePermissions();

  const initials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "?";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-4 lg:px-6">
        <SidebarTrigger className="md:hidden" />

        <label className="relative hidden w-full max-w-sm sm:block">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue=""
            readOnly
            placeholder="Search orders, workers, users…"
            className="h-9 rounded-full border-border/70 bg-muted/40 pl-9 shadow-none"
          />
        </label>

        <div className="ml-auto flex items-center gap-1.5">
          <AdminNotificationsBell />

          {user ? (
            <div className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-[11px] text-muted-foreground">
                  {perms.isSuperadmin ? "Superadmin" : "Admin"}
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
