import { NextResponse } from "next/server";

import {
  contactAutoReplyEmail,
  contactNotificationEmail,
} from "@/lib/email/templates";

/**
 * Contact form endpoint.
 *
 * Delivery goes through Resend's REST API directly — no SDK, so no extra
 * dependency. Set these in .env.local (see .env.example):
 *
 *   RESEND_API_KEY      re_...          from resend.com/api-keys
 *   CONTACT_TO_EMAIL    where mail lands
 *   CONTACT_FROM_EMAIL  a verified sender on your Resend domain
 *
 * Until RESEND_API_KEY is set the route returns 503 with a clear message
 * rather than pretending the message was sent.
 */

export const runtime = "nodejs";

const MAX = { name: 120, email: 200, projectType: 120, message: 4000 } as const;

/** Deliberately permissive — real validation is the delivery attempt. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  projectType?: unknown;
  message?: unknown;
  /** Honeypot. Real users never see it, so anything here is a bot. */
  company?: unknown;
};

function asString(value: unknown, limit: number): string {
  return typeof value === "string" ? value.trim().slice(0, limit) : "";
}

/**
 * Pull the address out of a sender string. Resend accepts both a bare
 * address and the display form `Name <address>`, so both are valid here;
 * anything else (a bare domain, most commonly) returns null.
 */
function extractAddress(sender: string): string | null {
  const angled = /<([^>]+)>\s*$/.exec(sender);
  const address = (angled ? angled[1] : sender).trim();
  return EMAIL_RE.test(address) ? address : null;
}

export async function POST(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Malformed request." }, { status: 400 });
  }

  // Honeypot: report success so the bot does not learn it was caught.
  if (asString(body.company, 200) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = asString(body.name, MAX.name);
  const email = asString(body.email, MAX.email);
  const projectType = asString(body.projectType, MAX.projectType);
  const message = asString(body.message, MAX.message);

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "Please tell me your name.";
  if (!EMAIL_RE.test(email)) errors.email = "That email address looks incomplete.";
  if (message.length < 10) errors.message = "A sentence or two about the project, please.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // Trimmed: a stray space or line break copied into .env produces an
  // address Resend rejects with an error that names nothing useful.
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) {
    console.warn(
      "[contact] RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL not set — message not delivered.",
    );
    return NextResponse.json(
      { error: "The contact form is not connected yet. Please email me directly." },
      { status: 503 },
    );
  }

  // Caught here rather than at Resend, because the most likely mistake is
  // putting the verified *domain* in CONTACT_FROM_EMAIL instead of a mailbox
  // on it — and Resend's reply for that does not say so.
  const sender = extractAddress(from);
  if (!sender) {
    console.error(
      `[contact] CONTACT_FROM_EMAIL is not an email address: "${from}".\n` +
        `    Use a mailbox on your verified domain, e.g. hello@${from.replace(/^@/, "")}\n` +
        `    or the display form: Snyamson <hello@your-verified-domain>`,
    );
    return NextResponse.json(
      { error: "The contact form is not configured correctly." },
      { status: 503 },
    );
  }
  if (!EMAIL_RE.test(to)) {
    console.error(`[contact] CONTACT_TO_EMAIL is not an email address: "${to}".`);
    return NextResponse.json(
      { error: "The contact form is not configured correctly." },
      { status: 503 },
    );
  }

  const notification = contactNotificationEmail({ name, email, projectType, message });

  /** One Resend send. Returns the error body on failure rather than throwing. */
  async function send(payload: Record<string, unknown>): Promise<string | null> {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return response.ok ? null : await response.text();
  }

  try {
    const failure = await send({
      from,
      to: [to],
      reply_to: email,
      subject: notification.subject,
      html: notification.html,
      text: notification.text,
    });

    if (failure) {
      // Resend's body carries the sender/domain problem, which is the usual
      // cause here — log it rather than guessing.
      console.error("[contact] resend rejected the notification:", failure);
      if (/domain|not verified|verify/i.test(failure)) {
        console.error(
          `    The sending domain must match a verified one exactly.\n` +
            `    Currently sending as: ${sender}\n` +
            `    A subdomain is its own domain to Resend — verifying\n` +
            `    "mail.example.com" does not permit sending from "example.com".\n` +
            `    Check https://resend.com/domains`,
        );
      }
      return NextResponse.json(
        { error: "Message could not be sent. Please email me directly." },
        { status: 502 },
      );
    }
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return NextResponse.json(
      { error: "Message could not be sent. Please email me directly." },
      { status: 502 },
    );
  }

  // The auto-reply is a courtesy, and it goes to an address nobody has
  // verified. If it bounces, the enquiry still reached its destination — so
  // it is sent after the notification succeeds and never fails the request.
  const autoReply = contactAutoReplyEmail({ name, message });
  try {
    const failure = await send({
      from,
      to: [email],
      reply_to: to,
      subject: autoReply.subject,
      html: autoReply.html,
      text: autoReply.text,
    });
    if (failure) console.warn("[contact] auto-reply not delivered:", failure);
  } catch (error) {
    console.warn("[contact] auto-reply failed:", error);
  }

  return NextResponse.json({ ok: true });
}
