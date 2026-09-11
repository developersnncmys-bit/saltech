"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const industries: { name: string; icon: ReactNode }[] = [
  {
    name: "Oil & Gas",
    icon: (
      <svg viewBox="0 0 40 40" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 5 C13 15 10 21 10 26 a10 10 0 0 0 20 0 c0-5-3-11-10-21z" />
        <path d="M15 26 a5 5 0 0 0 5 5" />
      </svg>
    ),
  },
  {
    name: "Nuclear",
    icon: (
      <svg viewBox="0 0 40 40" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="20" cy="20" r="2.5" fill="currentColor" stroke="none" />
        <ellipse cx="20" cy="20" rx="14" ry="5" />
        <ellipse cx="20" cy="20" rx="14" ry="5" transform="rotate(60 20 20)" />
        <ellipse cx="20" cy="20" rx="14" ry="5" transform="rotate(120 20 20)" />
      </svg>
    ),
  },
  {
    name: "Power & Utilities",
    icon: (
      <svg viewBox="0 0 40 40" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M23 5 L12 22 h7 l-3 13 L28 18 h-7 z" />
      </svg>
    ),
  },
  {
    name: "Rail & Infrastructure",
    icon: (
      <svg viewBox="0 0 40 40" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M13 6 L13 34 M27 6 L27 34" />
        <path d="M6 12 L34 12 M6 20 L34 20 M6 28 L34 28" />
      </svg>
    ),
  },
  {
    name: "Industrial Process",
    icon: (
      <svg viewBox="0 0 40 40" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="20" cy="20" r="5" />
        <path d="M20 4 L20 9 M20 31 L20 36 M4 20 L9 20 M31 20 L36 20
                 M8.5 8.5 L12 12 M28 28 L31.5 31.5 M8.5 31.5 L12 28 M28 12 L31.5 8.5" />
      </svg>
    ),
  },
];

export default function Industries() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector(".industries__eyebrow");
      const titleLines = root.querySelectorAll(".industries__title-line");
      const body = root.querySelector(".industries__body");
      const panels = root.querySelectorAll<HTMLElement>(".industries__panel");

      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(body, { y: 24, opacity: 0 });
      gsap.set(panels, { y: 80, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      tl.to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, "-=0.3")
        .to(body, { y: 0, opacity: 1, duration: 0.65 }, "-=0.55")
        .to(panels, { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, ease: "power4.out" }, "-=0.35");

      // Hover state is CSS-driven (see .industries__panel:hover) so it always
      // matches the browser's real hover state and can't drift out of sync.
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="industries" id="industries" ref={rootRef}>
      <div className="industries__inner">
        <header className="industries__head">
          <div className="industries__eyebrow-clip">
            <p className="industries__eyebrow">Industries</p>
          </div>
          <h2 className="industries__title">
            <span className="industries__title-clip"><span className="industries__title-line">SOLUTIONS FOR</span></span>
            <span className="industries__title-clip"><span className="industries__title-line">DEMANDING INDUSTRIES.</span></span>
          </h2>
          <p className="industries__body">
            Our products and engineered systems are applied across energy, oil
            and gas, nuclear, rail and infrastructure, power generation,
            utilities and industrial process environments.
          </p>
        </header>

        <div className="industries__grid">
          {industries.map((ind, i) => (
            <article className="industries__panel" key={ind.name}>
              <span className="industries__panel-fill" aria-hidden="true" />
              <div className="industries__panel-inner">
                <span className="industries__panel-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="industries__panel-icon" aria-hidden="true">{ind.icon}</span>
                <h3 className="industries__panel-name">{ind.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
