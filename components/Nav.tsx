"use client";

import { useEffect, useState } from "react";

// Primary nav — 6 items per the brief wireframe. Secondary pages
// (Engineering & Support, Technical Resources, About Saltech, Contact)
// are reached via the footer per brief: "Secondary pages can be
// reached through footer/secondary navigation."
const NAV = [
  { label: "Home", href: "#top" },
  {
    label: "Mosaic Mimic Systems",
    href: "#mosaic",
    children: [
      { label: "Metal Grid Mosaic Panels", href: "#mosaic" },
      { label: "Plastic Grid Mosaic Panels", href: "#mosaic" },
      { label: "Platform-based Mosaic", href: "#mosaic" },
      { label: "Mosaic Tiles & Control", href: "#mosaic" },
      { label: "New Panel Design & Manufacture", href: "#mosaic" },
      { label: "Spares & Facias", href: "#legacy" },
    ],
  },
  { label: "Control Room & Operator Systems", href: "#control-room" },
  {
    label: "Hazardous Area & Safety",
    href: "#hazardous",
    children: [
      { label: "ATEX / IECEx Enclosures", href: "#hazardous" },
      { label: "Gas, Flame & Heat Detection", href: "#hazardous" },
      { label: "Certified Safety Systems", href: "#hazardous" },
    ],
  },
  {
    label: "Mechanical & Engineered Packages",
    href: "#packages",
    children: [
      { label: "Fire-Water Packages", href: "#packages" },
      { label: "Industrial Pump Packages", href: "#packages" },
      { label: "Specialist Mechanical Packages", href: "#packages" },
    ],
  },
  { label: "Industries", href: "#industries" },
];

// Mobile-panel-only extras (surfaced in footer on desktop)
const SECONDARY = [
  { label: "Engineering & Support", href: "#engineering" },
  { label: "Technical Resources", href: "#resources" },
  { label: "About Saltech", href: "#about" },
  { label: "Contact", href: "#contact" },
];

// Social icons rendered in the utility bar.
const SOCIAL = [
  {
    label: "LinkedIn",
    href: "#",
    svg: (
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11.25H3V9.75zm7.5 0h3.83v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.09V21H19.1v-4.9c0-1.17-.02-2.68-1.64-2.68-1.64 0-1.89 1.28-1.89 2.6V21H11.6c0-3.75 0-7.5.02-11.25h-.12z" />
      </svg>
    ),
  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Which parent items in the mobile panel are expanded (accordion state).
  // Keyed by parent label; reset on panel close.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) setExpanded({});
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);
  const toggleExpanded = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  return (
    <>
      {/* Utility bar — logo + contact + social. Hides on scroll so it
          doesn't waste vertical space once the user is reading content. */}
      <div className={`nav-util${scrolled ? " nav-util--hidden" : ""}`}>
        <div className="nav-util__inner">
          <div className="nav-util__contact">
            <a href="tel:+447542699546" className="nav-util__link">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M3 3 L5.5 3 L6.8 6 L5.3 7 C6 8.6 7.4 10 9 10.7 L10 9.2 L13 10.5 L13 13 C13 13.4 12.6 13.7 12.2 13.7 C7.1 13.5 2.5 8.9 2.3 3.8 C2.3 3.4 2.6 3 3 3 Z" strokeLinejoin="round"/>
              </svg>
              +44 (0) 7542 699 546
            </a>
            <span className="nav-util__sep" aria-hidden="true" />
            <a href="mailto:info@saltech.ltd" className="nav-util__link">
              <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="2" y="3.5" width="12" height="9" rx="1" />
                <path d="M2 5 L8 9 L14 5" />
              </svg>
              info@saltech.ltd
            </a>
            <ul className="nav-util__social" aria-label="Social links">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} aria-label={s.label}>{s.svg}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Main nav — page links + Request a Quote CTA. Sits below the
          utility bar; when the utility bar hides on scroll, this bar
          slides up to top: 0. A compact logo appears here only when
          the utility bar is hidden so the brand stays visible. */}
      <nav className={`nav ${scrolled ? "nav--scrolled" : ""} ${open ? "nav--open" : ""}`}>
        <a href="#top" className="nav__logo nav__logo--compact" aria-label="Saltech home" onClick={close}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="nav__logo-img" src="/logo.png" alt="Saltech" />
        </a>

        <ul className="nav__menu" role="menubar">
          {NAV.map((item) => (
            <li
              key={item.label}
              className={`nav__item${item.children ? " nav__item--has-menu" : ""}`}
              role="none"
            >
              <a href={item.href} role="menuitem" aria-haspopup={item.children ? "true" : undefined}>
                {item.label}
                {item.children && (
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M2 3.5 L5 6.5 L8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>
              {item.children && (
                <div className="nav__submenu" role="menu">
                  <div className="nav__submenu-head">
                    <p className="nav__submenu-eyebrow">Explore</p>
                    <p className="nav__submenu-title">{item.label}</p>
                  </div>
                  <div className="nav__submenu-body">
                    {item.children.map((c) => (
                      <a key={c.label} href={c.href} role="menuitem">
                        <span className="nav__submenu-item-label">{c.label}</span>
                      </a>
                    ))}
                  </div>
                  <a href={item.href} className="nav__submenu-cta" role="menuitem">
                    <span>View all {item.label}</span>
                    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                      <path d="M2 7 L12 7 M8 3 L12 7 L8 11" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="nav__end">
          <a href="#contact" className="nav__cta" onClick={close}>
            Request a Quote
          </a>
        </div>

        <button
          type="button"
          className="nav__burger"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span />
          <span />
        </button>

        <div className="nav__panel" hidden={!open} data-lenis-prevent>
          <ul>
            {NAV.map((item) => {
              const isOpen = !!expanded[item.label];
              return (
                <li key={item.label} className={item.children ? "nav__panel-group" : undefined}>
                  {item.children ? (
                    <>
                      <button
                        type="button"
                        className={`nav__panel-toggle${isOpen ? " nav__panel-toggle--open" : ""}`}
                        aria-expanded={isOpen}
                        onClick={() => toggleExpanded(item.label)}
                      >
                        <span>{item.label}</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                          <path d="M3 5.5 L7 9.5 L11 5.5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      {isOpen && (
                        <div className="nav__panel-children">
                          {item.children.map((c) => (
                            <a key={c.label} href={c.href} onClick={close}>{c.label}</a>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <a className="nav__panel-link" href={item.href} onClick={close}>{item.label}</a>
                  )}
                </li>
              );
            })}
            {SECONDARY.map((item) => (
              <li key={item.label}>
                <a className="nav__panel-link" href={item.href} onClick={close}>{item.label}</a>
              </li>
            ))}
            <li className="nav__panel-cta-row">
              <a className="nav__panel-cta" href="#contact" onClick={close}>Request a Quote</a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
