import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader, SectionStatement } from "@/components/ui/SectionHeading";
import { resolveIcon } from "@/lib/icons";
import { STAGGER } from "@/lib/motion";
import type { Speciality } from "@/lib/queries";

/**
 * The tinted band from the reference: a bold statement on the left, then a
 * row of icon columns separated by hairlines.
 */
export function WhatIDo({ specialities }: { specialities: Speciality[] }) {
  if (specialities.length === 0) return null;

  return (
    <section
      id="what-i-do"
      className="scroll-mt-24 border-y border-border bg-surface py-[72px] lg:py-[96px]"
    >
      <div className="shell-wide">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2.2fr)] lg:gap-16">
          <div>
            <SectionHeader eyebrow="What I do" />
            <SectionStatement
              className="mt-6"
              statement="Model. Test. Report."
              intro="End-to-end data work, from the field form to the figure a donor signs off on."
            />
          </div>

          <ul className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {specialities.map((item, index) => {
              const Icon = resolveIcon(item.icon);
              return (
                <Reveal
                  as="li"
                  key={item._id}
                  delay={(index % 4) * STAGGER}
                  className="group relative h-full border-l border-border pl-6 lg:pl-8"
                >
                  {/* An ink segment runs down the divider on hover, sitting
                      exactly on the hairline rather than beside it. The
                      column is picked out by its own rule going dark — no
                      new element appears, and nothing shifts. */}
                  <span
                    className="absolute -left-px top-0 h-full w-px origin-top scale-y-0 bg-ink transition-transform duration-[550ms] ease-out group-hover:scale-y-100"
                    aria-hidden
                  />

                  <span className="grid h-11 w-11 place-items-center rounded-card border border-border-strong bg-bg transition-[background-color,transform] duration-[250ms] ease-out group-hover:-translate-y-1 group-hover:bg-sand">
                    <Icon
                      className="h-[19px] w-[19px] text-ink"
                      strokeWidth={1.4}
                      aria-hidden
                    />
                  </span>

                  <h3 className="mt-5 font-body text-[12px] font-semibold uppercase tracking-[0.14em] text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[13px] leading-[1.8] text-muted">
                    {item.description}
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
