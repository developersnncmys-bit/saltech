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
      const eyebrow = root.querySelector<HTMLElement>(".why__eyebrow");
      const titleLines = root.querySelectorAll<HTMLElement>(".why__title-line");
      const items = root.querySelectorAll<HTMLElement>(".why-item");

      // Head reveal — eyebrow slides up out of its clip, then the three
      // title lines stagger in. gsap.from() with an inline scrollTrigger
      // applies the initial hidden state synchronously (immediateRender)
      // so there's no flash of visible content, and holds the tween
      // paused until the trigger fires — more robust under Lenis +
      // preloader + strict-mode double-mount than a pre-set + timeline
      // pattern where the set and the tween can decouple.
      if (eyebrow) {
        gsap.from(eyebrow, {
          yPercent: 130,
          opacity: 0,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }
      if (titleLines.length) {
        gsap.from(titleLines, {
          yPercent: 105,
          opacity: 0,
          duration: 0.95,
          stagger: 0.08,
          ease: "power3.out",
          delay: 0.25,
          scrollTrigger: {
            trigger: root,
            start: "top 85%",
            once: true,
            invalidateOnRefresh: true,
          },
        });
      }

      items.forEach((item, i) => {
        gsap.from(item, {
          y: 60,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: i * 0.05,
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            once: true,
            invalidateOnRefresh: true,
          },
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

      // After all triggers are registered, force a refresh so their
      // start/end positions are recalculated against the FINAL page
      // layout (Preloader has just released body scroll, fonts may
      // have finished loading, images resolved). Without this the
      // triggers can cache stale positions from mount-time and either
      // fire before elements are painted or never fire at all.
      requestAnimationFrame(() => ScrollTrigger.refresh());
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
