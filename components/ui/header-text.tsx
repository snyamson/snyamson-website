import { cn } from "@/lib/utils";
import React from "react";

interface HeaderTextProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?:
    | "xxxxx-large"
    | "xxxx-large"
    | "xxx-large"
    | "xx-large"
    | "x-large"
    | "large"
    | "medium"
    | "normal";
  className?: string;
}

export function HeaderText({
  children,
  as: Component = "h2",
  size = "xxxxx-large",
  className,
}: HeaderTextProps) {
  // Map WordPress font sizes to Tailwind classes
  const sizeClasses = {
    "xxxxx-large": "text-[clamp(2.25rem,2.25rem+((1vw-0.2rem)*4.688),6rem)]",
    "xxxx-large": "text-[clamp(3rem,3vw+2rem,4.22rem)]",
    "xxx-large": "text-[clamp(2rem,2rem+((1vw-0.2rem)*0.313),2.25rem)]",
    "xx-large": "text-[clamp(1.75rem,1.75rem+((1vw-0.2rem)*0.156),1.875rem)]",
    "x-large": "text-[1.5rem]",
    large: "text-[1.3125rem]",
    medium: "text-[1.125rem]",
    normal: "text-[1rem]",
  };

  return (
    <Component
      className={cn(
        "font-normal tracking-[-0.011em] text-[var(--foreground)] pb-10",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </Component>
  );
}
