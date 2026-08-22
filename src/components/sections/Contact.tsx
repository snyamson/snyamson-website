"use client";

import { ChevronDown, Mail, MapPin } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

import { OrbitArcs } from "@/components/ui/Decor";
import { Magnetic } from "@/components/ui/Magnetic";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeading";
import { TextReveal } from "@/components/ui/TextReveal";
import { cn } from "@/lib/cn";
import type { Contact as ContactData, SiteSettings } from "@/lib/queries";

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

/**
 * Focus does three things at once — the hairline goes to ink, a second ink
 * line doubles it, and a warm halo lifts the field off the wash. One of them
 * alone is easy to miss on a page this quiet, and a field you cannot tell is
 * focused is the most common way a form loses someone halfway through.
 */
const FIELD =
  "w-full rounded-card border border-border bg-card px-4 py-3.5 font-body text-[14px] text-ink " +
  "placeholder:text-muted/70 transition-[border-color,box-shadow,background-color] duration-200 " +
  "hover:border-border-strong " +
  "focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink " +
  "focus:shadow-[0_0_0_5px_color-mix(in_oklab,var(--color-sand)_60%,transparent)]";

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 font-body text-[12px] text-ink">
      {children}
    </p>
  );
}

export function Contact({
  contact,
  settings,
}: {
  contact: ContactData;
  settings: SiteSettings;
}) {
  const formId = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setStatus({ state: "sending" });
    setErrors({});

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: Record<string, string>;
      };

      if (response.ok && payload.ok) {
        form.reset();
        setStatus({ state: "sent" });
        return;
      }

      if (payload.errors) setErrors(payload.errors);
      setStatus({
        state: "error",
        message:
          payload.error ??
          "Some details need another look — see the notes above.",
      });
    } catch {
      setStatus({
        state: "error",
        message: "Network error. Please try again, or email me directly.",
      });
    }
  }

  const sending = status.state === "sending";

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden border-t border-border bg-surface py-[72px] lg:py-[104px]"
    >
      <OrbitArcs className="pointer-events-none absolute -left-[180px] top-[80px] hidden h-[380px] w-[380px] opacity-60 xl:block" />

      <div className="shell-wide relative">
        <SectionHeader eyebrow="Contact" />

        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)] lg:gap-16">
          {/* Left: the pitch and the direct routes. */}
          <div>
            <TextReveal
              as="h3"
              text={contact.heading}
              stagger={0.045}
              className="max-w-[420px] font-display text-[30px] font-semibold leading-[1.12] tracking-[-0.02em] text-ink sm:text-[36px]"
            />

            <Reveal delay={0.08}>
              <p className="mt-5 max-w-[420px] text-[14px] leading-[1.8] text-muted">
                {contact.blurb}
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              {/* Conditional for the same reason as the footer: the seed
                  carries no contact details, so an empty value must drop out
                  rather than render an icon beside nothing. */}
              <ul className="mt-9 space-y-4">
                {settings.email ? (
                  <li>
                    <a
                      href={`mailto:${settings.email}`}
                      className="group inline-flex items-center gap-3.5 font-body text-[14px] text-ink"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-card border border-border-strong transition-colors duration-[250ms] group-hover:bg-sand">
                        <Mail className="h-[15px] w-[15px]" strokeWidth={1.5} aria-hidden />
                      </span>
                      <span className="underline-offset-4 group-hover:underline">
                        {settings.email}
                      </span>
                    </a>
                  </li>
                ) : null}
                {settings.address ? (
                  <li className="flex items-center gap-3.5 font-body text-[14px] text-muted">
                    <span className="grid h-9 w-9 place-items-center rounded-card border border-border-strong">
                      <MapPin className="h-[15px] w-[15px] text-ink" strokeWidth={1.5} aria-hidden />
                    </span>
                    {settings.address}
                  </li>
                ) : null}
              </ul>
            </Reveal>

            {contact.availabilityNote ? (
              <Reveal delay={0.2}>
                <div className="mt-10 flex items-start gap-3 rounded-card bg-ink px-5 py-4">
                  {/* A live status light. The ring expands out of the dot
                      rather than the dot changing size — something that
                      reports a state should not itself look unsettled. Only
                      when the answer is yes; an unavailable mark that
                      pulses is drawing attention to a closed door. */}
                  <span className="relative mt-[7px] flex h-2 w-2 shrink-0" aria-hidden>
                    {contact.available ? (
                      <span className="absolute inset-0 rounded-full bg-sand animate-[var(--animate-pulse-node)]" />
                    ) : null}
                    <span
                      className={cn(
                        "relative h-2 w-2 rounded-full",
                        contact.available ? "bg-sand" : "bg-muted",
                      )}
                    />
                  </span>
                  <p className="font-body text-[12px] uppercase leading-[1.6] tracking-[0.12em] text-sand">
                    {contact.availabilityNote}
                  </p>
                </div>
              </Reveal>
            ) : null}
          </div>

          {/* Right: the form. */}
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} noValidate className="grid gap-4">
              {/* Honeypot — off-screen and out of the tab order. */}
              <div className="absolute left-[-9999px]" aria-hidden>
                <label htmlFor={`${formId}-company`}>Company</label>
                <input
                  id={`${formId}-company`}
                  name="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${formId}-name`} className="sr-only">
                    Your name
                  </label>
                  <input
                    id={`${formId}-name`}
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                    className={FIELD}
                  />
                  <FieldError id={`${formId}-name-error`}>{errors.name}</FieldError>
                </div>

                <div>
                  <label htmlFor={`${formId}-email`} className="sr-only">
                    Your email
                  </label>
                  <input
                    id={`${formId}-email`}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="Your email"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? `${formId}-email-error` : undefined}
                    className={FIELD}
                  />
                  <FieldError id={`${formId}-email-error`}>{errors.email}</FieldError>
                </div>
              </div>

              <div className="relative">
                <label htmlFor={`${formId}-type`} className="sr-only">
                  Project type
                </label>
                <select
                  id={`${formId}-type`}
                  name="projectType"
                  defaultValue=""
                  className={cn(FIELD, "appearance-none pr-11")}
                >
                  <option value="" disabled>
                    Project type
                  </option>
                  {contact.projectTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                  strokeWidth={1.5}
                  aria-hidden
                />
              </div>

              <div>
                <label htmlFor={`${formId}-message`} className="sr-only">
                  Tell me about your project
                </label>
                <textarea
                  id={`${formId}-message`}
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell me about your project — what decision does the data have to support?"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? `${formId}-message-error` : undefined}
                  className={cn(FIELD, "resize-y")}
                />
                <FieldError id={`${formId}-message-error`}>{errors.message}</FieldError>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Magnetic>
                  <button
                    type="submit"
                    disabled={sending}
                    className={cn(
                      "inline-flex items-center justify-center gap-3 rounded-full bg-ink px-8 py-3.5",
                      "font-body text-[13px] font-medium uppercase tracking-[0.12em] text-sand",
                      "transition-[background-color,transform,opacity] duration-[250ms] ease-out",
                      "hover:bg-ink-2 hover:scale-[1.02] active:scale-[0.97]",
                      "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100",
                    )}
                  >
                    {sending ? "Sending…" : contact.submitLabel}
                  </button>
                </Magnetic>

                {/* One live region for both outcomes, so a screen reader
                    announces the result without the form losing focus. */}
                <p
                  role="status"
                  aria-live="polite"
                  className="font-body text-[13px] text-ink"
                >
                  {status.state === "sent"
                    ? "Thank you — your message is on its way. I reply within two working days."
                    : status.state === "error"
                      ? status.message
                      : ""}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
