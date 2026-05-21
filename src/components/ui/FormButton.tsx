"use client";

import type { ButtonHTMLAttributes } from "react";

type FormButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  loading?: boolean;
  fullWidth?: boolean;
};

export default function FormButton({
  variant = "primary",
  loading = false,
  fullWidth = false,
  disabled,
  children,
  className = "",
  ...props
}: FormButtonProps) {
  const variants = {
    primary:
      "border-primary bg-primary text-white hover:bg-primary-dark disabled:hover:bg-primary",
    ghost:
      "border-primary bg-card text-primary hover:bg-primary/5 disabled:hover:bg-card",
    danger:
      "border-error bg-error text-white hover:bg-error/90 disabled:hover:bg-error",
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex h-12 items-center justify-center rounded-lg border px-5 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 ${
        variants[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </button>
  );
}
