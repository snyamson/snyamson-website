"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";

import { InkButton, UnderlineLink } from "@/components/ui/Buttons";
import { Counter } from "@/components/ui/Counter";
import { RailLabel } from "@/components/ui/Decor";
import { HeroPortrait } from "@/components/ui/HeroPortrait";
import { Magnetic } from "@/components/ui/Magnetic";
import { TextReveal } from "@/components/ui/TextReveal";
import { EASE, INSTANT, PHYSICS_SCROLL, REVEAL_OFFSET, STAGGER } from "@/lib/motion";
import type { Cta, HeroStat } from "@/lib/queries";

type HeroContentProps = {
  greeting: string;
  tagline: string;
  railLabel: string;
  stats: HeroStat[];
  bio: string;
  primaryCta: Cta;
  secondaryCta: Cta;
  portraitUrl: string;
  portraitAlt: string;
};

/* Page-load sequence: the nav lands first (see Navbar), then these text
   lines stagger up, then the portrait. */
const TEXT_START = 0.2;
const PORTRAIT_DELAY = TEXT_START + STAGGER * 3;

/* The greeting is the one line split into characters. At 168px it is the
   slowest thing on screen, so it starts a beat after the stats rather than
   after the whole stack, and finishes with everything else. */
const GREETING_DELAY = TEXT_START + STAGGER;

/* Reduced motion keeps the identical variant names and hidden states — only
   the timings collapse to zero, so the SSR and first client render agree. */
const textGroupFor = (reduced: boolean): Variants => ({
  hidden: {},
  show: {
    transition: {
      delayChildren: reduced ? 0 : TEXT_START,
      staggerChildren: reduced ? 0 : STAGGER,
    },
  },
});

const textLineFor = (reduced: boolean): Variants => ({
  hidden: { opacity: 0, y: REVEAL_OFFSET },
  show: {
    opacity: 1,
    y: 0,
    transition: reduced ? INSTANT : { duration: 0.65, ease: EASE },
  },
});

/** "+40" sets the sign small and raised, the figure large and light. */
function Stat({ stat, reduced }: { stat: HeroStat; reduced: boolean }) {
  const [, sign, figure] = /^(\D*)(.*)$/.exec(stat.value) ?? ["", "", stat.value];

  return (
    <div>
      <p className="font-display text-[40px] font-light leading-none tracking-[-0.03em] text-ink sm:text-[48px]">
        <span className="align-top text-[20px] sm:text-[24px]">{sign}</span>
        {/* Tabular figures: without them the glyph widths change on every
            frame of the count and the label under it shifts sideways. */}
        <Counter value={figure} className="tabular-nums" />
      </p>
      <p className="mt-3 font-body text-[12px] leading-snug text-muted">
        {stat.label}
      </p>
      {/* A rule that draws itself under the figure, so the pair reads as two
          entries in a table rather than two loose numbers. */}
      <motion.span
        className="mt-4 block h-px w-full max-w-[132px] origin-left bg-border-strong"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={
          reduced ? INSTANT : { duration: 0.9, delay: TEXT_START + 0.3, ease: EASE }
        }
        aria-hidden
      />
    </div>
  );
}

