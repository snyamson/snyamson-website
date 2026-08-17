import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonSize = "sm" | "md";

type LinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

/**
 * Primary action: solid ink-teal with warm-sand type — the exact inverse of
 * the page, which is what makes it read as the one thing to press.
 */
export function InkButton({
  href,
  children,
  size = "md",
  className,
}: LinkProps & { size?: ButtonSize }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-full bg-ink font-body font-medium text-sand",
        "transition-[background-color,transform] duration-[250ms] ease-out hover:bg-ink-2 hover:scale-[1.02] active:scale-[0.99]",
        size === "sm" ? "px-5 py-2.5 text-[12px]" : "px-7 py-3.5 text-[13px]",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-out group-hover:translate-x-1"
        strokeWidth={1.75}
        aria-hidden
      />
    </Link>
  );
}

/** Secondary action: sand fill, ink type. Sits beside the primary. */
export function SandButton({
  href,
  children,
  size = "md",
  className,
}: LinkProps & { size?: ButtonSize }) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center justify-center gap-3 rounded-full bg-sand font-body font-medium text-ink",
        "transition-[background-color,transform] duration-[250ms] ease-out hover:bg-sand-deep hover:scale-[1.02] active:scale-[0.99]",
        size === "sm" ? "px-5 py-2.5 text-[12px]" : "px-7 py-3.5 text-[13px]",
        className,
      )}
    >
      {children}
      <ArrowRight
        className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-out group-hover:translate-x-1"
        strokeWidth={1.75}
        aria-hidden
      />
    </Link>
  );
}

/**
 * The nav's top-right action and the "View all projects" link: underlined
 * label with a diagonal arrow, no fill.
 */
export function UnderlineLink({ href, children, className }: LinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-1.5 font-body text-[13px] font-medium text-ink",
        className,
      )}
    >
      {/* Two-layer underline: the ink rule wipes out as the sand one wipes in. */}
      <span className="relative">
        {children}
        <span
          className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-ink transition-transform duration-[350ms] ease-out group-hover:origin-left group-hover:scale-x-0"
          aria-hidden
        />
        <span
          className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-sand-deep transition-transform delay-[150ms] duration-[350ms] ease-out group-hover:scale-x-100"
          aria-hidden
        />
      </span>
      <ArrowUpRight
        className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        strokeWidth={1.5}
        aria-hidden
      />
    </Link>
  );
}

/** Quiet inline action used inside service cards. */
export function ArrowLink({ href, children, className }: LinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-3 font-body text-[12px] font-medium uppercase tracking-[0.14em] text-ink",
        "transition-colors duration-[250ms] hover:text-muted",
        className,
      )}
    >
      {children}
      <span className="relative flex h-px w-[26px] items-center bg-current transition-all duration-[250ms] ease-out group-hover:w-[34px]">
        <ArrowRight
          className="absolute -right-[3px] h-3 w-3"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
    </Link>
  );
}
