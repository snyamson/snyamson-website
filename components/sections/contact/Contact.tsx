"use client";
import React from "react";
import { BackgroundGradient } from "@/components/ui/gradient-background";
import Image from "next/image";
import { HeaderText } from "@/components/ui/header-text";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function ContactForm() {
  return (
    <div className="flex justify-center">
      <div className="text-left max-w-3xl">
        <BackgroundGradient>
          <Image
            src="https://directus.snyamson.com/assets/1bc3f714-4e7d-42a5-8734-2b1816cf31d8.jpg"
            className="rounded-full"
            style={{ width: "auto", height: "auto" }}
            alt="logo"
            width={120}
            height={120}
          />
        </BackgroundGradient>
        <HeaderText as="h3" size="xxx-large" className="mt-5">
          Have a project in mind? Or you want to say hello, get in touch with
          me.
        </HeaderText>

        <HoverBorderGradient
          containerClassName="rounded-full"
          as="button"
          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        >
          <p>Contact Me</p>
        </HoverBorderGradient>
      </div>
    </div>
  );
}
