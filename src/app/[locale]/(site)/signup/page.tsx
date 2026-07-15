"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconChevronDown } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import OTPInput from "@/src/components/ui/OTPInput";
import {
  ApiError,
  loginRequest,
  registerUser,
  resendOtp,
  verifyOtp,
} from "@/src/lib/api";
import { resolveRedirectPath } from "@/src/lib/permissions";

type SignupStep = "details" | "otp";
type ResendState = "idle" | "sending" | "sent";

const cities = [
  "lahore",
  "karachi",
  "islamabad",
  "rawalpindi",
  "faisalabad",
  "multan",
  "gujranwala",
  "peshawar",
  "quetta",
  "other",
] as const;

/** Details captured before registration, reused for OTP verify + auto-login. */
type PendingAccount = {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  city: string;
};

export default function SignupPage() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ur";
  const { login } = useAuth();

  const [step, setStep] = useState<SignupStep>("details");
  const [pending, setPending] = useState<PendingAccount | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendState, setResendState] = useState<ResendState>("idle");

  const detailsSchema = z
    .object({
      name: z.string().min(3, t("errors.name")),
      email: z.string().email(t("errors.email")),
      password: z.string().min(8, t("errors.password")),
      confirmPassword: z.string(),
      phone: z.string().regex(/^3\d{9}$/, t("errors.phone")),
      address: z.string().min(5, t("errors.address")),
      city: z.enum(cities, { error: t("errors.city") }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("errors.confirmPassword"),
      path: ["confirmPassword"],
    });

  type DetailsFormValues = z.infer<typeof detailsSchema>;

  const {
    control,
    handleSubmit: handleDetailsSubmit,
    register: registerDetails,
    formState: { errors: detailsErrors },
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      city: "lahore",
    },
  });

  async function onDetailsSubmit(values: DetailsFormValues) {
    setIsRegistering(true);
    setDetailsError("");

    const email = values.email.trim().toLowerCase();

    const phoneNumber = `+92${values.phone}`;
    const address = `${values.address.trim()}, ${values.city}`;

    try {
      await registerUser({
        name: values.name.trim(),
        email,
        password: values.password,
        password_confirmation: values.confirmPassword,
        phone_number: phoneNumber,
        address,
      });

      setPending({
        name: values.name.trim(),
        email,
        password: values.password,
        phone: values.phone,
        address: values.address.trim(),
        city: values.city,
      });
      setOtpCode("");
      setOtpError("");
      setResendState("idle");
      setStep("otp");
    } catch (error) {
      setDetailsError(error instanceof ApiError ? error.message : t("errors.submit"));
    } finally {
      setIsRegistering(false);
    }
  }

  async function onOtpSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!pending) {
      setStep("details");
      return;
    }

    if (otpCode.length !== 6) {
      setOtpError(t("otp.incorrect"));
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      await verifyOtp({ email: pending.email, otp: otpCode });

      // verify-otp does not return a token, so log in with the stored password.
      const { access_token, user, redirect_to } = await loginRequest({
        email: pending.email,
        password: pending.password,
      });

      login({ ...user, city: pending.city }, access_token);
      router.push(resolveRedirectPath(redirect_to, locale));
    } catch (error) {
      setOtpError(error instanceof ApiError ? error.message : t("otp.incorrect"));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (!pending || resendState === "sending") {
      return;
    }

    setResendState("sending");
    setOtpError("");

    try {
      await resendOtp(pending.email);
      setResendState("sent");
    } catch (error) {
      setResendState("idle");
      setOtpError(error instanceof ApiError ? error.message : t("errors.otpSubmit"));
    }
  }

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="flex min-h-[calc(100dvh-64px)] w-full overflow-hidden bg-white text-foreground sm:min-h-[calc(100dvh-80px)] font-karigaar"
    >
      <div className="flex w-full flex-1 items-center justify-center px-4 py-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full max-w-xl flex-col items-center gap-5"
        >
          <h1 className="pb-[3vw] text-5xl font-karigaar">Account Setup</h1>

          <div className="w-full max-w-sm">
            <AnimatePresence mode="wait" initial={false}>
              {step === "details" ? (
                <motion.form
                  key="details-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-3"
                  onSubmit={handleDetailsSubmit(onDetailsSubmit)}
                >
                  <div className="grid gap-3 sm:gap-3.5">
                    <Field label={t("fields.name")} error={detailsErrors.name?.message}>
                      <Input
                        placeholder={t("placeholders.name")}
                        autoComplete="name"
                        aria-invalid={Boolean(detailsErrors.name)}
                        className="h-11 bg-white"
                        {...registerDetails("name")}
                      />
                    </Field>

                    <Field
                      label={t("fields.email")}
                      error={detailsErrors.email?.message}
                    >
                      <Input
                        type="email"
                        placeholder={t("placeholders.email")}
                        autoComplete="email"
                        aria-invalid={Boolean(detailsErrors.email)}
                        className="h-11 bg-white"
                        {...registerDetails("email")}
                      />
                    </Field>

                    <Field
                      label={t("fields.password")}
                      error={detailsErrors.password?.message}
                    >
                      <Input
                        type="password"
                        placeholder={t("placeholders.password")}
                        autoComplete="new-password"
                        aria-invalid={Boolean(detailsErrors.password)}
                        className="h-11 bg-white"
                        {...registerDetails("password")}
                      />
                    </Field>

                    <Field
                      label={t("fields.confirmPassword")}
                      error={detailsErrors.confirmPassword?.message}
                    >
                      <Input
                        type="password"
                        placeholder={t("placeholders.confirmPassword")}
                        autoComplete="new-password"
                        aria-invalid={Boolean(detailsErrors.confirmPassword)}
                        className="h-11 bg-white"
                        {...registerDetails("confirmPassword")}
                      />
                    </Field>

                    <Controller
                      control={control}
                      name="phone"
                      render={({ field }) => (
                        <Field
                          label={t("fields.phone")}
                          error={detailsErrors.phone?.message}
                        >
                          <div className="flex h-11 items-stretch overflow-hidden rounded-lg border border-input bg-white focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
                            <span className="flex shrink-0 items-center border-e border-input bg-muted px-3 text-sm font-medium text-muted-foreground">
                              +92
                            </span>
                            <input
                              inputMode="numeric"
                              placeholder={t("placeholders.phone")}
                              value={field.value}
                              onBlur={field.onBlur}
                              onChange={(event) =>
                                field.onChange(event.target.value.replace(/\D/g, ""))
                              }
                              className="w-full bg-white px-3 text-sm outline-none placeholder:text-muted-foreground"
                              aria-invalid={Boolean(detailsErrors.phone)}
                            />
                          </div>
                        </Field>
                      )}
                    />

                    <Field
                      label={t("fields.address")}
                      error={detailsErrors.address?.message}
                    >
                      <Input
                        placeholder={t("placeholders.address")}
                        autoComplete="street-address"
                        aria-invalid={Boolean(detailsErrors.address)}
                        className="h-11 bg-white"
                        {...registerDetails("address")}
                      />
                    </Field>

                    <Field
                      label={t("fields.location")}
                      error={detailsErrors.city?.message}
                    >
                      <span className="relative block">
                        <select
                          className={`h-11 w-full appearance-none rounded-lg border bg-white px-3 text-start text-sm outline-none transition focus:border-ring focus:ring-3 focus:ring-ring/50 ${
                            detailsErrors.city ? "border-destructive" : "border-input"
                          }`}
                          {...registerDetails("city")}
                        >
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {t(`cities.${city}`)}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown
                          size={18}
                          stroke={1.8}
                          className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                      </span>
                    </Field>
                  </div>

                  {detailsError ? (
                    <p className="text-center text-xs font-semibold text-error sm:text-sm">
                      {detailsError}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    disabled={isRegistering}
                    className="h-11 w-full bg-foreground text-background hover:bg-foreground/90"
                  >
                    {isRegistering ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        {t("details.submit")}
                      </span>
                    ) : (
                      t("details.submit")
                    )}
                  </Button>
                </motion.form>
              ) : null}

              {step === "otp" ? (
                <motion.form
                  key="otp-step"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid gap-3"
                  onSubmit={onOtpSubmit}
                >
                  <div className="text-center">
                    <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-sm">
                      {t("otp.subtitle")}{" "}
                      <span className="font-semibold text-foreground">
                        {pending?.email}
                      </span>
                    </p>
                  </div>

                  <OTPInput
                    label={t("otp.label")}
                    value={otpCode}
                    disabled={isVerifying}
                    onChange={(value) => {
                      setOtpCode(value);
                      if (otpError) {
                        setOtpError("");
                      }
                    }}
                    error={otpError}
                  />

                  <div className="flex items-center justify-center gap-4 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("details");
                        setOtpCode("");
                        setOtpError("");
                      }}
                      className="text-muted-foreground transition hover:text-primary"
                    >
                      {t("otp.back")}
                    </button>
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={resendState === "sending"}
                      className="text-muted-foreground transition hover:text-primary disabled:opacity-50"
                    >
                      {resendState === "sending"
                        ? t("verifying.title")
                        : resendState === "sent"
                          ? t("otp.resendSuccess")
                          : t("otp.resend")}
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
                        {t("otp.verify")}
                      </span>
                    ) : (
                      t("otp.verify")
                    )}
                  </Button>
                </motion.form>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
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
  children: React.ReactNode;
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
