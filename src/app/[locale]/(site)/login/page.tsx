"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ApiError, loginRequest } from "@/src/lib/api";
import { resolveRedirectPath } from "@/src/lib/permissions";

type LoginFormValues = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const t = useTranslations("login");
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState("");
  const isRtl = locale === "ur";
  const loginSchema = z.object({
    email: z.string().email(t("errors.email")),
    password: z.string().min(1, t("errors.password")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setSubmitError("");

    try {
      const { access_token, user, redirect_to } = await loginRequest(values);

      login(user, access_token);
      router.push(resolveRedirectPath(redirect_to, locale));
    } catch (error) {
      setSubmitError(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : t("errors.submit"),
      );
    }
  }

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="flex min-h-[calc(100dvh-64px)] w-full justify-center bg-white px-4 py-14 text-foreground sm:min-h-[calc(100dvh-80px)] sm:px-6 lg:px-8"
    >
      <div className="flex w-full max-w-sm flex-col gap-8 pt-6 sm:pt-10">
        <h1 className="text-center font-karigaar text-5xl font-semibold tracking-tight sm:text-6xl">
          {t("heading")}
        </h1>

        <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
          <Field label={t("fields.email")} error={errors.email?.message}>
            <Input
              type="email"
              placeholder={t("placeholders.email")}
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              className="h-11 bg-background"
              {...register("email")}
            />
          </Field>

          <Field label={t("fields.password")} error={errors.password?.message}>
            <Input
              type="password"
              placeholder={t("placeholders.password")}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              className="h-11 bg-background"
              {...register("password")}
            />
          </Field>

          {submitError ? (
            <p className="text-sm font-medium text-destructive">
              {submitError}
            </p>
          ) : null}

          <Button
            type="submit"
            className="h-11 w-full bg-foreground text-background hover:bg-foreground/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block text-start">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}
