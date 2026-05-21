"use client";

import type { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle: ReactNode;
  logo: string;
  tagline: string;
  children: ReactNode;
  eyebrow?: ReactNode;
  isRtl?: boolean;
};

export default function AuthCard({
  title,
  subtitle,
  logo,
  tagline,
  children,
  eyebrow,
  isRtl = false,
}: AuthCardProps) {
  return (
    <section className="mx-auto w-full max-w-[480px] px-4 py-10 sm:py-14">
      <div className="mb-6 text-center">
        <div
          className={`font-karigaar text-3xl font-bold text-primary ${
            isRtl ? "ur-brand" : ""
          }`}
        >
          {logo}
        </div>
        <p
          className={`mt-1 text-sm font-semibold text-muted ${
            isRtl ? "ur-readable" : ""
          }`}
        >
          {tagline}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 sm:p-7">
        {eyebrow ? <div className="mb-4">{eyebrow}</div> : null}
        <div className="mb-6 text-start">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <div
            className={`mt-2 text-[15px] leading-6 text-muted ${
              isRtl ? "ur-readable" : ""
            }`}
          >
            {subtitle}
          </div>
        </div>
        {children}
      </div>
    </section>
  );
}
