"use client";

import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { WebsiteNav } from "@/components/navigation/WebsiteNav";

// Spotlight
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { Features } from "@/components/sections/features/Features";
import { RecentProject } from "@/components/sections/projects/RecentProject";
import { RecentArticles } from "@/components/sections/articles/RecentArticles";
import { HeaderText } from "@/components/ui/header-text";
import { SectionWrapper } from "@/components/SectionWrapper";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <WebsiteNav />
      <HeroParallaxDemo />
      <SpotlightImplementation />
      <SectionWrapper>
        <HeaderText as="h2" size="xxxx-large">
          I can help you with...
        </HeaderText>
        <Features />
      </SectionWrapper>

      <SectionWrapper>
        <HeaderText as="h2" size="xxxx-large">
          Recent Projects
        </HeaderText>
        <RecentProject />
      </SectionWrapper>

      <SectionWrapper>
        <HeaderText as="h2" size="xxxx-large">
          Recent Articles
        </HeaderText>
        <RecentArticles />
      </SectionWrapper>
    </main>
  );
}

export function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "Moonbeam",
    link: "https://gomoonbeam.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/moonbeam.png",
  },
  {
    title: "Cursor",
    link: "https://cursor.so",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/cursor.png",
  },
  {
    title: "Rogue",
    link: "https://userogue.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/rogue.png",
  },

  {
    title: "Editorially",
    link: "https://editorially.org",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editorially.png",
  },
  {
    title: "Editrix AI",
    link: "https://editrix.ai",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/editrix.png",
  },
];
export function SpotlightImplementation() {
  return (
    <div className="relative flex h-[25rem] w-full overflow-hidden rounded-md bg-black/[0.96] antialiased md:items-center md:justify-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center pt-20 md:pt-0">
        <h1 className="bg-opacity-50 bg-gradient-to-b from-neutral-50 to-neutral-400 bg-clip-text text-center text-4xl font-bold text-transparent md:text-7xl">
          Data <br /> is the new world oil.
        </h1>
        <div className="mt-4 w-full max-w-3xl text-center text-base font-normal text-neutral-300">
          I transform raw data into clarity, build tools that work harder than
          your coffee, and turn development chaos into measurable results.
          Whether it&apos;s custom data solutions, bulletproof pipelines, or
          strategies that actually scale – I design systems that{" "}
          <PointerHighlight
            rectangleClassName="bg-neutral-200 dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
            pointerClassName="text-yellow-500 h-3 w-3"
            containerClassName="inline-block mr-1"
          >
            <span className="relative z-10 text-xl font-bold">solve</span>,
          </PointerHighlight>
          <PointerHighlight
            rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose"
            pointerClassName="text-blue-500 h-3 w-3"
            containerClassName="inline-block mx-1"
          >
            <span className="relative z-10 text-xl font-bold">simplify </span>
          </PointerHighlight>
          , and
          <PointerHighlight
            rectangleClassName="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 leading-loose"
            pointerClassName="text-green-500 h-3 w-3"
            containerClassName="inline-block ml-1"
          >
            <span className="relative z-10 text-xl font-bold">stick</span>.
          </PointerHighlight>
        </div>
      </div>
    </div>
  );
}
