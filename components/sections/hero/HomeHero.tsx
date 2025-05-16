"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function HomeHero() {
    const images = [
      "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
      "https://assets.aceternity.com/animated-modal.png",
      "https://assets.aceternity.com/animated-testimonials.webp",
      "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
      "https://assets.aceternity.com/github-globe.png",
      "https://assets.aceternity.com/glare-card.png",
      "https://assets.aceternity.com/layout-grid.png",
      "https://assets.aceternity.com/flip-text.png",
      "https://assets.aceternity.com/hero-highlight.png",
      "https://assets.aceternity.com/carousel.webp",
      "https://assets.aceternity.com/placeholders-and-vanish-input.png",
      "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
      "https://assets.aceternity.com/signup-form.png",
      "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
      "https://assets.aceternity.com/spotlight-new.webp",
      "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
      "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
      "https://assets.aceternity.com/tabs.png",
      "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
      "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
      "https://assets.aceternity.com/glowing-effect.webp",
      "https://assets.aceternity.com/hover-border-gradient.png",
      "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
      "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
      "https://assets.aceternity.com/macbook-scroll.png",
      "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
      "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
      "https://assets.aceternity.com/multi-step-loader.png",
      "https://assets.aceternity.com/vortex.png",
      "https://assets.aceternity.com/wobble-card.png",
      "https://assets.aceternity.com/world-map.webp",
    ];
    return (
      <div className="relative h-screen w-full overflow-hidden">
        {/* Background and overlay */}
        <div className="absolute inset-0 z-0">
          {/* overlay */}
          <div className="absolute inset-0 z-10 h-full w-full bg-white/95"  />
          <HeroBackground
            className="pointer-events-none absolute inset-0 h-full w-full z-0"
            images={images}
          />
        </div>
        
        {/* Grid layout */}
        <div className="relative z-20 h-full w-full">
          {/* Top section - 40% on desktop, 55% on mobile */}
          <div className="md:h-[40%] h-[55%] w-full" />
          
          {/* Bottom section - 60% on desktop, 45% on mobile */}
          <div className="md:h-[60%] h-[45%] w-full">
            {/* Desktop layout: horizontal 70/30 split */}
            <div className="hidden md:flex h-full">
              {/* Left 70% of bottom section */}
              <div className="w-[70%] h-full px-10 pb-10 flex flex-col justify-end items-start">
                  <h2 className="text-[14.5625rem] leading-none mb-4">
                   Analytics<br />Engineer
                    </h2>
              </div>
              
              {/* Right 30% of bottom section */}
              <div className="w-[30%] h-full px-10 flex items-start justify-end">
                <p className="text-[1.3125rem] ml-30">
                <span className="font-bold">Orchestrate. Automate. Visualize</span>
                <br />
                End-to-End Data Solutions for Scalable Development & Research
                </p>
                </div>

            </div>
            
            {/* Mobile layout: vertical split for the 45% bottom section */}
            <div className="flex flex-col h-full md:hidden">
              {/* Bottom-top section (30% of total height = ~67% of the 45% bottom section) */}
              <div className="h-[67%] w-full bg-white p-4 flex items-center justify-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Bottom-Top Section</h2>
                  <p className="text-sm text-gray-600">30% of total mobile height</p>
                </div>
              </div>
              
              {/* Bottom-down section (15% of total height = ~33% of the 45% bottom section) */}
              <div className="h-[33%] w-full bg-white/90 p-4 flex items-center justify-center border-t border-gray-200">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Bottom-Down Section</h2>
                  <p className="text-xs text-gray-600">15% of total mobile height</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


// Hero Backhround
export const HeroBackground = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  // Split the images array into 4 equal parts
  const chunkSize = Math.ceil(images.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return images.slice(start, start + chunkSize);
  });
  return (
    <div
      className={cn(
        "mx-auto block h-full overflow-hidden rounded-2xl max-sm:h-100",
        className,
      )}
    >
      <div className="flex size-full items-center justify-center">
        <div className="size-[1720px] shrink-0 scale-50 sm:scale-75 lg:scale-100">
          <div
            style={{
              transform: "rotateX(55deg) rotateY(0deg) rotateZ(-45deg)",
            }}
            className="relative top-96 right-[50%] grid size-full origin-top-left grid-cols-4 gap-8 transform-3d"
          >
            {chunks.map((subarray, colIndex) => (
              <motion.div
                animate={{ y: colIndex % 2 === 0 ? 100 : -100 }}
                transition={{
                  duration: colIndex % 2 === 0 ? 10 : 15,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                key={colIndex + "marquee"}
                className="flex flex-col items-start gap-8"
              >
                <GridLineVertical className="-left-4" offset="80px" />
                {subarray.map((image, imageIndex) => (
                  <div className="relative" key={imageIndex + image}>
                    <GridLineHorizontal className="-top-4" offset="20px" />
                    <motion.img
                      whileHover={{
                        y: -10,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: "easeInOut",
                      }}
                      key={imageIndex + image}
                      src={image}
                      alt={`Image ${imageIndex + 1}`}
                      className="aspect-[970/700] rounded-lg object-cover ring ring-gray-950/5 hover:shadow-2xl"
                      width={970}
                      height={700}
                    />
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "1px",
          "--width": "5px",
          "--fade-stop": "90%",
          "--offset": offset || "200px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_right,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#ffffff",
          "--color": "rgba(0, 0, 0, 0.2)",
          "--height": "5px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px", //-100px if you want to keep the line inside
          "--color-dark": "rgba(255, 255, 255, 0.2)",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "z-30",
        "dark:bg-[linear-gradient(to_bottom,var(--color-dark),var(--color-dark)_50%,transparent_0,transparent)]",
        className,
      )}
    ></div>
  );
};

  