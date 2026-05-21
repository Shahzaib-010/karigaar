"use client";

import type { InputHTMLAttributes, ReactNode } from "react";

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
};

export default function FormInput({
  label,
  error,
  hint,
  icon,
  id,
  className = "",
  disabled,
  ...props
}: FormInputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="block text-start">
      <span className="mb-2 block text-sm font-semibold text-foreground">
        {label}
      </span>
      <span className="relative block">
        {icon ? (
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-muted">
            {icon}
          </span>
        ) : null}
        <input
          id={inputId}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={`h-12 w-full rounded-xl border bg-card pe-4 text-start text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-background disabled:text-muted ${
            icon ? "ps-11" : "ps-4"
          } ${error ? "border-error" : "border-border"} ${className}`}
          {...props}
        />
      </span>
      {hint && !error ? (
        <span className="mt-1.5 block text-xs font-medium text-muted">{hint}</span>
      ) : null}
      {error ? (
        <span className="mt-1.5 block text-xs font-semibold text-error">
          {error}
        </span>
      ) : null}
    </label>
  );
}
