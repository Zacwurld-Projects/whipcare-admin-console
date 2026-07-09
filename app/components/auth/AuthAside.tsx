"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const HERO_IMAGES = ["/images/auth-hero.png", "/images/auth_hero_2.png"];
const FADE_DURATION_MS = 1000;
const INTERVAL_MS = 12000;

export function AuthAside() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative hidden h-full w-full p-8 lg:block lg:p-10">
      <div className="relative h-full w-full overflow-hidden rounded-3xl">
        {HERO_IMAGES.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="Admin working at a desk"
            fill
            className={`object-contain transition-opacity duration-[800ms] ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
            priority={index === 0}
            sizes="50vw"
          />
        ))}
      </div>
    </div>
  );
}