export function HeroContent({
  greeting,
  tagline,
  railLabel,
  stats,
  bio,
  primaryCta,
  secondaryCta,
  portraitUrl,
  portraitAlt,
}: HeroContentProps) {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);

  const textGroup = textGroupFor(reduced);
  const textLine = textLineFor(reduced);

  /* Scrolling away from the hero: the portrait drifts down and grows while
     the copy lifts and dims, so the fold parts in layers instead of sliding
     off as one board. Every range starts at its identity value, which is
     what the server renders — see Parallax for why that matters. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const exit = useSpring(scrollYProgress, PHYSICS_SCROLL);

  const portraitY = useTransform(exit, [0, 1], [0, reduced ? 0 : 90]);
  const portraitScale = useTransform(exit, [0, 1], [1, reduced ? 1 : 1.06]);
  const copyY = useTransform(exit, [0, 1], [0, reduced ? 0 : -70]);
  const copyFade = useTransform(exit, [0, 0.75], [1, reduced ? 1 : 0.25]);

  return (
    /* The hero claims the viewport minus the 76px nav. Without this the
       section is only as tall as the portrait, the next section's heading
       creeps above the fold, and the scroll hint ends up marking the middle
       of the page instead of its bottom edge. */
    <section
      id="home"
      ref={sectionRef}
      className="relative flex flex-col overflow-hidden lg:min-h-[calc(100svh-76px)]"
    >
      {/* Left rail: rotated label at the top, the year at the foot — the
          year sits on the same baseline as the scroll hint, which is what
          makes the rail read as a frame rather than a stray mark. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[76px] flex-col items-center justify-between pb-12 pt-14 xl:flex">
        {railLabel ? <RailLabel>{railLabel}</RailLabel> : <span />}
        <span className="font-body text-[11px] tracking-[0.2em] text-muted">
          {new Date().getFullYear()}
        </span>
      </div>

      {/* The rail is absolutely positioned at the viewport's left edge, so
          the copy has to be pushed clear of it. `shell-wide` maxes out at
          1440px, which means between the xl breakpoint and that width there
          is no side margin for the rail to live in — without this the label
          runs straight through the first stat. */}
      <div className="shell-wide relative flex flex-1 flex-col xl:pl-[96px]">
        <div className="grid flex-1 gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] lg:gap-x-12">
          <motion.div
            className="relative z-10 order-1 flex flex-col justify-center pt-6 lg:pt-0"
            variants={textGroup}
            initial="hidden"
            animate="show"
            style={{ y: copyY, opacity: copyFade }}
          >
            {stats.length > 0 ? (
              <motion.div className="flex gap-12 sm:gap-16" variants={textLine}>
                {stats.map((stat) => (
                  <Stat key={stat.label} stat={stat} reduced={reduced} />
                ))}
              </motion.div>
            ) : null}

            {/* Split per character. One short word at this size is the whole
                masthead, and letters arriving in sequence is the difference
                between a page that opened and a page that was already there. */}
            <TextReveal
              as="h1"
              text={greeting}
              split="char"
              trigger="mount"
              delay={GREETING_DELAY}
              stagger={0.07}
              className="mt-12 font-display text-[clamp(76px,13vw,168px)] font-extralight leading-[0.9] tracking-[-0.045em] text-ink lg:mt-14"
            />

            <motion.p
              className="mt-6 flex items-center gap-4 font-body text-[15px] text-ink"
              variants={textLine}
            >
              {/* The rule draws out to meet the line rather than appearing
                  beside it already finished. */}
              <motion.span
                className="h-px w-8 shrink-0 origin-left bg-ink"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={
                  reduced
                    ? INSTANT
                    : { duration: 0.7, delay: GREETING_DELAY + 0.35, ease: EASE }
                }
                aria-hidden
              />
              {tagline}
            </motion.p>

            <motion.p
              className="mt-8 max-w-[500px] text-[14px] leading-[1.85] text-muted"
              variants={textLine}
            >
              {bio}
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-x-9 gap-y-5"
              variants={textLine}
            >
              <Magnetic>
                <InkButton href={primaryCta.href}>{primaryCta.label}</InkButton>
              </Magnetic>
              <UnderlineLink href={secondaryCta.href}>
                {secondaryCta.label}
              </UnderlineLink>
            </motion.div>
          </motion.div>

          {/* Portrait. It stretches to the full height of the hero and runs
              to the viewport edge on wide screens — the feathered edges mean
              the overflow crop is never visible. */}
          <motion.div
            className="relative order-2 h-[440px] w-full sm:h-[540px] lg:h-auto lg:min-h-[540px]"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={
              reduced ? INSTANT : { duration: 0.9, delay: PORTRAIT_DELAY, ease: EASE }
            }
          >
            <motion.div
              className="absolute inset-0 lg:-right-8 xl:-right-[7vw]"
              style={{ y: portraitY, scale: portraitScale, willChange: "transform" }}
            >
              <HeroPortrait src={portraitUrl} alt={portraitAlt} treatment="plain" />
            </motion.div>
          </motion.div>
        </div>

        {/* Pinned to the foot of the hero, level with the year on the rail.
            A scroll hint that does not sit on the fold's bottom edge is
            pointing at nothing. It fades on the same value as the copy, so
            it is gone by the time it would be pointing backwards. */}
        <motion.a
          href="#work"
          className="group relative z-10 hidden w-fit items-center gap-3 pb-12 font-body text-[12px] uppercase tracking-[0.18em] text-muted transition-colors duration-300 hover:text-ink lg:inline-flex"
          initial={{ opacity: 0, y: REVEAL_OFFSET }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reduced ? INSTANT : { duration: 0.6, delay: PORTRAIT_DELAY, ease: EASE }
          }
        >
          Scroll down
          <ArrowDown
            className="h-3.5 w-3.5 animate-[var(--animate-scroll-hint)]"
            strokeWidth={1.5}
            aria-hidden
          />
        </motion.a>
      </div>
    </section>
  );
}
