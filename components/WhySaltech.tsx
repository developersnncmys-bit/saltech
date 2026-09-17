"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const rows = [
  {
    h: "Engineering-led",
    b: "We work from the application and technical requirement rather than simply supplying a catalogue item.",
  },
  {
    h: "UK-based technical support",
    b: "Saltech provides a UK technical and commercial interface for projects requiring engineering coordination, product selection, documentation and support.",
  },
  {
    h: "New systems and legacy systems",
    b: "We support new installations as well as modifications, extensions, replacements and spares for existing equipment.",
  },
  {
    h: "From component to complete system",
    b: "A requirement can range from a single replacement component to a complete engineered panel or packaged system. We can support the appropriate level of supply.",
  },
  {
    h: "Lifecycle support",
    b: "Our involvement can continue beyond initial supply through FAT, installation support, modifications, replacements and ongoing technical assistance.",
  },
];

export default function WhySaltech() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector(".why__eyebrow");
      const titleLines = root.querySelectorAll(".why__title-line");
      const items = root.querySelectorAll<HTMLElement>(".why-item");

      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(items, { y: 60, opacity: 0 });

      const headTl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 75%", once: true },
      });
      headTl
        .to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 })
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.95, stagger: 0.08 }, "-=0.3");

      items.forEach((item, i) => {
        gsap.to(item, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          delay: i * 0.08,
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });

        const num = item.querySelector<HTMLElement>(".why-item__num");
        const rule = item.querySelector<HTMLElement>(".why-item__rule");

        const enter = () => {
          gsap.to(num, { x: 6, color: "#fff", duration: 0.4, ease: "power2.out" });
          gsap.to(rule, { scaleX: 1, duration: 0.6, ease: "power3.out" });
        };
        const leave = () => {
          gsap.to(num, { x: 0, color: "#555", duration: 0.4, ease: "power2.out" });
          gsap.to(rule, { scaleX: 0, duration: 0.6, ease: "power3.out" });
        };
        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="why" id="why" ref={rootRef}>
      <div className="why__inner">
        <aside className="why__aside">
          <div className="why__eyebrow-clip">
            <p className="why__eyebrow">Why Saltech</p>
          </div>
          <h2 className="why__title">
            <span className="why__title-clip"><span className="why__title-line">WHY ENGINEERING</span></span>
            <span className="why__title-clip"><span className="why__title-line">TEAMS CHOOSE</span></span>
            <span className="why__title-clip"><span className="why__title-line">SALTECH.</span></span>
          </h2>
        </aside>
        <ol className="why__list">
          {rows.map((r, i) => (
            <li className="why-item" key={r.h}>
              <span className="why-item__num">{String(i + 1).padStart(2, "0")}</span>
              <div className="why-item__body">
                <h3 className="why-item__h">{r.h}</h3>
                <p className="why-item__b">{r.b}</p>
              </div>
              <span className="why-item__rule" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
