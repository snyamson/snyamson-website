"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FooterLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const FooterLink = ({ href, children, className }: FooterLinkProps) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "relative inline-block font-normal text-[var(--foreground)] hover:text-[var(--brand-blue)] transition-colors duration-300",
        "group", // Add group class for hover targeting
        className
      )}
    >
      {children}
      <span className="absolute bottom-0 left-0 h-[1px] w-0 bg-[var(--brand-blue)] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-800/30 py-8 text-[var(--foreground)] mt-25">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
          {/* Social Links - Left */}
          <div className="flex items-center space-x-6 text-sm md:text-base">
            <FooterLink href="https://github.com/snyamson">GitHub</FooterLink>
            <FooterLink href="https://huggingface.co/snyamson">
              Hugging Face
            </FooterLink>
            <FooterLink href="https://linkedin.com/in/snyamson">
              LinkedIn
            </FooterLink>
          </div>

          {/* Middle Content - Center */}
          <div className="flex justify-center items-center text-center text-sm md:text-base font-normal">
            <p>
              Code by{" "}
              <FooterLink href="https://snyamson.com" className="mx-1">
                _snyamson
              </FooterLink>{" "}
              with <span className="text-red-500">❤</span>
            </p>
          </div>

          {/* Copyright - Right */}
          <div className="flex justify-center lg:justify-end text-sm font-normal">
            <p>© {currentYear}, All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
