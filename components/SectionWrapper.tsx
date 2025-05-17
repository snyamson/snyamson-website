import React from "react";
import { cn } from "@/lib/utils";

export function SectionWrapper({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-20 w-full", className)}>
      <div className="max-w-7xl mx-auto">{children}</div>
    </section>
  );
}
