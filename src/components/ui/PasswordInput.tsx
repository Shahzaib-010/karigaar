"use client";

import { IconEye, IconEyeOff, IconLock } from "@tabler/icons-react";
import { useMemo, useState, type InputHTMLAttributes } from "react";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  showStrength?: boolean;
  showLabel: string;
  hideLabel: string;
};

function getStrength(value: string) {
  return [
    value.length >= 8,
    /[A-Z]/.test(value),
    /\d/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ].filter(Boolean).length;
}

export default function PasswordInput({
  label,
  error,
  showStrength = false,
  showLabel,
  hideLabel,
  value,
  id,
  className = "",
  disabled,
  ...props
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);
  const strength = useMemo(() => getStrength(String(value ?? "")), [value]);
  const inputId = id ?? props.name;
  const barColor =
    strength <= 1
      ? "bg-error"
      : strength === 2
        ? "bg-warning"
        : "bg-primary";

  return (
    <label className="block text-start">
      <span className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-muted">
          <IconLock size={18} stroke={1.8} />
        </span>
        <input
          id={inputId}
          type={isVisible ? "text" : "password"}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          value={value}
          className={`h-12 w-full rounded-xl border bg-card ps-11 pe-12 text-start text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-background disabled:text-muted ${
            error ? "border-error" : "border-border"
          } ${className}`}
          {...props}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsVisible((next) => !next)}
          className="absolute inset-y-0 end-0 flex w-12 items-center justify-center rounded-e-xl text-muted transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed"
          aria-label={isVisible ? hideLabel : showLabel}
        >
          {isVisible ? (
            <IconEyeOff size={20} stroke={1.8} />
          ) : (
            <IconEye size={20} stroke={1.8} />
          )}
        </button>
      </span>
      {showStrength ? (
        <span className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden="true">
          {[1, 2, 3, 4].map((segment) => (
            <span
              key={segment}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                strength >= segment ? barColor : "bg-border"
              }`}
            />
          ))}
        </span>
      ) : null}
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-error">
          {error}
        </span>
      ) : null}
    </label>
  );
}
