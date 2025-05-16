import { RecentArticles } from "@/components/sections/articles/RecentArticles";
import { ContactForm } from "@/components/sections/contact/Contact";
import { AboutCta } from "@/components/sections/cta/AboutCta";
import { Features } from "@/components/sections/features/Features";
import { HomeHero } from "@/components/sections/hero/HomeHero";
import { RecentProject } from "@/components/sections/projects/RecentProject";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Heading } from "@/components/ui/Heading";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      {/* Hero Section */}
      <HomeHero />

      {/* About CTA */}
      <AboutCta />

      {/* Additional content will go here */}
      <SectionWrapper>
        <Heading as="h1" size="xxxx-large">
          I can help you with...
        </Heading>
        <Features />
      </SectionWrapper>

      <SectionWrapper>
        <Heading as="h1" size="xxxx-large">
          Recent Projects
        </Heading>
        <RecentProject />
      </SectionWrapper>

      <SectionWrapper>
        <Heading as="h1" size="xxxx-large">
          Latest Articles
        </Heading>
        <RecentArticles />
      </SectionWrapper>

      <div className="w-full">
        <div className="flex flex-col lg:flex-row">
          {/* Left column - 30% on desktop, full width on mobile */}
          <div
            className="w-full lg:w-3/10 p-6"
            style={{ width: "100%", maxWidth: "100%", flex: "0 0 30%" }}
          >
            <h3 className="text-white">
              Have a project in mind or you want to get in touch with me?
              Contact
            </h3>
          </div>

          {/* Right column - 70% on desktop, full width on mobile */}
          <div className="w-full lg:flex-1 p-6" style={{ flex: "0 0 70%" }}>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
