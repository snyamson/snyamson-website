import { ArrowUp } from "lucide-react";
import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/Reveal";
import { RuleDraw } from "@/components/ui/RuleDraw";
import { resolveHref } from "@/lib/href";
import { resolveSocialIcon } from "@/lib/icons";
import { STAGGER } from "@/lib/motion";
import type { SiteSettings } from "@/lib/queries";

/**
 * The one inverted block on the page: ink teal ground, warm sand type. It
 * closes the document the way the hero opens it.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative overflow-hidden bg-ink text-sand/75">
      <div className="shell-wide relative py-[64px] lg:py-[80px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Reveal>
              <Logo text={settings.logoText} tone="sand" />
              <p className="mt-6 max-w-[420px] text-[14px] leading-[1.85] text-sand/70">
                {settings.footerBlurb}
              </p>
            </Reveal>

            <ul className="mt-9 flex flex-wrap items-center gap-2.5">
              {settings.socials.map((social, index) => {
                const Icon = resolveSocialIcon(social.platform);
                return (
                  <Reveal
                    as="li"
                    key={social.platform}
                    direction="scale"
                    delay={index * STAGGER}
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.platform}
                      className="grid h-10 w-10 place-items-center rounded-full border border-sand/25 text-sand transition-[background-color,border-color,color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-sand hover:bg-sand hover:text-ink"
                    >
                      <Icon className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden />
                    </a>
                  </Reveal>
                );
              })}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
            <Reveal delay={0.06}>
              <nav aria-label="Footer">
                <h2 className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">
                  Navigate
                </h2>
                <ul className="mt-6 space-y-3">
                  {settings.footerLinks.map((link) => (
                    <li key={`${link.label}-${link.href}`}>
                      <Link
                        // The footer renders on every route, so bare anchors are
                        // always resolved against home rather than the current page.
                        href={resolveHref(link.href, false)}
                        className="group inline-flex items-center gap-2 text-[14px] text-sand/70 transition-colors duration-300 hover:text-sand"
                      >
                        {/* A rule that grows out of the link on hover, in place
                            of an underline — the footer is dense, and an
                            underline at this size closes up the leading. */}
                        <span
                          className="h-px w-0 bg-sand transition-[width] duration-300 ease-out group-hover:w-4"
                          aria-hidden
                        />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>

            <Reveal delay={0.12}>
              <div>
                <h2 className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-sand">
                  Get in touch
                </h2>
                {/* Each line is conditional. Contact details are blank in the
                    seed by design — the repository is public — so an empty
                    value has to disappear rather than render a mailto: link
                    pointing at nothing. */}
                <ul className="mt-6 space-y-3 text-[14px] text-sand/70">
                  {settings.email ? (
                    <li>
                      <a
                        href={`mailto:${settings.email}`}
                        className="transition-colors duration-300 hover:text-sand"
                      >
                        {settings.email}
                      </a>
                    </li>
                  ) : null}
                  {settings.phone ? (
                    <li>
                      <a
                        href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                        className="transition-colors duration-300 hover:text-sand"
                      >
                        {settings.phone}
                      </a>
                    </li>
                  ) : null}
                  {settings.address ? <li>{settings.address}</li> : null}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-14">
          <RuleDraw tone="inverse" delay={0.1} />
          <div className="flex flex-col gap-3 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[12px] text-sand/60">{settings.copyright}</p>
            {/* A plain anchor, not a Link to "#home": this renders on every
                route, and "back to top" must mean the top of *this* page. */}
            <a
              href="#"
              className="group inline-flex items-center gap-2.5 text-[12px] uppercase tracking-[0.16em] text-sand/60 transition-colors duration-300 hover:text-sand"
            >
              Back to top
              <span className="grid h-7 w-7 place-items-center overflow-hidden rounded-full border border-sand/25 transition-colors duration-300 group-hover:border-sand">
                {/* Both arrows occupy the same grid cell, so the outgoing one
                    leaves through the top of the circle as its replacement
                    arrives through the bottom. */}
                <ArrowUp
                  className="col-start-1 row-start-1 h-3 w-3 transition-transform duration-[350ms] ease-out group-hover:-translate-y-3.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <ArrowUp
                  className="col-start-1 row-start-1 h-3 w-3 translate-y-3.5 transition-transform duration-[350ms] ease-out group-hover:translate-y-0"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* The wordmark, set once at the scale of the hero greeting and cropped
          by the footer's own edge. It is the page's last line and its quietest
          — sand at 7% is barely above the ink it sits on, so it reads as a
          watermark in the paper rather than as another thing to look at. */}
      <span
        className="pointer-events-none block select-none overflow-hidden text-center font-display text-[clamp(72px,17vw,260px)] font-extralight leading-[0.7] tracking-[-0.05em] text-sand/[0.07]"
        aria-hidden
      >
        {settings.logoText}
      </span>
    </footer>
  );
}
