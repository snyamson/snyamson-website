import { UnderlineLink } from "@/components/ui/Buttons";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeading";
import { STAGGER } from "@/lib/motion";
import type { Project } from "@/lib/queries";

export function FeaturedWork({ projects }: { projects: Project[] }) {
  // The query already sorts newest year first, so the four most recent
  // projects surface here automatically as work is published.
  const shown = projects.slice(0, 4);

  if (shown.length === 0) return null;

  return (
    <section id="work" className="scroll-mt-24 py-[72px] lg:py-[104px]">
      <div className="shell-wide">
        <SectionHeader
          eyebrow="Selected work"
          action={<UnderlineLink href="/work">View all projects</UnderlineLink>}
        />

        <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((project, index) => (
            <Reveal as="li" key={project._id} delay={(index % 4) * STAGGER}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
