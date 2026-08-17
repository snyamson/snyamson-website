import { ImageResponse } from "next/og";

import { cvProfileQuery, type CvProfile } from "@/lib/cv";
import { seedCvProfile } from "@/lib/cvSeed";
import { sanityFetch } from "@/sanity/client";

/**
 * The card shown when the site is linked on LinkedIn, X, Slack, WhatsApp or
 * in a Google preview. Without one, platforms fall back to a bare URL.
 *
 * Built from the live CV profile so the headline can never contradict the
 * site, and drawn in the brand palette rather than screenshotting the page.
 *
 * 1200×630 is the size every major platform crops from.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Solomon Nyamson — Development economist, monitoring and evaluation";

export default async function OpengraphImage() {
  const profile = await sanityFetch<CvProfile>(cvProfileQuery, seedCvProfile);
  const name = profile.fullName || seedCvProfile.fullName;
  const headline = profile.headline || seedCvProfile.headline;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FDF7EE",
          padding: "72px 80px",
        }}
      >
        {/* Mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#053D3A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
              <path
                d="M22 10.5H13.6a2.6 2.6 0 0 0 0 5.2h4.8a2.6 2.6 0 0 1 0 5.2H10"
                stroke="#FFE2B8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ fontSize: 26, color: "#053D3A", letterSpacing: -0.4 }}>
            snyamson
          </div>
        </div>

        {/* Name and headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 1.02,
              letterSpacing: -3.5,
              color: "#053D3A",
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 26,
              fontSize: 30,
              lineHeight: 1.4,
              color: "#4C6360",
              maxWidth: 900,
            }}
          >
            {headline}
          </div>
        </div>

        {/* Foot rule */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 120, height: 4, background: "#053D3A" }} />
          <div style={{ width: 44, height: 4, background: "#F0C177" }} />
        </div>
      </div>
    ),
    size,
  );
}
