"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Dot = [number, number];

const dotSearch: Dot[] = [
  [14, 6], [18, 6], [10, 8], [22, 8], [7, 12], [25, 12], [7, 17], [25, 17],
  [10, 21], [22, 21], [14, 23], [18, 23], [16, 15],
  [26, 26], [29, 29], [32, 32],
];
const dotNodes: Dot[] = [
  [10, 10], [10, 30], [30, 10], [30, 30], [20, 20],
  [12, 16], [14, 18], [16, 20], [18, 18], [16, 16],
  [22, 20], [24, 22], [26, 24], [24, 20], [22, 22],
  [16, 12], [20, 14], [24, 12], [16, 28], [20, 26], [24, 28],
];
const dotTools: Dot[] = [
  [8, 32], [12, 28], [16, 24], [20, 20], [24, 16], [28, 12],
  [10, 30], [14, 26], [18, 22], [22, 18], [26, 14],
  [30, 8], [32, 10], [28, 8], [30, 12],
  [6, 34], [8, 36],
];
const dotPin: Dot[] = [
  [20, 6], [16, 8], [24, 8], [12, 12], [28, 12], [10, 16], [30, 16],
  [10, 20], [30, 20], [12, 24], [28, 24], [16, 28], [24, 28], [18, 30], [22, 30], [20, 32],
  [20, 14], [17, 17], [23, 17], [20, 20],
];

function DotIcon({ dots }: { dots: Dot[] }) {
  return (
    <svg viewBox="0 0 40 40" width="44" height="44" aria-hidden="true">
      {dots.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.1" fill="currentColor" />
      ))}
    </svg>
  );
}

const cards = [
  {
    title: "Technical\nSelection",
    body: "Expert selection of the right components and systems for your application.",
    dots: dotSearch,
  },
  {
    title: "Engineering\n& Integration",
    body: "Engineering, integration and layout of control-room and operator systems.",
    dots: dotNodes,
  },
  {
    title: "Assembly, Wiring\n& Testing",
    body: "Panel assembly, wiring, testing and FAT before delivery.",
    dots: dotTools,
  },
  {
    title: "Site\nSupport",
    body: "Installation and ongoing site support across the UK.",
    dots: dotPin,
  },
];

export default function EngineeringUnderOneRoof() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector(".euor__eyebrow");
      const titleLines = root.querySelectorAll(".euor__title-line");
      const sub = root.querySelector(".euor__sub");
      const cta = root.querySelector(".euor__cta");
      const items = root.querySelectorAll<HTMLElement>(".euor-item");

      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(sub, { y: 24, opacity: 0 });
      gsap.set(cta, { y: 20, opacity: 0 });
      gsap.set(items, { y: 60, opacity: 0 });

      const headTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      headTl
        .to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.08 }, "-=0.3")
        .to(sub, { y: 0, opacity: 1, duration: 0.65 }, "-=0.55")
        .to(cta, { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");

      items.forEach((item, i) => {
        gsap.to(item, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          delay: i * 0.09,
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });

        const dots = item.querySelectorAll<SVGCircleElement>(".euor-item__icon circle");
        const rule = item.querySelector<HTMLElement>(".euor-item__rule");

        const enter = () => {
          gsap.to(dots, {
            fill: "#000",
            scale: 1.35,
            duration: 0.5,
            ease: "power2.out",
            stagger: { each: 0.005, from: "random" },
            transformOrigin: "center",
          });
          gsap.to(rule, { scaleX: 1, duration: 0.6, ease: "power3.out" });
        };
        const leave = () => {
          gsap.to(dots, {
            fill: "#111",
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: { each: 0.005, from: "random" },
            transformOrigin: "center",
          });
          gsap.to(rule, { scaleX: 0, duration: 0.6, ease: "power3.out" });
        };
        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="euor" id="engineering" ref={rootRef}>
      <div className="euor__inner">
        <header className="euor__head">
          <div className="euor__head-lead">
            <div className="euor__eyebrow-clip">
              <p className="euor__eyebrow">Engineering-led</p>
            </div>
            <h2 className="euor__title">
              <span className="euor__title-clip"><span className="euor__title-line">ENGINEERING,</span></span>
              <span className="euor__title-clip"><span className="euor__title-line">ASSEMBLY &amp; TESTING</span></span>
              <span className="euor__title-clip"><span className="euor__title-line">UNDER ONE ROOF.</span></span>
            </h2>
          </div>
          <div className="euor__head-aside">
            <p className="euor__sub">
              From technical selection and engineering through integration,
              assembly, wiring, testing, FAT and site support &mdash; delivered
              from our facility in Shaftesbury, Dorset.
            </p>
            <a href="#contact" className="btn btn--primary euor__cta">Request a Quote</a>
          </div>
        </header>

        <div className="euor__grid">
          {cards.map((c) => (
            <article className="euor-item" key={c.title}>
              <span className="euor-item__rule" aria-hidden="true" />
              <div className="euor-item__icon" aria-hidden="true">
                <DotIcon dots={c.dots} />
              </div>
              <h3 className="euor-item__title">
                {c.title.split("\n").map((ln, i) => (
                  <span key={i}>{ln}</span>
                ))}
              </h3>
              <p className="euor-item__body">{c.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
