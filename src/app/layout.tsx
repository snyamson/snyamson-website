import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";

import { Loader } from "@/components/ui/Loader";
import { RouteTransition } from "@/components/ui/RouteTransition";
import { StagingBadge } from "@/components/ui/StagingBadge";
import { isStaging, siteUrl } from "@/sanity/env";

import "./globals.css";

/* Neo-grotesque for display, so the very light large settings ("Hello" at
   200) hold their shape the way the reference layout does. */
const interTight = Inter_Tight({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
  variable: "--font-inter-tight",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  // Read from the environment rather than hard-coded, so staging and preview
  // deploys generate canonical and OG URLs that point at themselves instead
  // of at production.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Solomon Nyamson — Analytics Engineer",
    template: "%s | Solomon Nyamson",
  },
  description:
    "Analytics engineer specialising in monitoring & evaluation, humanitarian data analysis and ESG reporting.",
  openGraph: {
    title: "Solomon Nyamson — Analytics Engineer",
    description:
      "Monitoring & evaluation, humanitarian data analysis and ESG reporting, built as tested data pipelines.",
    type: "website",
  },
  // Belt and braces alongside robots.ts: a stray link into staging should
  // not put draft content into anyone's index.
  ...(isStaging
    ? { robots: { index: false, follow: false, nocache: true } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    /* Browser extensions (password managers, grammar tools, translators)
       stamp attributes onto <html> before React hydrates, which React then
       reports as a mismatch. This suppresses that — and only that: React
       applies suppressHydrationWarning one level deep, to this element's own
       attributes, so genuine mismatches anywhere inside still surface. */
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Reveal wrappers ship their pre-animation state inline, and the
            loader is an opaque overlay only JS can dismiss. Without JS
            nothing would ever clear either, so neutralise both. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important;}[data-reveal-clip]{clip-path:none !important;}[data-split-shard]{transform:none !important;}[data-loader],[data-route-transition]{display:none !important;}`}</style>
        </noscript>
      </head>
      <body>
        <Loader />
        <RouteTransition />
        {children}
        {/* Above everything, including the loader: the grain belongs to the
            sheet, and a sheet does not stop being paper while it loads. */}
        <div className="grain" aria-hidden />
        <StagingBadge />

        {/* Production only. Staging is a real deployment serving draft
            content to whoever is reviewing it, and its page views are not
            page views — counting them would put internal traffic in the
            same number as the audience. Drop the condition if you would
            rather see staging in the figures. */}
        {isStaging ? null : <Analytics />}
      </body>
    </html>
  );
}
