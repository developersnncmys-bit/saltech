"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const cards: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Components\n& Spares",
    body: "Individual components, replacement parts and spares to keep existing systems running.",
    icon: (
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="20" cy="20" r="4.5" pathLength={1} />
        <path d="M20 6 L20 11 M20 29 L20 34 M6 20 L11 20 M29 20 L34 20 M10 10 L14 14 M26 26 L30 30 M10 30 L14 26 M26 14 L30 10" pathLength={1} />
      </svg>
    ),
  },
  {
    title: "Modifications\n& Extensions",
    body: "Existing panel modifications and extensions, facias and panel adjustments.",
    icon: (
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M8 26 L8 8 L26 8" pathLength={1} />
        <path d="M14 32 L32 32 L32 14" pathLength={1} />
        <path d="M8 8 L32 32" strokeDasharray="1.5 3" opacity="0.5" pathLength={1} />
      </svg>
    ),
  },
  {
    title: "Complete Panels\n& Systems",
    body: "Complete wired panels, control-room assemblies and operator interfaces.",
    icon: (
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="6" y="6" width="28" height="28" pathLength={1} />
        <path d="M6 15 L34 15 M15 6 L15 34" pathLength={1} />
        <circle cx="24" cy="24" r="1" fill="currentColor" stroke="none" />
        <circle cx="28" cy="24" r="1" fill="currentColor" stroke="none" />
        <circle cx="24" cy="28" r="1" fill="currentColor" stroke="none" />
        <circle cx="28" cy="28" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    title: "Installation\n& Site Support",
    body: "Installation and site support delivered from our facility in Shaftesbury, Dorset.",
    icon: (
      <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 18 L20 6 L34 18 L34 34 L6 34 Z" pathLength={1} />
        <path d="M16 34 L16 22 L24 22 L24 34" pathLength={1} />
      </svg>
    ),
  },
];

export default function ComponentsToSystems() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector(".cts__eyebrow");
      const titleLines = root.querySelectorAll(".cts__title-line");
      const sub = root.querySelector(".cts__sub");
      const cards = root.querySelectorAll<HTMLElement>(".cts-card");

      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(sub, { y: 24, opacity: 0 });
      gsap.set(cards, { y: 60, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      tl.to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, "-=0.3")
        .to(sub, { y: 0, opacity: 1, duration: 0.65 }, "-=0.55")
        .to(cards, { y: 0, opacity: 1, duration: 0.85, stagger: 0.1 }, "-=0.35");

      cards.forEach((card, i) => {
        const num = card.querySelector<HTMLElement>(".cts-card__num");
        const paths = card.querySelectorAll<SVGPathElement | SVGCircleElement | SVGRectElement>(
          ".cts-card__icon svg [pathlength], .cts-card__icon svg path[pathLength], .cts-card__icon svg circle[pathLength], .cts-card__icon svg rect[pathLength]"
        );
        const rule = card.querySelector<HTMLElement>(".cts-card__rule");
        const icon = card.querySelector<HTMLElement>(".cts-card__icon");
        const glow = card.querySelector<HTMLElement>(".cts-card__glow");
        const brackets = card.querySelectorAll<HTMLElement>(".cts-card__bracket");

        gsap.set(paths, { strokeDasharray: 1, strokeDashoffset: 1 });
        gsap.set(brackets, { scale: 0.6, opacity: 0 });

        const drawTl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 80%", once: true },
          delay: i * 0.1,
        });
        drawTl.to(paths, {
          strokeDashoffset: 0,
          duration: 1.1,
          ease: "power2.inOut",
          stagger: 0.06,
        });

        if (num) {
          const target = i + 1;
          const counter = { v: 0 };
          gsap.to(counter, {
            v: target,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 80%", once: true },
            delay: i * 0.1,
            onUpdate: () => {
              num.textContent = String(Math.round(counter.v)).padStart(2, "0");
            },
          });
        }

        const onMove = (e: MouseEvent) => {
          const r = card.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * 100;
          const y = ((e.clientY - r.top) / r.height) * 100;
          card.style.setProperty("--mx", `${x}%`);
          card.style.setProperty("--my", `${y}%`);
        };
        const enter = () => {
          gsap.to(rule, { scaleX: 1, duration: 0.55, ease: "power3.out" });
          gsap.to(icon, { rotate: 90, scale: 1.05, duration: 0.7, ease: "power3.out" });
          gsap.to(glow, { opacity: 1, duration: 0.5, ease: "power2.out" });
          gsap.to(brackets, { scale: 1, opacity: 1, duration: 0.55, stagger: 0.06, ease: "power3.out" });
          card.addEventListener("mousemove", onMove);
        };
        const leave = () => {
          gsap.to(rule, { scaleX: 0, duration: 0.45, ease: "power3.in" });
          gsap.to(icon, { rotate: 0, scale: 1, duration: 0.7, ease: "power3.out" });
          gsap.to(glow, { opacity: 0, duration: 0.4, ease: "power2.out" });
          gsap.to(brackets, { scale: 0.6, opacity: 0, duration: 0.4, ease: "power3.in" });
          card.removeEventListener("mousemove", onMove);
        };
        card.addEventListener("mouseenter", enter);
        card.addEventListener("mouseleave", leave);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="cts" id="components-systems" ref={rootRef}>
      <div className="cts__inner">
        <header className="cts__head">
          <div className="cts__eyebrow-clip">
            <p className="cts__eyebrow">How we support you</p>
          </div>
          <h2 className="cts__title">
            <span className="cts__title-clip"><span className="cts__title-line">COMPONENTS TO</span></span>
            <span className="cts__title-clip"><span className="cts__title-line">COMPLETE SYSTEMS.</span></span>
          </h2>
          <p className="cts__sub">
            Saltech supports customers at every level &mdash; from individual
            components and spares through to complete engineered panels and
            packaged systems.
          </p>
        </header>

        <div className="cts__grid">
          {cards.map((c, i) => (
            <article className="cts-card" key={c.title}>
              <span className="cts-card__glow" aria-hidden="true" />
              <span className="cts-card__bracket cts-card__bracket--tl" aria-hidden="true" />
              <span className="cts-card__bracket cts-card__bracket--tr" aria-hidden="true" />
              <span className="cts-card__bracket cts-card__bracket--bl" aria-hidden="true" />
              <span className="cts-card__bracket cts-card__bracket--br" aria-hidden="true" />

              <div className="cts-card__inner">
                <div className="cts-card__top">
                  <span className="cts-card__num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="cts-card__icon" aria-hidden="true">{c.icon}</span>
                </div>
                <h3 className="cts-card__title">
                  {c.title.split("\n").map((ln, idx) => (
                    <span key={idx}>{ln}</span>
                  ))}
                </h3>
                <p className="cts-card__body">{c.body}</p>
              </div>
              <span className="cts-card__rule" aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
