import { notFound } from "next/navigation";
import WorkerProfilePage from "@/src/components/worker/WorkerProfilePage";
import {
  featuredWorkers,
  getWorkerBySlug,
  workerProfiles,
} from "@/src/data/workers";

export function generateStaticParams() {
  return workerProfiles.map((worker) => ({ slug: worker.slug }));
}

export default async function WorkerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const worker = getWorkerBySlug(slug);

  if (!worker) {
    notFound();
  }

  const similarWorkers = featuredWorkers.filter(
    (similarWorker) => similarWorker.slug !== worker.slug,
  );

  return (
    <WorkerProfilePage
      locale={locale}
      worker={worker}
      similarWorkers={similarWorkers}
    />
  );
}
