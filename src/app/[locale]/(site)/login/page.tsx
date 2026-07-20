"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState, type FormEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";

import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OTPInput from "@/src/components/ui/OTPInput";
import {
  ApiError,
  loginRequest,
  resendOtp,
  verifyOtp,
  type RoleName,
} from "@/src/lib/api";
import { resolveRedirectPath } from "@/src/lib/permissions";

type LoginFormValues = {
  email: string;
  password: string;
};

type Step = "login" | "otp";
type ResendState = "idle" | "sending" | "sent";

export default function LoginPage() {
  const t = useTranslations("login");
  const ts = useTranslations("signup");
  const locale = useLocale();
  const router = useRouter();
  const { login } = useAuth();
  const isRtl = locale === "ur";

  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState<Step>("login");
  // Credentials from the login attempt, reused to auto-login after verifying.
  const [creds, setCreds] = useState<LoginFormValues | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendState, setResendState] = useState<ResendState>("idle");

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
    defaultValues: { email: "", password: "" },
  });

  function redirectAfterLogin(
    redirectTo: string,
    roles: readonly RoleName[],
  ) {
    const next = new URLSearchParams(window.location.search).get("next");
    const dest =
      next && next.startsWith("/")
        ? next
        : resolveRedirectPath(redirectTo, locale, roles);
    router.push(dest);
  }

  async function onSubmit(values: LoginFormValues) {
    setSubmitError("");
    const email = values.email.trim().toLowerCase();

    try {
      const { access_token, user, redirect_to } = await loginRequest({
        email,
        password: values.password,
      });
      login(user, access_token);
      redirectAfterLogin(redirect_to, user.roles);
    } catch (error) {
      // 403 = account exists but the email was never verified. Drop the user
      // into the verify flow instead of a dead-end error.
      const unverified =
        error instanceof ApiError &&
        (error.status === 403 || /not\s*verified/i.test(error.message));

      if (unverified) {
        await startVerification({ email, password: values.password });
        return;
      }

      setSubmitError(
        error instanceof ApiError
          ? error.message
          : error instanceof Error
            ? error.message
            : t("errors.submit"),
      );
    }
  }

  async function startVerification(values: LoginFormValues) {
    setCreds(values);
    setOtpCode("");
    setOtpError("");
    setSubmitError("");
    setStep("otp");
    // Issue a fresh code so an expired/lost one from signup doesn't block them.
    setResendState("sending");
    try {
      await resendOtp(values.email);
      setResendState("sent");
    } catch {
      // Rate-limited or already-sent — the earlier code may still be valid.
      setResendState("idle");
    }
  }

  async function onOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!creds) {
      setStep("login");
      return;
    }
    if (otpCode.length !== 6) {
      setOtpError(ts("otp.incorrect"));
      return;
    }

    setIsVerifying(true);
    setOtpError("");
    try {
      await verifyOtp({ email: creds.email, otp: otpCode });
      // Verified — log in with the same credentials and route by role.
      const { access_token, user, redirect_to } = await loginRequest(creds);
      login(user, access_token);
      redirectAfterLogin(redirect_to, user.roles);
    } catch (error) {
      setOtpError(error instanceof ApiError ? error.message : ts("otp.incorrect"));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!creds || resendState === "sending") return;
    setResendState("sending");
    setOtpError("");
    try {
      await resendOtp(creds.email);
      setResendState("sent");
    } catch (error) {
      setResendState("idle");
      setOtpError(error instanceof ApiError ? error.message : ts("otp.incorrect"));
    }
  }

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="flex min-h-[calc(100dvh-64px)] w-full justify-center bg-white px-4 py-14 text-foreground sm:min-h-[calc(100dvh-80px)] sm:px-6 lg:px-8"
    >
      <div className="flex w-full max-w-sm flex-col gap-8 pt-6 sm:pt-10">
        <h1 className="text-center font-karigaar text-5xl font-semibold tracking-tight sm:text-6xl">
          {step === "otp" ? t("verify.heading") : t("heading")}
        </h1>

        <AnimatePresence mode="wait" initial={false}>
          {step === "login" ? (
            <motion.form
              key="login-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid gap-4"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                <p className="text-sm font-medium text-destructive">{submitError}</p>
              ) : null}

              <Button
                type="submit"
                className="h-11 w-full bg-foreground text-background hover:bg-foreground/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="grid gap-4"
              onSubmit={onOtpSubmit}
            >
              <p className="text-center text-sm leading-6 text-muted-foreground">
                {t("verify.sent")}{" "}
                <span className="font-semibold text-foreground">{creds?.email}</span>
              </p>

              <OTPInput
                label={ts("otp.label")}
                value={otpCode}
                disabled={isVerifying}
                onChange={(value) => {
                  setOtpCode(value);
                  if (otpError) setOtpError("");
                }}
                error={otpError}
              />

              <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setStep("login");
                    setOtpCode("");
                    setOtpError("");
                  }}
                  className="text-muted-foreground transition hover:text-primary"
                >
                  {t("verify.back")}
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendState === "sending"}
                  className="text-muted-foreground transition hover:text-primary disabled:opacity-50"
                >
                  {resendState === "sending"
                    ? ts("verifying.title")
                    : resendState === "sent"
                      ? ts("otp.resendSuccess")
                      : ts("otp.resend")}
                </button>
              </div>

              <Button
                type="submit"
                disabled={isVerifying}
                className="h-11 w-full bg-foreground text-background hover:bg-foreground/90"
              >
                {isVerifying ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {ts("otp.verify")}
                  </span>
                ) : (
                  ts("otp.verify")
                )}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>
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
      <span className="mb-2 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs font-medium text-destructive">
          {error}
        </span>
      ) : null}
    </label>
  );
}
