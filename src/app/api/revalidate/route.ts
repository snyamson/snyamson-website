import { createHmac, timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { SANITY_TAG } from "@/sanity/client";

/**
 * Sanity publish webhook. Clears the content cache tag so an edit is live
 * immediately instead of waiting for the 60s revalidation ceiling.
 *
 * Set up (Sanity → Manage → API → Webhooks):
 *   URL          https://your-domain.com/api/revalidate
 *   Dataset      production
 *   Trigger on   Create, Update, Delete
 *   HTTP method  POST
 *   Secret       the same value as SANITY_REVALIDATE_SECRET in .env
 *
 * Webhooks cannot reach localhost, so this does nothing in local
 * development — there `sanityFetch` skips the cache entirely instead.
 */

export const runtime = "nodejs";

/** Reject replayed deliveries older than this. */
const TOLERANCE_MS = 5 * 60 * 1000;

/**
 * Sanity signs as `t=<unix seconds>,v1=<base64url hmac>` over
 * `${timestamp}.${rawBody}`. Verified here directly rather than pulling in
 * @sanity/webhook for one function.
 */
function isValidSignature(header: string | null, body: string, secret: string) {
  if (!header) return false;

  const parts = new Map(
    header.split(",").map((pair) => {
      const index = pair.indexOf("=");
      return [pair.slice(0, index).trim(), pair.slice(index + 1).trim()] as const;
    }),
  );

  const timestamp = Number(parts.get("t"));
  const signature = parts.get("v1");
  if (!Number.isFinite(timestamp) || !signature) return false;

  // Guard against replay of an old, captured delivery.
  if (Math.abs(Date.now() - timestamp * 1000) > TOLERANCE_MS) return false;

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest("base64url");

  const received = Buffer.from(signature);
  const computed = Buffer.from(expected);
  // timingSafeEqual throws on a length mismatch, so check that first.
  return received.length === computed.length && timingSafeEqual(received, computed);
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.warn("[revalidate] SANITY_REVALIDATE_SECRET is not set — request refused.");
    return NextResponse.json(
      { error: "Revalidation is not configured." },
      { status: 503 },
    );
  }

  // The raw body is required for the signature, so read it as text and parse
  // afterwards — request.json() would discard the exact bytes that were signed.
  const body = await request.text();

  if (!isValidSignature(request.headers.get("sanity-webhook-signature"), body, secret)) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  revalidateTag(SANITY_TAG);

  let documentType: string | undefined;
  try {
    documentType = (JSON.parse(body) as { _type?: string })._type;
  } catch {
    // The payload shape is optional context for the log; a publish is a
    // publish either way, and the cache has already been cleared.
  }

  console.log(`[revalidate] cleared "${SANITY_TAG}"${documentType ? ` (${documentType})` : ""}`);

  return NextResponse.json({ revalidated: true, tag: SANITY_TAG, now: Date.now() });
}
