import { Card, CardContent } from "@/components/ui/card";

export default function ComingSoon({
  title,
  phase,
}: {
  title: string;
  phase?: string;
}) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <Card>
        <CardContent className="flex min-h-40 flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm font-medium">This screen isn&apos;t built yet.</p>
          <p className="text-sm text-muted-foreground">
            {phase ? `Coming in ${phase}.` : "Coming soon."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
