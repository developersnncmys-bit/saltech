"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Names taken verbatim from the NNC brief wireframe. Real logo images
// can be dropped into /public/partner-logos/ later and the render swapped
// to <img> — the text-plate fallback below keeps the section shipping now.
const partners = [
  { name: "Werner",         slug: "werner",         logo: "/logos/werner.png" },
  { name: "Thinking Space", slug: "thinking-space", logo: "/logos/thinkingspace.png" },
  { name: "Ambetronics",    slug: "ambetronics",    logo: "/logos/ambetronics.png" },
  { name: "Kleev Mek",      slug: "kleev-mek",      logo: "/logos/kleev.png" },
  { name: "Hitech",         slug: "hitech",         logo: "/logos/hitech.png" },
];

export default function Partners() {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || !rootRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      const titleLines = root.querySelectorAll(".partners__title-line");
      const sub = root.querySelector(".partners__sub");
      const cells = root.querySelectorAll<HTMLElement>(".partners__cell");
      const logos = root.querySelectorAll<HTMLElement>(".partners__cell-logo");
      const body = root.querySelector(".partners__body");

      gsap.set(titleLines, { yPercent: 105, opacity: 0 });
      gsap.set(sub, { y: 24, opacity: 0 });
      gsap.set(cells, { clipPath: "inset(0 100% 0 0)", opacity: 0 });
      gsap.set(logos, { y: 20, opacity: 0, scale: 0.92 });
      gsap.set(body, { y: 20, opacity: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 72%", once: true },
      });
      tl.to(titleLines, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08 })
        .to(sub, { y: 0, opacity: 1, duration: 0.65 }, "-=0.55")
        .to(cells, {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power4.out",
        }, "-=0.3")
        .to(logos, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
        }, "-=0.75")
        .to(body, { y: 0, opacity: 1, duration: 0.6 }, "-=0.15");

      // Magnetic hover — each logo nudges toward the cursor and eases back.
      cells.forEach((cell) => {
        const logo = cell.querySelector<HTMLElement>(".partners__cell-logo");
        if (!logo) return;
        const onMove = (e: MouseEvent) => {
          const r = cell.getBoundingClientRect();
          const dx = ((e.clientX - r.left) / r.width - 0.5) * 12;
          const dy = ((e.clientY - r.top) / r.height - 0.5) * 8;
          gsap.to(logo, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
        };
        const onLeave = () => {
          gsap.to(logo, { x: 0, y: 0, duration: 0.6, ease: "power3.out" });
        };
        cell.addEventListener("mousemove", onMove);
        cell.addEventListener("mouseleave", onLeave);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="partners" id="partners" ref={rootRef}>
      <div className="partners__inner">
        <header className="partners__head">
          <h2 className="partners__title">
            <span className="partners__title-clip"><span className="partners__title-line">OUR TECHNOLOGY &amp;</span></span>
            <span className="partners__title-clip"><span className="partners__title-line">MANUFACTURING PARTNERS.</span></span>
          </h2>
          <p className="partners__sub">
            We work with approved technology and manufacturing partners to
            ensure certified, long-term supportable solutions.
          </p>
        </header>

        <ul className="partners__grid" aria-label="Technology and manufacturing partners">
          {partners.map((p) => (
            <li className="partners__cell" key={p.slug}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="partners__cell-logo"
                src={p.logo}
                alt={p.name}
                loading="lazy"
              />
            </li>
          ))}
        </ul>

        <p className="partners__body">
          Saltech combines UK-based engineering, assembly and technical support
          with established international technology and manufacturing partners.
        </p>
      </div>
    </section>
  );
}
