import { ArrowLink } from "@/components/ui/Buttons";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeading";
import { resolveIcon } from "@/lib/icons";
import { STAGGER } from "@/lib/motion";
import type { Service } from "@/lib/queries";

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="scroll-mt-24 py-[72px] lg:py-[104px]">
      <div className="shell-wide">
        <SectionHeader
          eyebrow="Services"
          note="Take one piece, or the whole chain from field form to signed-off figure."
        />

        {/* A single hairline lattice: cards share edges rather than each
            carrying its own box, which is what keeps the grid this quiet. */}
        <ul className="mt-12 grid border-t border-l border-border sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = resolveIcon(service.icon);
            return (
              <Reveal
                as="li"
                key={service._id}
                delay={(index % 3) * STAGGER}
                className="group relative flex flex-col border-b border-r border-border bg-bg px-8 py-10 transition-colors duration-[250ms] hover:bg-surface"
              >
                <div className="flex items-start justify-between gap-6">
                  <Icon
                    className="h-[24px] w-[24px] text-ink transition-transform duration-[250ms] ease-out group-hover:-translate-y-0.5"
                    strokeWidth={1.3}
                    aria-hidden
                  />
                  <span
                    className="font-display text-[13px] tracking-[0.1em] text-border-strong"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-7 font-display text-[20px] font-medium tracking-[-0.015em] text-ink">
                  {service.title}
                </h3>
                <p className="mt-3 text-[13px] leading-[1.8] text-muted">
                  {service.description}
                </p>

                <div className="mt-8 pt-1">
                  <ArrowLink href={service.ctaHref}>{service.ctaLabel}</ArrowLink>
                </div>

                {/* Sand rule wipes across the card's foot on hover. */}
                <span
                  className="absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-sand-deep transition-transform duration-[400ms] ease-out group-hover:scale-x-100"
                  aria-hidden
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
