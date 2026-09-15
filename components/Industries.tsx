"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Industry list locked to the brief. Category-only presentation
// (no images / no icons) — reads as an editorial index card, avoids
// stock-photo generics, and has zero external image dependencies.
const industries = [
  { name: "Oil & Gas",           tags: "Refineries · Petrochemical · Offshore" },
  { name: "Nuclear",             tags: "Generation · Decommissioning · Safety" },
  { name: "Power & Utilities",   tags: "Grid · Substations · Renewables" },
  { name: "Rail & Infrastructure", tags: "Signalling · Depots · Trackside" },
  { name: "Industrial Process",  tags: "Manufacturing · Chemicals · Water" },
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
      const cells = root.querySelectorAll<HTMLElement>(".industries__cell");

      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(body, { y: 24, opacity: 0 });
      gsap.set(cells, { y: 60, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      tl.to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, "-=0.3")
        .to(body, { y: 0, opacity: 1, duration: 0.65 }, "-=0.55")
        .to(cells, { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: "power4.out" }, "-=0.3");
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

        <ul className="industries__grid" aria-label="Industries served">
          {industries.map((ind, i) => (
            <li className="industries__cell" key={ind.name}>
              <span className="industries__cell-rule" aria-hidden="true" />
              <div className="industries__cell-head">
                <span className="industries__cell-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="industries__cell-mark" aria-hidden="true">/ 05</span>
              </div>
              <h3 className="industries__cell-name">{ind.name}</h3>
              <p className="industries__cell-tags">{ind.tags}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
