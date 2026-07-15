"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export default function AdminTopbar({ locale }: { locale: string }) {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.replace(`/${locale}/login`);
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-5" />
      <span className="text-sm font-semibold">Admin</span>

      <div className="ms-auto flex items-center gap-3">
        {user ? (
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {user.name}
          </span>
        ) : null}
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOutIcon className="size-4" />
          <span className="hidden sm:inline">Sign out</span>
        </Button>
      </div>
    </header>
  );
}
