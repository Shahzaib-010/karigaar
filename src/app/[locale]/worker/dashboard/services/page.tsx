import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function WorkerDashboardServicesPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations("workerDashboard");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground">Services</h2>
        <p className="text-sm text-muted-foreground">
          Manage the services you offer to customers.
        </p>
      </div>

      <div className="rounded-[12px] border border-border bg-card p-6 shadow-sm">
        <div className="flex size-11 items-center justify-center rounded-full bg-accent">
          <Wrench className="size-5 text-primary" aria-hidden />
        </div>
        <h3 className="mt-4 text-lg font-bold text-foreground">
          {t("servicesBrowse")}
        </h3>
        <p className="mt-2 max-w-xl text-sm text-muted-foreground">
          {t("servicesBrowseDescription")}
        </p>
        <Button
          asChild
          className="mt-5 h-10 rounded-lg bg-primary px-4 text-sm font-bold hover:bg-primary-dark"
        >
          <Link href={`/${locale}/services`}>
            {t("servicesBrowse")}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
