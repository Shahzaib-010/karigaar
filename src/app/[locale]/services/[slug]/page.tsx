import { notFound } from "next/navigation";
import ServiceDetailPage from "@/src/components/services/ServiceDetailPage";
import { getServiceBySlug, serviceProfiles } from "@/src/data/services";

export function generateStaticParams() {
  return serviceProfiles.map((service) => ({ slug: service.slug }));
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return <ServiceDetailPage locale={locale} service={service} />;
}
