import { ImageResponse } from "next/og";

/**
 * iOS home-screen icon. Generated rather than committed as a binary, so the
 * one place the brand colours are defined stays in code.
 *
 * Apple ignores SVG icons and does not round the corners itself on every
 * OS version, so this is a 180px PNG with its own radius baked in.
 */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#053D3A",
          borderRadius: 40,
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32" fill="none">
          <path
            d="M22 10.5H13.6a2.6 2.6 0 0 0 0 5.2h4.8a2.6 2.6 0 0 1 0 5.2H10"
            stroke="#FFE2B8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    size,
  );
}
