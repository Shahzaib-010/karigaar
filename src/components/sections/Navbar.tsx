"use client";

import {
  IconLayoutDashboard,
  IconLogout,
  IconMenu2,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import NotificationsBell from "@/src/components/site/NotificationsBell";

const navLinks = [
  { label: "home", href: "/" },
  { label: "services", href: "services" },
] as const;

const menuItems = [
  { label: "dashboard", icon: IconLayoutDashboard, href: "dashboard" },
  { label: "profile", icon: IconUser, href: "profile" },
] as const;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const locale = useLocale();
  const t = useTranslations("navbar");
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const isRtl = locale === "ur";
  const firstName = user?.name.split(" ")[0] ?? "";
  const initials = useMemo(() => getInitials(user?.name ?? ""), [user?.name]);
  const withLocale = (path: string) => `/${locale}/${path}`;

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

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function handleLogout() {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    router.push("/");
  }

  return (
    <header
      dir={isRtl ? "rtl" : "ltr"}
      className="sticky top-0 z-50 border-b border-border bg-card font-sans"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 px-4 sm:min-h-20 sm:px-6 lg:gap-4 lg:px-8">
        <Link
          href={`/${locale}`}
          className="shrink-0"
          aria-label={t("homeAria")}
        >
          <Image
            src="/images/karigaar-logo.jpeg"
            alt={t("brand")}
            width={160}
            height={40}
            priority
            className="h-14 w-auto sm:h-20"
          />
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-sm font-semibold text-muted-foreground md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={withLocale(link.href)}
              className={`transition-colors hover:text-primary ${
                isRtl ? "ur-nav-link" : ""
              }`}
            >
              {t(`links.${link.label}`)}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link
              href={withLocale("bookings")}
              className={`transition-colors hover:text-primary ${
                isRtl ? "ur-nav-link" : ""
              }`}
            >
              {t("menu.bookings")}
            </Link>
          ) : null}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div
            className="flex h-9 items-center rounded-lg border border-border bg-background p-0.5 text-xs font-semibold text-muted-foreground"
            aria-label={t("language")}
          >
            <Link
              href="/en"
              className={`rounded-md px-2 py-1 transition-colors ${
                locale === "en" ? "bg-primary text-white" : "hover:text-primary"
              }`}
            >
              EN
            </Link>
            <Link
              href="/ur"
              className={`rounded-md px-2 py-1 transition-colors ${
                locale === "ur" ? "bg-primary text-white" : "hover:text-primary"
              }`}
            >
              اردو
            </Link>
          </div>

          {isAuthenticated && user ? (
            <>
            <div className="hidden md:block">
              <NotificationsBell />
            </div>
            <Link
              href={withLocale("services")}
              className="hidden h-9 items-center rounded-lg bg-primary px-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark md:inline-flex"
            >
              {t("bookNow")}
            </Link>
            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                aria-label={firstName}
                onClick={() => setIsProfileOpen((value) => !value)}
                className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                {initials}
              </button>

              {isProfileOpen ? (
                <div
                  role="menu"
                  className="absolute end-0 z-50 mt-2 w-56 rounded-xl border border-border bg-card p-1.5 text-start shadow-lg"
                >
                  <div className="border-b border-border px-3 py-2">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={withLocale(item.href)}
                          role="menuitem"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition hover:bg-background"
                        >
                          <Icon size={17} stroke={1.8} />
                          {t(`menu.${item.label}`)}
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-border pt-1">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm font-medium text-error transition hover:bg-background"
                    >
                      <IconLogout size={17} stroke={1.8} />
                      {t("menu.logout")}
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
            </>
          ) : (
            <div className="hidden items-center gap-1 md:flex">
              <Link
                href={withLocale("login")}
                className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-semibold text-primary transition-colors hover:bg-primary/5"
              >
                {t("login")}
              </Link>
              <Link
                href={withLocale("signup")}
                className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
              >
                {t("signup")}
              </Link>
            </div>
          )}

          <button
            type="button"
            aria-label={t("openMenu")}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(true)}
            className="flex size-9 items-center justify-center rounded-lg text-foreground transition hover:bg-muted md:hidden"
          >
            <IconMenu2 size={22} stroke={1.8} />
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] flex min-h-dvh flex-col bg-background px-5 py-5 transition-transform duration-300 ease-out md:hidden ${
          isMenuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}`}
            onClick={() => setIsMenuOpen(false)}
            className={`font-karigaar text-2xl font-bold text-primary ${
              isRtl ? "ur-brand" : ""
            }`}
            aria-label={t("homeAria")}
          >
            {t("brand")}
          </Link>

          <button
            type="button"
            aria-label={t("closeMenu")}
            onClick={() => setIsMenuOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-card text-foreground"
          >
            <IconX size={24} stroke={1.8} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-7 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={withLocale(link.href)}
              onClick={() => setIsMenuOpen(false)}
              className={`text-4xl font-bold leading-none text-foreground transition-colors hover:text-primary ${
                isRtl ? "ur-nav-link" : ""
              }`}
            >
              {t(`links.${link.label}`)}
            </Link>
          ))}
          {isAuthenticated ? (
            <Link
              href={withLocale("bookings")}
              onClick={() => setIsMenuOpen(false)}
              className={`text-4xl font-bold leading-none text-foreground transition-colors hover:text-primary ${
                isRtl ? "ur-nav-link" : ""
              }`}
            >
              {t("menu.bookings")}
            </Link>
          ) : null}
        </nav>

        <div className="pb-4">
          {isAuthenticated && user ? (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                  {initials}
                </div>
                <div>
                  <p className="text-base font-bold text-foreground">
                    {user.name}
                  </p>
                  <p className="text-sm font-semibold capitalize text-muted-foreground">
                    {user.roles?.[0]}
                  </p>
                </div>
              </div>
              <div className="mb-3 grid gap-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={withLocale(item.href)}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
                    >
                      <Icon size={19} stroke={1.8} />
                      {t(`menu.${item.label}`)}
                    </Link>
                  );
                })}
              </div>
              <Link
                href={withLocale("services")}
                onClick={() => setIsMenuOpen(false)}
                className="mb-3 flex w-full items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white"
              >
                {t("bookNow")}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-error px-5 py-3 text-sm font-bold text-error"
              >
                <IconLogout size={19} stroke={1.8} />
                {t("menu.logout")}
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              <Link
                href={withLocale("login")}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg border border-primary bg-card px-5 py-4 text-center text-base font-bold text-primary"
              >
                {t("login")}
              </Link>
              <Link
                href={withLocale("signup")}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg border border-primary bg-primary px-5 py-4 text-center text-base font-bold text-white"
              >
                {t("signup")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
