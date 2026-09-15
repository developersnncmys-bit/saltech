"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Word-by-word title breakdown — each word gets its own scroll-revealed
// mask/rotation, so the headline animates like kinetic type rather than
// a static banner.
const titleWords = [
  { text: "Designed,", accent: false },
  { text: "assembled", accent: false },
  { text: "&", accent: false },
  { text: "tested", accent: false },
  { text: "in the", accent: false },
  { text: "UK.", accent: true },
];

const capabilities = [
  {
    num: "01",
    tag: "UK",
    k: "Shaftesbury, Dorset",
    v: "Engineering & workshop facility — panels wired, built and quality-checked under one roof.",
  },
  {
    num: "02",
    tag: "END-TO-END",
    k: "FAT & Site Support",
    v: "Factory acceptance testing before dispatch, plus site commissioning and ongoing service.",
  },
  {
    num: "03",
    tag: "AUDITED",
    k: "ISO 9001:2015",
    v: "Certified quality management — every project runs against a documented, audited system.",
  },
];

export default function ManufacturingEngineering() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      // Kinetic parallax on the background grid — subtle scroll-linked
      // translate so the section feels "alive" as you pass through it.
      const grid = root.querySelector<HTMLElement>(".mfg__bg-grid");
      if (grid) {
        gsap.to(grid, {
          yPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Eyebrow row — subtle fade+lift.
      const eyebrow = root.querySelector(".mfg__eyebrow-row");
      gsap.from(eyebrow, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });

      // Word-by-word title reveal — each word masks up + tiny rotate.
      const words = root.querySelectorAll<HTMLElement>(".mfg__title-word");
      gsap.set(words, { yPercent: 108, rotate: 3, opacity: 0 });
      gsap.to(words, {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 0.95,
        ease: "power4.out",
        stagger: 0.06,
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      // Body columns crossfade.
      const bodies = root.querySelectorAll<HTMLElement>(".mfg__body");
      gsap.from(bodies, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root, start: "top 60%", once: true },
      });

      // Capability cards — each one gets its own scroll trigger so the
      // reveal fires when THAT card is on screen (not all at once). 3D
      // perspective tilt gives them physical weight without going gimmicky.
      const cards = root.querySelectorAll<HTMLElement>(".mfg__card");
      cards.forEach((card, i) => {
        gsap.set(card, {
          y: 80,
          opacity: 0,
          rotateX: -8,
          transformPerspective: 800,
          transformOrigin: "center top",
        });
        gsap.to(card, {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          ease: "power4.out",
          delay: i * 0.12,
          scrollTrigger: { trigger: card, start: "top 88%", once: true },
        });

        // Progress bar fills once the card is in place.
        const bar = card.querySelector<HTMLElement>(".mfg__card-bar-fill");
        if (bar) {
          gsap.fromTo(
            bar,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.2,
              ease: "power3.out",
              delay: i * 0.12 + 0.35,
              scrollTrigger: { trigger: card, start: "top 88%", once: true },
            }
          );
        }
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="mfg" id="manufacturing" ref={rootRef}>
      {/* Layered dark background: parallax grid + soft radial glow */}
      <div className="mfg__bg" aria-hidden="true">
        <div className="mfg__bg-grid" />
        <div className="mfg__bg-glow" />
      </div>

      <div className="mfg__inner">
        <div className="mfg__eyebrow-row">
          <p className="mfg__eyebrow">
            <span className="mfg__eyebrow-dot" aria-hidden="true" />
            Manufacturing &amp; Engineering
          </p>
        </div>

        <h2 className="mfg__title">
          {titleWords.map((w, i) => (
            <span className="mfg__title-wordmask" key={`${w.text}-${i}`}>
              <span
                className={`mfg__title-word${w.accent ? " mfg__title-word--accent" : ""}`}
              >
                {w.text}
              </span>
            </span>
          ))}
        </h2>

        <div className="mfg__body-grid">
          <p className="mfg__body">
            Saltech provides engineering, assembly, wiring and testing from its
            facility in Shaftesbury, Dorset &mdash; supporting projects from
            individual assemblies through to complete control-room panels and
            engineered systems.
          </p>
          <p className="mfg__body">
            Where specialist manufacturing or certified products are required,
            Saltech works with established technology and manufacturing partners
            and manages the technical interface between the customer requirement
            and the supplied solution.
          </p>
        </div>

        <ol className="mfg__cards" aria-label="Facility capabilities">
          {capabilities.map((c) => (
            <li className="mfg__card" key={c.num}>
              <div className="mfg__card-head">
                <span className="mfg__card-num">{c.num}</span>
                <span className="mfg__card-tag">{c.tag}</span>
              </div>
              <h3 className="mfg__card-h">{c.k}</h3>
              <p className="mfg__card-v">{c.v}</p>
              <span className="mfg__card-bar" aria-hidden="true">
                <span className="mfg__card-bar-fill" />
              </span>
            </li>
          ))}
        </ol>
      </div>

    </section>
  );
}
