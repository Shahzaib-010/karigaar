"use client";

import {
  IconChevronDown,
  IconClipboardList,
  IconHeart,
  IconLogout,
  IconMenu2,
  IconSettings,
  IconUser,
  IconX,
} from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "home", href: "/" },
  { label: "browseWorkers", href: "workers" },
  { label: "services", href: "services" },
  { label: "postJob", href: "post-a-job" },
] as const;

const menuItems = [
  { label: "profile", icon: IconUser, href: "profile" },
  { label: "bookings", icon: IconClipboardList, href: "bookings" },
  { label: "savedWorkers", icon: IconHeart, href: "saved-workers" },
  { label: "settings", icon: IconSettings, href: "settings" },
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
            className="h-8 w-auto sm:h-20"
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
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <div
            className="flex h-10 items-center rounded-xl border border-border bg-background p-1 text-xs font-bold text-muted-foreground sm:text-sm"
            aria-label={t("language")}
          >
            <Link
              href="/en"
              className={`rounded-lg px-2.5 py-1.5 transition-colors sm:px-3 ${
                locale === "en"
                  ? "bg-primary text-white"
                  : "hover:text-primary"
              }`}
            >
              EN
            </Link>
            <span className="px-0.5 text-border sm:px-1">/</span>
            <Link
              href="/ur"
              className={`rounded-lg px-2.5 py-1.5 transition-colors sm:px-3 ${
                locale === "ur"
                  ? "bg-primary text-white"
                  : "hover:text-primary"
              }`}
            >
              اردو
            </Link>
          </div>

          {isAuthenticated && user ? (
            <div ref={profileRef} className="relative hidden md:block">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((value) => !value)}
                className="flex h-11 items-center gap-2 rounded-xl border border-border bg-card pe-3 ps-1.5 text-sm font-bold text-foreground transition hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                  {initials}
                </span>
                <span>{firstName}</span>
                <IconChevronDown size={18} stroke={1.8} />
              </button>

              {isProfileOpen ? (
                <div
                  role="menu"
                  className="absolute end-0 z-50 mt-3 w-64 rounded-xl border border-border bg-card p-2 text-start"
                >
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={withLocale(item.href)}
                        role="menuitem"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
                      >
                        <Icon size={19} stroke={1.8} />
                        {t(`menu.${item.label}`)}
                      </Link>
                    );
                  })}
                  <div className="my-2 border-t border-border" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm font-bold text-error transition hover:bg-background"
                  >
                    <IconLogout size={19} stroke={1.8} />
                    {t("menu.logout")}
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href={withLocale("login")}
                className="rounded-lg border border-primary bg-card px-4 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
              >
                {t("login")}
              </Link>
              <Link
                href={withLocale("signup")}
                className="rounded-lg border border-primary bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
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
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground md:hidden"
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
                  <p className="text-sm font-semibold text-muted-foreground">
                    {user.role}
                  </p>
                </div>
              </div>
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
