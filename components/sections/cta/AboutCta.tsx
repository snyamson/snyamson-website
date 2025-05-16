"use client";
import { motion } from "motion/react";
import { HighlightText, Highlight } from "@/components/ui/highlightText";

export function AboutCta() {
  return (
    <HighlightText>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-[var(--color-foreground)] dark:text-white max-w-full leading-relaxed lg:leading-snug text-center mx-auto text-justify"
      >
        With insomnia, nothing&apos;s real. Everything is far away. Everything
        is a{" "} Everything Everything is far away. Everything Everything is far away. Everythingv Everything is far away. Everything Everything is far away. Everythingng is far away. Everything
        <Highlight className="text-white dark:text-white">
          copy, of a copy, of a copy.
        </Highlight>
      </motion.h1>
    </HighlightText>
  );
}