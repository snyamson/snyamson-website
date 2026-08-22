"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType } from "react";

import { cn } from "@/lib/cn";
import { EASE, INSTANT, LINE_STAGGER, VIEWPORT } from "@/lib/motion";

type Split = "word" | "char";

type TextRevealProps = {
  /** Plain text. Markup is not supported on purpose — every shard is measured. */
  text: string;
  as?: ElementType;
  /** `char` for short display lines, `word` for anything you would read. */
  split?: Split;
  /** `mount` for above the fold, `view` for everything the reader scrolls to. */
  trigger?: "mount" | "view";
  delay?: number;
  /** Per-shard gap. Long lines want this lower or the tail arrives late. */
  stagger?: number;
  className?: string;
};

/**
 * Type that rises out of its own baseline.
 *
 * Each shard sits in an `overflow-hidden` box and starts fully below it, so
 * the line is uncovered rather than faded in — the letterforms are always at
 * full opacity and full weight, which is what keeps a 168px extralight
 * setting from looking washed out mid-transition.
 *
 * The clip box carries `pb`/`-mb` of the same size: descenders need room
 * below the baseline, but the extra height must not push the following line
 * down, so it is given and then taken back.
 *
 * Accessibility: the shards are decorative fragments, so they are hidden and
 * the whole string is exposed once, on the wrapper. Under reduced motion the
 * markup is unchanged and only the transition collapses — see `INSTANT`.
 */
export function TextReveal({
  text,
  as = "span",
  split = "word",
  trigger = "view",
  delay = 0,
  stagger = LINE_STAGGER,
  className,
}: TextRevealProps) {
  const reduced = useReducedMotion() ?? false;
  const Tag = motion[as as "span"] ?? motion.span;

  // Whitespace is kept as its own shard rather than folded into the word:
  // it must stay outside the clip boxes so the line can still wrap, and a
  // bare space between two inline-blocks is exactly one normal space.
  const shards = split === "char" ? Array.from(text) : text.split(/(\s+)/);

  const group: Variants = {
    hidden: {},
    show: {
      transition: {
        delayChildren: reduced ? 0 : delay,
        staggerChildren: reduced ? 0 : stagger,
      },
    },
  };

  const shard: Variants = {
    hidden: { y: "115%" },
    show: {
      y: "0%",
      transition: reduced ? INSTANT : { duration: 0.85, ease: EASE },
    },
  };

  return (
    <Tag
      aria-label={text}
      className={cn("block", className)}
      variants={group}
      initial="hidden"
      {...(trigger === "mount" || reduced
        ? { animate: "show" }
        : { whileInView: "show", viewport: VIEWPORT })}
    >
      {shards.map((piece, index) => {
        if (/^\s+$/.test(piece)) return <span key={index}> </span>;

        return (
          <span
            key={index}
            aria-hidden
            className="inline-block overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]"
          >
            <motion.span
              data-split-shard
              className="inline-block"
              variants={shard}
            >
              {piece}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
