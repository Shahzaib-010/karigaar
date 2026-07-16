"use client";

import { type ReactNode } from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function ProfileView({ locale }: { locale: string }) {
  const { user } = useAuth();

  return (
    <main className="min-h-[60vh] bg-[#f7faf9]">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-6 font-karigaar text-3xl font-bold text-slate-950">
          My Profile
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Row label="Name" value={user?.name} />
            <Row label="Email" value={user?.email} />
            <Row label="Phone" value={user?.phone_number} />
            <Row label="Address" value={user?.address} />
            <Row
              label="Role"
              value={
                user?.roles?.length ? (
                  <span className="flex flex-wrap justify-end gap-1">
                    {user.roles.map((r) => (
                      <Badge key={r} variant="secondary" className="capitalize">
                        {r}
                      </Badge>
                    ))}
                  </span>
                ) : (
                  "—"
                )
              }
            />
          </CardContent>
        </Card>

        <div className="mt-4">
          <Button asChild variant="outline">
            <Link href={`/${locale}/bookings`}>My bookings</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="max-w-[70%] text-right font-medium">{value || "—"}</span>
    </div>
  );
}
