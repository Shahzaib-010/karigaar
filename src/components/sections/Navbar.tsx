"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useEffect, useRef, useState } from "react";

type NavbarUser = {
  name: string;
  role: string;
  city: string;
  email: string;
  initials?: string;
};

type NavbarProps = {
  currentUser?: NavbarUser | null;
};

const navLinks = [
  { label: "Browse Workers", href: "browse-workers" },
  { label: "Post a Job", href: "post-a-job" },
  { label: "How It Works", href: "how-it-works" },
  { label: "Cities", href: "cities" },
];

const fallbackUser: NavbarUser = {
  name: "Ayesha Khan",
  role: "Homeowner",
  city: "Lahore",
  email: "ayesha@example.com",
  initials: "AK",
};

export default function Navbar({ currentUser = null }: NavbarProps) {
  const locale = useLocale();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const user = currentUser;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const withLocale = (path: string) => `/${locale}/${path}`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}`}
          className="shrink-0 text-2xl font-bold text-[var(--primary)]"
          aria-label="Karigaar home"
        >
          Karigaar
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-8 text-sm font-semibold text-slate-700 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={withLocale(link.href)}
              className="transition-colors hover:text-[var(--primary)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <div
            className="flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 p-1 text-sm font-bold text-slate-600"
            aria-label="Language selector"
          >
            <Link
              href="/en"
              className={`rounded-full px-3 py-1.5 transition-colors ${
                locale === "en"
                  ? "bg-[var(--primary)] text-white"
                  : "hover:text-[var(--primary)]"
              }`}
            >
              EN
            </Link>
            <span className="px-1 text-slate-300">/</span>
            <Link
              href="/ur"
              className={`rounded-full px-3 py-1.5 transition-colors ${
                locale === "ur"
                  ? "bg-[var(--primary)] text-white"
                  : "hover:text-[var(--primary)]"
              }`}
            >
              اردو
            </Link>
          </div>

          {user ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((value) => !value)}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2"
              >
                {user.initials ?? user.name.slice(0, 2).toUpperCase()}
              </button>

              {isProfileOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-72 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-xl"
                >
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--primary)] text-base font-bold text-white">
                      {user.initials ?? user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-950">
                        {user.name}
                      </p>
                      <p className="text-sm font-semibold text-slate-500">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3 pt-4 text-sm">
                    <p className="flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">City</span>
                      <span className="font-bold text-slate-900">
                        {user.city}
                      </span>
                    </p>
                    <p className="flex justify-between gap-4">
                      <span className="font-semibold text-slate-500">
                        Email
                      </span>
                      <span className="font-bold text-slate-900">
                        {user.email}
                      </span>
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                href={withLocale("login")}
                className="rounded-full px-4 py-2 text-sm font-bold text-slate-700 transition-colors hover:text-[var(--primary)]"
              >
                Login
              </Link>
              <Link
                href={withLocale("sign-up")}
                className="rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      <nav className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700 lg:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={withLocale(link.href)}
            className="shrink-0 transition-colors hover:text-[var(--primary)]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export { fallbackUser };
