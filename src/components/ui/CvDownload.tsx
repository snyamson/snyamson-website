"use client";

import { ArrowDown, Download, X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import { cn } from "@/lib/cn";

type Format = "pdf" | "html";

const FORMATS: { value: Format; label: string; note: string }[] = [
  {
    value: "pdf",
    label: "PDF",
    note: "A4, print-ready, selectable text. What most applications ask for.",
  },
  {
    value: "html",
    label: "HTML",
    note: "One self-contained file. Opens in any browser, works offline.",
  },
];

/**
 * Download dialog. Kept as a real modal rather than a bare select so the
 * choice comes with an explanation — "PDF or HTML" means nothing to most
 * people without one.
 */
export function CvDownload() {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<Format>("pdf");
  const [busy, setBusy] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const close = useCallback(() => {
    setOpen(false);
    // Send focus back where it came from, or a keyboard user is stranded at
    // the top of the document.
    openerRef.current?.focus();
  }, []);

  /* Escape closes; Tab is trapped inside while it is open. */
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], select, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the panel itself, so a screen reader announces the dialog before
    // its controls.
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  function download() {
    setBusy(true);
    // A plain navigation, not fetch + blob: the server already sends
    // Content-Disposition, so the browser handles the save natively and
    // nothing has to be held in memory.
    window.location.href = `/api/cv/download?format=${format}`;
    // The page does not navigate, so the button has to be released on a
    // timer — there is no load event for a download.
    window.setTimeout(() => {
      setBusy(false);
      setOpen(false);
    }, 1500);
  }

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group inline-flex items-center justify-center gap-3 rounded-full bg-ink px-7 py-3.5",
          "font-body text-[13px] font-medium text-sand",
          "transition-[background-color,transform] duration-[250ms] ease-out",
          "hover:bg-ink-2 hover:scale-[1.02] active:scale-[0.99]",
        )}
      >
        Download CV
        <Download
          className="h-3.5 w-3.5 transition-transform duration-[250ms] ease-out group-hover:translate-y-0.5"
          strokeWidth={1.75}
          aria-hidden
        />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-[95] grid place-items-center p-5"
          role="presentation"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={close}
            className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px]"
          />

          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className="relative w-full max-w-[440px] rounded-card border border-border bg-bg p-7 shadow-[0_30px_80px_-40px_rgba(5,61,58,0.55)] outline-none sm:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="eyebrow">Download</p>
                <h2
                  id={titleId}
                  className="mt-3 font-display text-[24px] font-medium tracking-[-0.02em] text-ink"
                >
                  Choose a format
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label="Close dialog"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border-strong text-ink transition-colors duration-300 hover:bg-sand"
              >
                <X className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </button>
            </div>

            {/* Radios, not a <select>: two options with an explanation each
                read better open than collapsed behind a dropdown. */}
            <fieldset className="mt-7 border-0 p-0">
              <legend className="sr-only">File format</legend>
              <div className="space-y-3">
                {FORMATS.map((option) => {
                  const active = format === option.value;
                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-card border p-4 transition-colors duration-200",
                        active
                          ? "border-ink bg-surface"
                          : "border-border hover:border-border-strong",
                      )}
                    >
                      <input
                        type="radio"
                        name="cv-format"
                        value={option.value}
                        checked={active}
                        onChange={() => setFormat(option.value)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-colors duration-200",
                          active ? "border-ink" : "border-border-strong",
                        )}
                        aria-hidden
                      >
                        {active ? (
                          <span className="h-2 w-2 rounded-full bg-ink" />
                        ) : null}
                      </span>
                      <span>
                        <span className="block font-body text-[14px] font-medium text-ink">
                          {option.label}
                        </span>
                        <span className="mt-1 block font-body text-[13px] leading-[1.6] text-muted">
                          {option.note}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={download}
              disabled={busy}
              className={cn(
                "mt-7 inline-flex w-full items-center justify-center gap-3 rounded-full bg-ink px-7 py-3.5",
                "font-body text-[13px] font-medium uppercase tracking-[0.12em] text-sand",
                "transition-[background-color,opacity] duration-[250ms] hover:bg-ink-2",
                "disabled:cursor-not-allowed disabled:opacity-60",
              )}
            >
              {busy ? "Preparing…" : `Download ${format.toUpperCase()}`}
              {busy ? null : (
                <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
              )}
            </button>

            <p className="mt-4 text-center font-body text-[12px] text-muted">
              Generated from the live CV — always current.
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
