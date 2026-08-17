/**
 * Branded email templates for the contact form.
 *
 * Written as inline-styled tables on purpose. Email clients are not
 * browsers: Outlook renders through Word, Gmail strips <style> blocks and
 * most modern CSS, and flexbox/grid are unreliable everywhere. Tables plus
 * inline styles is the only layout that survives the round trip.
 *
 * Palette matches the site — ink teal #053D3A, warm sand #FFE2B8, paper
 * #FDF7EE — but the typefaces fall back to a system stack, since webfonts
 * are blocked or ignored by most clients.
 */

const INK = "#053D3A";
const SAND = "#FFE2B8";
const PAPER = "#FDF7EE";
const SURFACE = "#F5EDE0";
const BORDER = "#E4D8C6";
const MUTED = "#4C6360";

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export type ContactSubmission = {
  name: string;
  email: string;
  projectType: string;
  message: string;
};

/**
 * Everything below is attacker-controlled text going into an HTML document.
 * Escaping is not optional: without it a submitted message could inject
 * markup or a link into the mail you receive.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape, then convert newlines to <br> so paragraphs survive. */
function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

/** Hidden preview line shown by most clients next to the subject. */
function preheader(text: string): string {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escapeHtml(
    text,
  )}</div>`;
}

/** Outer chrome: paper background, centred 600px card, ink header, footer. */
function shell({
  title,
  preview,
  body,
}: {
  title: string;
  preview: string;
  body: string;
}): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light only" />
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:${PAPER};">
${preheader(preview)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${PAPER};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%;border:1px solid ${BORDER};border-radius:4px;overflow:hidden;background-color:#ffffff;">

        <!-- Header -->
        <tr>
          <td style="background-color:${INK};padding:26px 32px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:${FONT};font-size:17px;font-weight:600;letter-spacing:-0.2px;color:${SAND};">
                  snyamson
                </td>
                <td align="right" style="font-family:${FONT};font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:${SAND};opacity:0.75;">
                  ${escapeHtml(title)}
                </td>
              </tr>
            </table>
          </td>
        </tr>

        ${body}

        <!-- Footer -->
        <tr>
          <td style="background-color:${SURFACE};padding:22px 32px;border-top:1px solid ${BORDER};">
            <p style="margin:0;font-family:${FONT};font-size:11px;line-height:1.6;color:${MUTED};">
              Solomon Nyamson &middot; Analytics engineer &middot; Accra, Ghana
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** One label/value row in the details table. */
function detailRow(label: string, value: string, isLink = false): string {
  const rendered = isLink
    ? `<a href="mailto:${escapeHtml(value)}" style="color:${INK};text-decoration:underline;">${escapeHtml(value)}</a>`
    : escapeHtml(value);

  return `<tr>
    <td style="padding:12px 0;border-bottom:1px solid ${BORDER};font-family:${FONT};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};width:34%;vertical-align:top;">
      ${escapeHtml(label)}
    </td>
    <td style="padding:12px 0;border-bottom:1px solid ${BORDER};font-family:${FONT};font-size:14px;color:${INK};vertical-align:top;">
      ${rendered}
    </td>
  </tr>`;
}

/** The enquiry itself, sent to the site owner. */
export function contactNotificationEmail(submission: ContactSubmission) {
  const { name, email, projectType, message } = submission;

  const subject = `New enquiry — ${name}${projectType ? ` (${projectType})` : ""}`;

  const body = `
    <tr>
      <td style="padding:36px 32px 8px 32px;">
        <p style="margin:0 0 10px 0;font-family:${FONT};font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:${MUTED};">
          New enquiry
        </p>
        <h1 style="margin:0;font-family:${FONT};font-size:28px;line-height:1.2;font-weight:600;letter-spacing:-0.6px;color:${INK};">
          ${escapeHtml(name)}
        </h1>
      </td>
    </tr>

    <tr>
      <td style="padding:24px 32px 0 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${BORDER};">
          ${detailRow("From", name)}
          ${detailRow("Email", email, true)}
          ${projectType ? detailRow("Project type", projectType) : ""}
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:28px 32px 0 32px;">
        <p style="margin:0 0 12px 0;font-family:${FONT};font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:${MUTED};">
          Message
        </p>
        <div style="background-color:${PAPER};border:1px solid ${BORDER};border-radius:3px;padding:20px;font-family:${FONT};font-size:15px;line-height:1.75;color:${INK};">
          ${escapeMultiline(message)}
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding:28px 32px 36px 32px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="background-color:${INK};border-radius:999px;">
              <a href="mailto:${escapeHtml(email)}?subject=${encodeURIComponent(`Re: your enquiry`)}"
                 style="display:inline-block;padding:13px 28px;font-family:${FONT};font-size:13px;font-weight:600;color:${SAND};text-decoration:none;">
                Reply to ${escapeHtml(name)}
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;

  const text = [
    `New enquiry — ${name}`,
    "",
    `From: ${name}`,
    `Email: ${email}`,
    projectType ? `Project type: ${projectType}` : null,
    "",
    message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject,
    text,
    html: shell({
      // Not "New enquiry" — the body already says that, and repeating it in
      // the header bar wastes the one label slot there.
      title: "Contact form",
      preview: `${name}${projectType ? ` · ${projectType}` : ""} — ${message.slice(0, 90)}`,
      body,
    }),
  };
}

/** Confirmation sent back to the person who submitted the form. */
export function contactAutoReplyEmail({
  name,
  message,
}: {
  name: string;
  message: string;
}) {
  const subject = "Thanks — I've got your message";

  const body = `
    <tr>
      <td style="padding:36px 32px 0 32px;">
        <h1 style="margin:0 0 18px 0;font-family:${FONT};font-size:26px;line-height:1.25;font-weight:600;letter-spacing:-0.5px;color:${INK};">
          Thanks, ${escapeHtml(name)}.
        </h1>
        <p style="margin:0 0 16px 0;font-family:${FONT};font-size:15px;line-height:1.8;color:${MUTED};">
          Your message has arrived and I read every one myself. I reply within
          two working days &mdash; usually sooner.
        </p>
        <p style="margin:0;font-family:${FONT};font-size:15px;line-height:1.8;color:${MUTED};">
          If it turns out I am not the right fit for what you need, I will tell
          you that plainly rather than leave you waiting.
        </p>
      </td>
    </tr>

    <tr>
      <td style="padding:28px 32px 0 32px;">
        <p style="margin:0 0 12px 0;font-family:${FONT};font-size:10px;letter-spacing:2.4px;text-transform:uppercase;color:${MUTED};">
          What you sent
        </p>
        <div style="background-color:${PAPER};border:1px solid ${BORDER};border-left:2px solid ${SAND};border-radius:3px;padding:20px;font-family:${FONT};font-size:14px;line-height:1.75;color:${MUTED};">
          ${escapeMultiline(message)}
        </div>
      </td>
    </tr>

    <tr>
      <td style="padding:28px 32px 36px 32px;">
        <p style="margin:0;font-family:${FONT};font-size:14px;line-height:1.75;color:${INK};">
          &mdash; Solomon
        </p>
      </td>
    </tr>`;

  const text = [
    `Thanks, ${name}.`,
    "",
    "Your message has arrived and I read every one myself. I reply within two working days — usually sooner.",
    "",
    "If it turns out I am not the right fit for what you need, I will tell you that plainly rather than leave you waiting.",
    "",
    "What you sent:",
    message,
    "",
    "— Solomon",
  ].join("\n");

  return {
    subject,
    text,
    html: shell({
      title: "Message received",
      preview: "I've got your message and will reply within two working days.",
      body,
    }),
  };
}
