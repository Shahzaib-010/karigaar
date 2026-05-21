"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  IconArrowLeft,
  IconChevronDown,
  IconMail,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useReducer, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useAuth, type User } from "@/context/AuthContext";
import AuthCard from "@/src/components/ui/AuthCard";
import FormButton from "@/src/components/ui/FormButton";
import FormInput from "@/src/components/ui/FormInput";
import OTPInput from "@/src/components/ui/OTPInput";
import PasswordInput from "@/src/components/ui/PasswordInput";
import PhoneInput from "@/src/components/ui/PhoneInput";

type SignupStep = "form" | "otp" | "verifying" | "success";

type State = {
  step: SignupStep;
  pendingUser: User | null;
  maskedEmail: string;
  otpError: string;
  resendNotice: boolean;
  shakeOtp: boolean;
  expiresAt: number;
};

type Action =
  | { type: "OTP"; user: User; maskedEmail: string }
  | { type: "BACK" }
  | { type: "VERIFYING" }
  | { type: "SUCCESS" }
  | { type: "OTP_ERROR"; message: string }
  | { type: "RESEND"; expiresAt: number }
  | { type: "CLEAR_NOTICE" }
  | { type: "CLEAR_SHAKE" }
  | { type: "EXPIRE" };

type RegisterResponse = {
  user: Omit<Partial<User>, "roles" | "permissions"> & {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string;
    roles?: Array<{ name: string }> | string[];
    permissions?: string[];
  };
  role?: string;
  roles?: string[];
  permissions?: string[];
};

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

const OTP_TTL = 5 * 60 * 1000;
const API_BASE_URL = "https://kaarigaar.chfarhanliaqat.site/api";
const API_ENDPOINTS = {
  registerCustomer: `${API_BASE_URL}/register/customer`,
  verifyOtp: `${API_BASE_URL}/login/verify-otp`,
  resendOtp: `${API_BASE_URL}/login/resend-otp`,
};

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  return `${name.slice(0, 1)}***@${domain}`;
}

function normalizeUser(response: RegisterResponse): User {
  const responseRoles =
    response.roles ??
    response.user.roles?.map((role) =>
      typeof role === "string" ? role : role.name,
    ) ??
    [];

  return {
    id: response.user.id,
    name: response.user.name,
    email: response.user.email,
    phone: response.user.phone,
    city: response.user.city,
    address: response.user.address ?? "",
    role: response.role ?? responseRoles[0] ?? "customer",
    roles: responseRoles,
    permissions: response.permissions ?? response.user.permissions ?? [],
    created_at: response.user.created_at ?? new Date().toISOString(),
  };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "OTP":
      return {
        ...state,
        step: "otp",
        pendingUser: action.user,
        maskedEmail: action.maskedEmail,
        otpError: "",
        shakeOtp: false,
        expiresAt: Date.now() + OTP_TTL,
      };
    case "BACK":
      return { ...state, step: "form", otpError: "", shakeOtp: false };
    case "VERIFYING":
      return { ...state, step: "verifying", otpError: "", shakeOtp: false };
    case "SUCCESS":
      return { ...state, step: "success" };
    case "OTP_ERROR":
      return {
        ...state,
        step: "otp",
        otpError: action.message,
        shakeOtp: true,
      };
    case "RESEND":
      return {
        ...state,
        expiresAt: action.expiresAt,
        resendNotice: true,
        otpError: "",
        shakeOtp: false,
      };
    case "CLEAR_NOTICE":
      return { ...state, resendNotice: false };
    case "CLEAR_SHAKE":
      return { ...state, shakeOtp: false };
    case "EXPIRE":
      return { ...state, expiresAt: Date.now() - 1 };
    default:
      return state;
  }
}

