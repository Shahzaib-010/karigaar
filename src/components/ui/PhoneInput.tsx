"use client";

import type { InputHTMLAttributes } from "react";

type PhoneInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  error?: string;
};

export default function PhoneInput({
  label,
  error,
  id,
  className = "",
  disabled,
  ...props
}: PhoneInputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block text-start">
      <span className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </span>
      <span
        className={`flex h-12 items-center rounded-xl border bg-card transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${
          error ? "border-error" : "border-border"
        } ${disabled ? "bg-background" : ""}`}
      >
        <span className="ms-2 flex h-8 shrink-0 items-center rounded-lg border border-border bg-background px-3 text-sm font-bold text-foreground">
          🇵🇰 +92
        </span>
        <input
          id={inputId}
          type="tel"
          inputMode="numeric"
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`h-full min-w-0 flex-1 bg-transparent px-3 text-start text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:text-muted ${className}`}
          {...props}
        />
      </span>
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-error">
          {error}
        </span>
      ) : null}
    </label>
  );
}
