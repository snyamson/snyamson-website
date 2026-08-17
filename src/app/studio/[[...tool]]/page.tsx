import type { Metadata, Viewport } from "next";
import { NextStudio } from "next-sanity/studio";

// `sanity.config.ts` has to live at the project root for the Sanity CLI to
// find it, so it is reached through the `~/*` root alias rather than `@/*`.
import config from "~/sanity.config";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Snyamson Studio",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <NextStudio config={config} />;
}