export default function SignupPage() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ur";
  const { login } = useAuth();
  const [otp, setOtp] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(OTP_TTL / 1000);
  const [state, dispatch] = useReducer(reducer, {
    step: "form",
    pendingUser: null,
    maskedEmail: "",
    otpError: "",
    resendNotice: false,
    shakeOtp: false,
    expiresAt: 0,
  });

  const schema = z
    .object({
      name: z.string().min(3, t("errors.name")),
      email: z.string().email(t("errors.email")),
      phone: z
        .string()
        .regex(/^3\d{9}$/, t("errors.phone")),
      city: z.enum(cities, { error: t("errors.city") }),
      password: z.string().min(8, t("errors.password")),
      password_confirmation: z.string(),
      terms: z.boolean().refine((value) => value, t("errors.terms")),
    })
    .refine((data) => data.password === data.password_confirmation, {
      path: ["password_confirmation"],
      message: t("errors.confirmPassword"),
    });

  type SignupFormValues = z.infer<typeof schema>;

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "lahore",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  });

  const password = useWatch({ control, name: "password" });
  const email = useWatch({ control, name: "email" });
  const firstName = state.pendingUser?.name.split(" ")[0] ?? "";
  const isExpired = secondsLeft <= 0;
  const timerText = `${Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0")}:${(secondsLeft % 60).toString().padStart(2, "0")}`;

  useEffect(() => {
    if (state.step !== "otp") {
      return;
    }

    const timer = window.setInterval(() => {
      const nextSeconds = Math.max(
        0,
        Math.ceil((state.expiresAt - Date.now()) / 1000),
      );
      setSecondsLeft(nextSeconds);
      if (nextSeconds === 0) {
        dispatch({ type: "EXPIRE" });
      }
    }, 1000);

    return () => window.clearInterval(timer);
  }, [state.expiresAt, state.step]);

  async function onSubmit(values: SignupFormValues) {
    setIsSubmitting(true);
    setRegisterError("");

    try {
      const response = await fetch(API_ENDPOINTS.registerCustomer, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: `0${values.phone}`,
          city: values.city,
          password: values.password,
          password_confirmation: values.password_confirmation,
        }),
      });

      if (!response.ok) {
        throw new Error("registration failed");
      }

      const data = (await response.json()) as RegisterResponse;
      const user = normalizeUser(data);
      dispatch({ type: "OTP", user, maskedEmail: maskEmail(user.email) });
      setSecondsLeft(OTP_TTL / 1000);
    } catch {
      setRegisterError(t("errors.submit"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function verifyOtp() {
    if (!state.pendingUser || otp.length !== 6 || isExpired) {
      dispatch({ type: "OTP_ERROR", message: t("otp.incorrect") });
      window.setTimeout(() => dispatch({ type: "CLEAR_SHAKE" }), 420);
      return;
    }

    dispatch({ type: "VERIFYING" });

    try {
      const response = await fetch(API_ENDPOINTS.verifyOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.pendingUser.email, otp }),
      });

      if (!response.ok) {
        throw new Error("otp failed");
      }

      window.setTimeout(() => {
        login(state.pendingUser as User);
        dispatch({ type: "SUCCESS" });
      }, 500);
    } catch {
      dispatch({ type: "OTP_ERROR", message: t("otp.incorrect") });
      window.setTimeout(() => dispatch({ type: "CLEAR_SHAKE" }), 420);
    }
  }

  async function resendOtp() {
    if (!state.pendingUser) {
      return;
    }

    setIsResending(true);

    try {
      await fetch(API_ENDPOINTS.resendOtp, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: state.pendingUser.email }),
      });
      dispatch({ type: "RESEND", expiresAt: Date.now() + OTP_TTL });
      setSecondsLeft(OTP_TTL / 1000);
      window.setTimeout(() => dispatch({ type: "CLEAR_NOTICE" }), 3000);
    } finally {
      setIsResending(false);
    }
  }

  const shellProps = {
    logo: t("brand"),
    tagline: t("tagline"),
    isRtl,
  };

  return (
    <main
      dir={isRtl ? "rtl" : "ltr"}
      className="min-h-[calc(100dvh-80px)] bg-background"
    >
      {state.step === "form" ? (
        <div className="auth-step-enter">
          <AuthCard
            {...shellProps}
            title={t("form.title")}
            subtitle={t("form.subtitle")}
          >
            <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
              <FormInput
                label={t("fields.name")}
                placeholder={t("placeholders.name")}
                icon={<IconUser size={18} stroke={1.8} />}
                error={errors.name?.message}
                {...register("name")}
              />
              <FormInput
                label={t("fields.email")}
                placeholder={t("placeholders.email")}
                type="email"
                icon={<IconMail size={18} stroke={1.8} />}
                hint={t("hints.email")}
                error={errors.email?.message}
                {...register("email")}
              />
              <Controller
                control={control}
                name="phone"
                render={({ field }) => (
                  <PhoneInput
                    label={t("fields.phone")}
                    placeholder={t("placeholders.phone")}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={(event) =>
                      field.onChange(event.target.value.replace(/\D/g, ""))
                    }
                    error={errors.phone?.message}
                  />
                )}
              />
              <label className="block text-start">
                <span className="mb-2 block text-sm font-semibold text-foreground">
                  {t("fields.city")}
                </span>
                <span className="relative block">
                  <select
                    className={`h-12 w-full appearance-none rounded-xl border bg-card ps-4 pe-11 text-start text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 ${
                      errors.city ? "border-error" : "border-border"
                    }`}
                    {...register("city")}
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {t(`cities.${city}`)}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown
                    size={20}
                    stroke={1.8}
                    className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted"
                  />
                </span>
                {errors.city ? (
                  <span className="mt-1.5 block text-xs font-semibold text-error">
                    {errors.city.message}
                  </span>
                ) : null}
              </label>
              <PasswordInput
                label={t("fields.password")}
                placeholder={t("placeholders.password")}
                showLabel={t("password.show")}
                hideLabel={t("password.hide")}
                showStrength
                value={password}
                error={errors.password?.message}
                {...register("password")}
              />
              <PasswordInput
                label={t("fields.confirmPassword")}
                placeholder={t("placeholders.confirmPassword")}
                showLabel={t("password.show")}
                hideLabel={t("password.hide")}
                error={errors.password_confirmation?.message}
                {...register("password_confirmation")}
              />
              <label className="flex items-start gap-3 text-start text-sm text-muted">
                <input
                  type="checkbox"
                  className="mt-0.5 h-5 w-5 rounded border-border text-primary accent-primary focus:ring-primary"
                  {...register("terms")}
                />
                <span>
                  {t("terms.prefix")}{" "}
                  <Link href={`/${locale}/terms`} className="font-bold text-primary">
                    {t("terms.terms")}
                  </Link>{" "}
                  {t("terms.and")}{" "}
                  <Link href={`/${locale}/privacy`} className="font-bold text-primary">
                    {t("terms.privacy")}
                  </Link>
                </span>
              </label>
              {errors.terms ? (
                <span className="-mt-2 block text-xs font-semibold text-error">
                  {errors.terms.message}
                </span>
              ) : null}
              {registerError ? (
                <p className="rounded-xl border border-error px-4 py-3 text-sm font-semibold text-error">
                  {registerError}
                </p>
              ) : null}
              <FormButton type="submit" fullWidth loading={isSubmitting}>
                {t("form.submit")}
              </FormButton>
            </form>
          </AuthCard>
        </div>
      ) : null}

      {state.step === "otp" ? (
        <div className="auth-step-enter">
          <AuthCard
            {...shellProps}
            title={t("otp.title")}
            subtitle={
              <>
                {t("otp.subtitle")}{" "}
                <strong className="font-bold text-primary">
                  {state.maskedEmail || maskEmail(email)}
                </strong>
              </>
            }
            eyebrow={
              <button
                type="button"
                onClick={() => dispatch({ type: "BACK" })}
                className="inline-flex items-center gap-2 text-sm font-bold text-primary"
              >
                <IconArrowLeft size={18} stroke={1.8} />
                {t("otp.back")}
              </button>
            }
          >
            <div className="grid gap-6">
              <OTPInput
                value={otp}
                onChange={setOtp}
                label={t("otp.label")}
                error={state.otpError}
                shake={state.shakeOtp}
              />
              <div className="text-center">
                {isExpired ? (
                  <p className="text-sm font-bold text-error">{t("otp.expired")}</p>
                ) : (
                  <p
                    className={`text-sm font-bold ${
                      secondsLeft < 60 ? "text-error" : "text-muted"
                    }`}
                  >
                    {timerText}
                  </p>
                )}
                {state.resendNotice ? (
                  <p className="mt-2 text-sm font-bold text-success">
                    {t("otp.resendSuccess")}
                  </p>
                ) : null}
              </div>
              <FormButton
                type="button"
                fullWidth
                disabled={isExpired || otp.length !== 6}
                onClick={verifyOtp}
              >
                {t("otp.verify")}
              </FormButton>
              <FormButton
                type="button"
                variant="ghost"
                fullWidth
                disabled={!isExpired}
                loading={isResending}
                onClick={resendOtp}
              >
                {t("otp.resend")}
              </FormButton>
            </div>
          </AuthCard>
        </div>
      ) : null}

      {state.step === "verifying" ? (
        <div className="auth-step-enter">
          <AuthCard
            {...shellProps}
            title={t("verifying.title")}
            subtitle={t("verifying.subtitle")}
          >
            <div className="flex flex-col items-center gap-5 py-8">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm font-bold text-muted">{t("verifying.text")}</p>
            </div>
          </AuthCard>
        </div>
      ) : null}

      {state.step === "success" ? (
        <div className="auth-step-enter">
          <AuthCard
            {...shellProps}
            title={t("success.title")}
            subtitle={t("success.subtitle")}
          >
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <svg
                width="72"
                height="72"
                viewBox="0 0 72 72"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="36"
                  cy="36"
                  r="34"
                  className="stroke-success"
                  strokeWidth="2"
                />
                <path
                  d="M22 37.5L32 47L51 26"
                  className="success-check stroke-primary"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-xl font-bold text-primary">
                {t("success.welcome", { name: firstName })}
              </p>
              <div className="grid w-full gap-3 sm:grid-cols-2">
                <FormButton
                  type="button"
                  fullWidth
                  onClick={() => router.push(`/${locale}`)}
                >
                  {t("success.home")}
                </FormButton>
                <FormButton
                  type="button"
                  variant="ghost"
                  fullWidth
                  onClick={() => router.push(`/${locale}/workers`)}
                >
                  {t("success.findWorker")}
                </FormButton>
              </div>
            </div>
          </AuthCard>
        </div>
      ) : null}
    </main>
  );
}
