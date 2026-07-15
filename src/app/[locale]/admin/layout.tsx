import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import AdminGuard from "@/src/components/admin/AdminGuard";
import AdminSidebar from "@/src/components/admin/AdminSidebar";
import AdminTopbar from "@/src/components/admin/AdminTopbar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <AdminGuard locale={locale}>
      <SidebarProvider>
        <AdminSidebar locale={locale} />
        <SidebarRail />
        <SidebarInset>
          <AdminTopbar locale={locale} />
          <div className="flex-1 p-4 sm:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" richColors />
    </AdminGuard>
  );
}
