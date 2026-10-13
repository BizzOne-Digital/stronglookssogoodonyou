"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function HomeMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = rootRef.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      const lines = el.querySelectorAll("[data-hero-line]");
      gsap.from(lines, {
        yPercent: 120,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.15,
      });

      const heroImg = el.querySelector("[data-hero-image]");
      if (heroImg) {
        gsap.to(heroImg, {
          scale: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: el.querySelector("[data-hero]"),
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      if (window.matchMedia("(min-width: 768px)").matches) {
        el.querySelectorAll("[data-parallax-word]").forEach((word, i) => {
          gsap.to(word, {
            x: i % 2 === 0 ? -40 : 40,
            ease: "none",
            scrollTrigger: {
              trigger: word,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      }

      const panels = el.querySelector("[data-panels]");
      if (panels && window.innerWidth >= 1024) {
        const panelEls = panels.querySelectorAll("[data-panel]");
        panelEls.forEach((panel, index) => {
          if (index === 0) return;
          gsap.fromTo(
            panel,
            { yPercent: 30 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "top top",
                scrub: true,
              },
            }
          );
        });
      }

      const horizontal = el.querySelector("[data-horizontal-scroll]");
      const viewport = horizontal?.querySelector("[data-horizontal-viewport]");
      const track = horizontal?.querySelector("[data-horizontal-track]");
      const canPinHorizontal =
        horizontal && viewport && track && window.matchMedia("(min-width: 1024px)").matches;

      if (canPinHorizontal) {
        const cards = Array.from(
          track.querySelectorAll("[data-horizontal-card]")
        ) as HTMLElement[];

        const getMaxX = () =>
          Math.max(0, track.scrollWidth - viewport.clientWidth);

        const progressForCard = (index: number) => {
          const max = getMaxX();
          if (max <= 0) return 0;
          const card = cards[index];
          if (!card) return 0;
          const target = Math.min(card.offsetLeft, max);
          return target / max;
        };

        const snapPoints = () => {
          if (cards.length <= 1) return [0];
          return cards.map((_, i) => progressForCard(i));
        };

        gsap.to(track, {
          x: () => -getMaxX(),
          ease: "none",
          scrollTrigger: {
            trigger: horizontal,
            start: "top top",
            end: () => {
              const travel = getMaxX();
              const perCard = window.innerHeight * 0.45;
              return `+=${travel + perCard}`;
            },
            pin: true,
            pinSpacing: true,
            scrub: 0.85,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            snap: {
              snapTo: (progress) => {
                const points = snapPoints();
                let closest = points[0] ?? 0;
                let minDist = Infinity;
                for (const p of points) {
                  const d = Math.abs(progress - p);
                  if (d < minDist) {
                    minDist = d;
                    closest = p;
                  }
                }
                return closest;
              },
              duration: { min: 0.12, max: 0.4 },
              delay: 0,
            },
          },
        });
      }

      el.querySelectorAll("[data-reveal]").forEach((node) => {
        gsap.fromTo(
          node,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: node,
              start: "top 85%",
            },
          }
        );
      });
    }, rootRef);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    const refreshId = window.setTimeout(() => ScrollTrigger.refresh(), 400);
    return () => {
      window.clearTimeout(refreshId);
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="max-w-[100vw] overflow-x-clip">
      {children}
    </div>
  );
}
