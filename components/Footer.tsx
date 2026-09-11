"use client";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <p className="footer__logo">
            SAL<span>TECH</span>
          </p>
          <p className="footer__tag">
            UK-based engineering partner delivering safety-critical control and industrial systems.
          </p>
        </div>

        <div className="footer__col">
          <p className="footer__h">Quick Links</p>
          <a href="#top">Home</a>
          <a href="#industries">Industries</a>
          <a href="#engineering">Engineering &amp; Support</a>
          <a href="#resources">Technical Resources</a>
          <a href="#about">About Saltech</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer__col">
          <p className="footer__h">Our Solutions</p>
          <a href="#mosaic">Mosaic Mimic Systems</a>
          <a href="#control-room">Control Room &amp; Operator Systems</a>
          <a href="#hazardous">Hazardous Area &amp; Safety</a>
          <a href="#packages">Mechanical &amp; Engineered Packages</a>
        </div>

        <div className="footer__col footer__col--contact">
          <p className="footer__h">Contact</p>

          <div className="footer__addr-block">
            <p className="footer__addr-label">Registered Office</p>
            <p className="footer__addr">
              Saltech Consulting Ltd<br />
              1 The Bluebells, Shaftesbury<br />
              SP7 8GW, United Kingdom
            </p>
          </div>

          <div className="footer__addr-block">
            <p className="footer__addr-label">Engineering &amp; Workshop Facility</p>
            <p className="footer__addr">
              Unit 6, N.D.D.C. Units, Longmead<br />
              Shaftesbury, SP7 8PL, United Kingdom
            </p>
          </div>

          <div className="footer__contact-lines">
            <a href="tel:+447542699546" className="footer__contact-link">Tel: +44 7542 699 546</a>
            <a href="mailto:info@saltech.ltd" className="footer__contact-link">Email: info@saltech.ltd</a>
          </div>

          <ul className="footer__social" aria-label="Social links">
            <li>
              <a href="#" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11.25H3V9.75zm7.5 0h3.83v1.54h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.09V21H19.1v-4.9c0-1.17-.02-2.68-1.64-2.68-1.64 0-1.89 1.28-1.89 2.6V21H11.6c0-3.75 0-7.5.02-11.25h-.12z" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">
          Saltech Consulting Ltd | Registered in England &amp; Wales (Company No. 14906407) | Registered Office: 1 The Bluebells, Shaftesbury, SP7 8GW, United Kingdom.
        </p>
      </div>
    </footer>
  );
}
