import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { cn } from "@/lib/cn";
import type { PortableTextBlocks } from "@/lib/queries";

/**
 * Body copy for the case-study sections. Deliberately narrow: the block
 * editor only offers paragraphs, one heading level, bullets and links, so
 * there is nothing here an editor can reach that is not styled.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[15px] leading-[1.85] text-muted">{children}</p>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 font-display text-[20px] font-medium tracking-[-0.015em] text-ink">
        {children}
      </h3>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="space-y-3">{children}</ul>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="flex gap-3.5 text-[15px] leading-[1.85] text-muted">
        <span
          className="mt-[11px] h-1 w-3 shrink-0 rounded-full bg-sand-deep"
          aria-hidden
        />
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-medium text-ink">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : undefined;
      if (!href) return <>{children}</>;
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
          className="text-ink underline decoration-border-strong underline-offset-4 transition-colors duration-200 hover:decoration-ink"
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({
  value,
  className,
}: {
  value: PortableTextBlocks;
  className?: string;
}) {
  if (!value || value.length === 0) return null;

  return (
    <div className={cn("space-y-5", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
