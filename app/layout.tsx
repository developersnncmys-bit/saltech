import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saltech | Engineering, Control Room & Industrial Solutions",
  description:
    "Saltech designs, manufactures and integrates mosaic mimic panels, control-room systems, hazardous-area solutions and specialist industrial packages for demanding applications.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
        />
        <link rel="preload" as="image" href="/images/hero-banner-section.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
