import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider, SidebarRail } from "@/components/ui/sidebar";
import WorkerDashboardSidebar from "@/src/components/dashboard/WorkerDashboardSidebar";
import WorkerDashboardTopbar from "@/src/components/dashboard/WorkerDashboardTopbar";

type DashboardLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <WorkerDashboardSidebar locale={params.locale} />
      <SidebarRail />
      <SidebarInset>
        <WorkerDashboardTopbar locale={params.locale} />
        <div className="flex-1 p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
