import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { createElement, type ReactElement } from "react";

import { cvToHtml } from "@/lib/cvHtml";
import { CvPdf } from "@/lib/cvPdf";
import { cvFileName, getCv } from "@/lib/getCv";

/**
 * Serves the CV as a downloadable file in either format.
 *
 * One route rather than two so the `Content-Disposition` handling, the
 * filename and the data source stay in one place — the download and the page
 * cannot drift apart because both read through getCv().
 */

// @react-pdf/renderer needs Node APIs; it cannot run on the edge runtime.
export const runtime = "nodejs";

const FORMATS = ["pdf", "html"] as const;
type Format = (typeof FORMATS)[number];

function isFormat(value: string | null): value is Format {
  return value !== null && (FORMATS as readonly string[]).includes(value);
}

export async function GET(request: Request) {
  const requested = new URL(request.url).searchParams.get("format");
  const format: Format = isFormat(requested) ? requested : "pdf";

  let cv;
  try {
    cv = await getCv();
  } catch (error) {
    console.error("[cv] could not load CV content:", error);
    return NextResponse.json({ error: "CV is unavailable." }, { status: 500 });
  }

  const filename = cvFileName(cv.profile, format);
  // Quoted for spaces, and RFC 5987 encoded so non-ASCII names survive.
  const disposition = `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`;

  if (format === "html") {
    return new NextResponse(cvToHtml(cv), {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": disposition,
        "Cache-Control": "no-store",
      },
    });
  }

  try {
    // createElement rather than JSX so this stays a plain `route.ts`.
    //
    // The cast is unavoidable: renderToBuffer is typed to take a
    // ReactElement<DocumentProps>, which only <Document> itself satisfies —
    // any wrapper component carrying its own props fails the check. CvPdf
    // does return a <Document>, so this is a signature quirk rather than a
    // real mismatch.
    const element = createElement(CvPdf, { cv }) as ReactElement<DocumentProps>;
    const buffer = await renderToBuffer(element);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[cv] PDF generation failed:", error);
    return NextResponse.json(
      { error: "Could not generate the PDF. Try the HTML version." },
      { status: 500 },
    );
  }
}
