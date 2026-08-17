import Link from "next/link";

import { Logo } from "@/components/ui/Logo";
import { resolveHref } from "@/lib/href";
import { resolveSocialIcon } from "@/lib/icons";
import type { SiteSettings } from "@/lib/queries";

/**
 * The one inverted block on the page: ink teal ground, warm sand type. It
 * closes the document the way the hero opens it.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="bg-ink text-sand/75">
      <div className="shell-wide py-[64px] lg:py-[80px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
          <div>
            <Logo text={settings.logoText} tone="sand" />
            <p className="mt-6 max-w-[420px] text-[14px] leading-[1.85] text-sand/70">
              {settings.footerBlurb}
            </p>

            <ul className="mt-9 flex flex-wrap items-center gap-2.5">
              {settings.socials.map((social) => {
                const Icon = resolveSocialIcon(social.platform);
                return (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={social.platform}
                      className="grid h-10 w-10 place-items-center rounded-full border border-sand/25 text-sand transition-colors duration-300 hover:border-sand hover:bg-sand hover:text-ink"
                    >
                      <Icon className="h-[16px] w-[16px]" strokeWidth={1.5} aria-hidden />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="grid gap-10 sm:grid-cols-2">
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
                      className="text-[14px] text-sand/70 transition-colors duration-300 hover:text-sand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

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
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-sand/15 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-sand/60">{settings.copyright}</p>
          {/* A plain anchor, not a Link to "#home": this renders on every
              route, and "back to top" must mean the top of *this* page. */}
          <a
            href="#"
            className="text-[12px] uppercase tracking-[0.16em] text-sand/60 transition-colors duration-300 hover:text-sand"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
