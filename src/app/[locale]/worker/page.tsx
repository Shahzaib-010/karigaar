import { redirect } from "next/navigation";

export default async function WorkerIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/worker/dashboard`);
}
