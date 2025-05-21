"use client";

import React from "react";
import { WebsiteNav } from "@/components/navigation/WebsiteNav";
import { Features } from "@/components/sections/features/Features";
import { RecentProject } from "@/components/sections/projects/RecentProject";
import { RecentArticles } from "@/components/sections/articles/RecentArticles";
import { HeaderText } from "@/components/ui/header-text";
import { SectionWrapper } from "@/components/SectionWrapper";
import { HomeParallax } from "@/components/sections/hero/HomeParallax";
import { SpotlightImplementation } from "@/components/sections/cta/SpotlightImplementation";
import { ContactForm } from "@/components/sections/contact/Contact";

export default function Home() {
  return (
    <main className="min-h-screen w-full">
      <WebsiteNav />
      <HomeParallax />
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
      <SectionWrapper>
        <ContactForm />
      </SectionWrapper>
    </main>
  );
}
