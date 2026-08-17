"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { UnderlineLink } from "@/components/ui/Buttons";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { resolveHref } from "@/lib/href";
import { EASE, INSTANT } from "@/lib/motion";
import type { SiteSettings } from "@/lib/queries";

export function Navbar({ settings }: { settings: SiteSettings }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const reduced = useReducedMotion();
  const isHome = usePathname() === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = settings.navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [settings.navLinks]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduced ? INSTANT : { duration: 0.5, ease: EASE }}
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border bg-bg/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="shell-wide flex h-[76px] items-center justify-between">
        <Link href={isHome ? "#home" : "/"} aria-label={settings.logoText}>
          <Logo text={settings.logoText} />
        </Link>

        <nav className="hidden lg:block" aria-label="Primary">
          <ul className="flex items-center gap-10">
            {settings.navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={resolveHref(link.href, isHome)}
                  className={cn(
                    "relative font-body text-[14px] transition-colors duration-300 hover:text-ink",
                    active === link.href ? "text-ink" : "text-muted",
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute -bottom-1.5 left-0 h-px w-full origin-left bg-ink transition-transform duration-300 ease-out",
                      active === link.href ? "scale-x-100" : "scale-x-0",
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          <UnderlineLink href={resolveHref(settings.ctaHref, isHome)} className="hidden sm:inline-flex">
            {settings.ctaLabel}
          </UnderlineLink>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-full border border-border-strong text-ink transition-colors duration-300 hover:bg-sand lg:hidden"
          >
            {open ? (
              <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            ) : (
              <Menu className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            className="overflow-hidden border-t border-border bg-bg lg:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={reduced ? undefined : { height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <ul className="shell-wide flex flex-col py-4">
              {settings.navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveHref(link.href, isHome)}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block border-b border-border py-4 font-display text-[22px] tracking-[-0.01em] transition-colors duration-300 hover:text-ink",
                      active === link.href ? "text-ink" : "text-muted",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-6 sm:hidden">
                <UnderlineLink href={resolveHref(settings.ctaHref, isHome)}>
                  {settings.ctaLabel}
                </UnderlineLink>
              </li>
            </ul>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </motion.header>
  );
}
