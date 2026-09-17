"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const bullets = [
  "Replacement and legacy system support",
  "Panel modifications and extensions",
  "Mosaic spares and facias",
];

export default function LegacyObsolete() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const eyebrow = root.querySelector(".legacy__eyebrow");
      const titleLines = root.querySelectorAll(".legacy__title-line");
      const body = root.querySelector(".legacy__body");
      const listItems = root.querySelectorAll<HTMLElement>(".legacy__list li");
      const ctaRow = root.querySelector(".legacy__cta-row");
      const mediaCover = root.querySelector<HTMLElement>(".legacy__media-cover");
      const mediaImg = root.querySelector<HTMLElement>(".legacy__media img");

      gsap.set(eyebrow, { yPercent: 130, opacity: 0 });
      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(body, { y: 24, opacity: 0 });
      gsap.set(listItems, { x: -20, opacity: 0 });
      gsap.set(ctaRow, { y: 20, opacity: 0 });
      if (mediaImg) gsap.set(mediaImg, { scale: 1.2 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 70%", once: true },
      });

      if (mediaCover) {
        tl.to(mediaCover, {
          scaleY: 0,
          duration: 1.1,
          ease: "power4.inOut",
          transformOrigin: "top center",
        }, 0);
      }
      if (mediaImg) {
        tl.to(mediaImg, { scale: 1, duration: 1.4, ease: "power3.out" }, 0);
      }

      tl.to(eyebrow, { yPercent: 0, opacity: 1, duration: 0.55 }, 0.15)
        .to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 }, 0.25)
        .to(body, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .to(listItems, { x: 0, opacity: 1, duration: 0.55, stagger: 0.08 }, "-=0.35")
        .to(ctaRow, { y: 0, opacity: 1, duration: 0.5 }, "-=0.15");
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="legacy" id="legacy" ref={rootRef}>
      <div className="legacy__inner">
        <div className="legacy__text">
          <div className="legacy__eyebrow-clip">
            <p className="legacy__eyebrow">Legacy &amp; obsolete systems</p>
          </div>
          <h2 className="legacy__title">
            <span className="legacy__title-clip"><span className="legacy__title-line">SUPPORTING INSTALLATIONS</span></span>
            <span className="legacy__title-clip"><span className="legacy__title-line">THAT ARE OBSOLETE, DIFFICULT TO</span></span>
            <span className="legacy__title-clip"><span className="legacy__title-line">SOURCE OR NEED REPLACEMENT.</span></span>
          </h2>
          <p className="legacy__body">
            A major part of what we do is supporting existing industrial
            installations where equipment is obsolete, difficult to source,
            needs modification or needs replacement.
          </p>
          <ul className="legacy__list">
            {bullets.map((b, i) => (
              <li key={b}>
                <span className="legacy__list-idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="legacy__list-text">{b}</span>
              </li>
            ))}
          </ul>
          <div className="legacy__cta-row">
            <a href="#legacy" className="btn btn--primary">Explore Legacy Support</a>
            <a href="#contact" className="btn btn--ghost">Request a Quote</a>
          </div>
        </div>
        <div className="legacy__media" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/legacy-system.jpg"
            alt=""
            loading="lazy"
          />
          <span className="legacy__media-cover" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
