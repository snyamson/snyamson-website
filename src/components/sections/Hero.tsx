import { HeroContent } from "@/components/sections/HeroContent";
import type { Hero as HeroData } from "@/lib/queries";
import { urlForImage } from "@/sanity/image";

/** Shipped portrait, used until one is uploaded in the Studio. */
const FALLBACK_PORTRAIT = "/hero-portrait.png";

/**
 * Server half of the hero: resolves the Sanity image URL, then hands plain
 * props to the client component that owns the load sequence.
 */
export function Hero({ hero }: { hero: HeroData }) {
  const portraitUrl =
    urlForImage(hero.portrait)?.width(1240).height(1550).url() ?? FALLBACK_PORTRAIT;

  return (
    <HeroContent
      greeting={hero.greeting}
      tagline={hero.tagline}
      railLabel={hero.railLabel}
      stats={hero.stats}
      bio={hero.bio}
      primaryCta={hero.primaryCta}
      secondaryCta={hero.secondaryCta}
      portraitUrl={portraitUrl}
      portraitAlt={hero.portrait?.alt ?? "Solomon Nyamson"}
    />
  );
}
