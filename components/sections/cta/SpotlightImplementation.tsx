"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import { PointerHighlight } from "@/components/ui/pointer-highlight";

export function SpotlightImplementation() {
  return (
    <div className="relative flex h-[25rem] w-full overflow-hidden rounded-md bg-black/[0.96] antialiased items-center justify-center">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 [background-size:40px_40px] select-none",
          "[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]"
        )}
      />

      <Spotlight
        className="-top-1/4 left-0 md:-top-20 md:left-60"
        fill="white"
      />
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
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
