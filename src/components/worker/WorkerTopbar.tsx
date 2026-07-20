"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import WorkerNotificationsBell from "@/src/components/worker/WorkerNotificationsBell";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

export default function WorkerTopbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center gap-3 px-3 sm:px-4 lg:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">
            {user ? `Welcome, ${user.name.split(" ")[0]}` : "Worker portal"}
          </p>
          <p className="text-[11px] text-muted-foreground">Your assigned jobs</p>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <WorkerNotificationsBell />
          {user ? (
            <div className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition-colors hover:bg-muted">
              <Avatar className="size-8">
                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col leading-tight sm:flex">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-[11px] text-muted-foreground">Worker</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
