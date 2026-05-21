import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import WorkerDashboardSidebar from "@/src/components/dashboard/WorkerDashboardSidebar";
import WorkerDashboardTopbar from "@/src/components/dashboard/WorkerDashboardTopbar";

type DashboardLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  return (
    <SidebarProvider>
      <WorkerDashboardSidebar locale={locale} />
      <SidebarRail />
      <SidebarInset>
        <WorkerDashboardTopbar locale={locale} />
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
