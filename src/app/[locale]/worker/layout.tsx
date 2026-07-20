import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import WorkerGuard from "@/src/components/worker/WorkerGuard";
import WorkerSidebar from "@/src/components/worker/WorkerSidebar";
import WorkerTopbar from "@/src/components/worker/WorkerTopbar";

export default async function WorkerLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <WorkerGuard locale={locale}>
      <SidebarProvider>
        <WorkerSidebar locale={locale} />
        <SidebarInset>
          <WorkerTopbar />
          <div className="flex-1">{children}</div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-right" richColors />
    </WorkerGuard>
  );
}
