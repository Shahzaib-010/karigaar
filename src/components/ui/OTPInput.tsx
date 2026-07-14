"use client";

import { useEffect, useRef } from "react";

type OTPInputProps = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  shake?: boolean;
  disabled?: boolean;
  label: string;
};

const OTP_LENGTH = 6;

export default function OTPInput({
  value,
  onChange,
  error,
  shake = false,
  disabled = false,
  label,
}: OTPInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: OTP_LENGTH }, (_, index) => value[index] ?? "");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  function updateDigit(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    const nextDigits = [...digits];
    nextDigits[index] = digit;
    onChange(nextDigits.join("").slice(0, OTP_LENGTH));

    if (digit && index < OTP_LENGTH - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  return (
    <div className="text-start">
      <span className="mb-2 block text-sm font-medium text-foreground">
        {label}
      </span>
      <div
        dir="ltr"
        className={`flex justify-center gap-2 ${shake ? "otp-shake" : ""}`}
        onPaste={(event) => {
          event.preventDefault();
          const pasted = event.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, OTP_LENGTH);
          onChange(pasted);
          refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
        }}
      >
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              refs.current[index] = element;
            }}
            value={digit}
            disabled={disabled}
            inputMode="numeric"
            maxLength={1}
            aria-invalid={Boolean(error)}
            className={`h-12 w-11 rounded-lg border bg-white text-center text-base font-medium text-foreground outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${
              error ? "border-destructive" : "border-input"
            }`}
            onChange={(event) => updateDigit(index, event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !digits[index] && index > 0) {
                refs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </div>
      {error ? (
        <span className="mt-2 block text-center text-xs font-semibold text-error">
          {error}
        </span>
      ) : null}
    </div>
  );
}
