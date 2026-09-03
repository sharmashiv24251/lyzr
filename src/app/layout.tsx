import type { Metadata } from "next";
import { JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.lyzr.ai").replace(
  /\/$/,
  "",
);

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: "Lyzr · Agents in production",
  description:
    "Lyzr is the layer between a working agent and a governed one, with registry, policy, simulation, observability and guardrails running inside your own cloud.",
  openGraph: {
    title: "Lyzr · Agents in production",
    description:
      "Lyzr is the layer between a working agent and a governed one, with registry, policy, simulation, observability and guardrails running inside your own cloud.",
    url: baseUrl,
    siteName: "Lyzr",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lyzr · Agents in production",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lyzr · Agents in production",
    description:
      "Lyzr is the layer between a working agent and a governed one, with registry, policy, simulation, observability and guardrails running inside your own cloud.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${schibsted.variable} ${jetBrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
              try {
                var nav = performance.getEntriesByType('navigation')[0];
                if ((nav && nav.type === 'reload') || window.location.hash === '#cta' || window.location.hash === '#top') {
                  if (window.location.hash) {
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                  }
                  window.scrollTo(0, 0);
                }
              } catch (e) {}
            `,
          }}
        />
        <link
          rel="preload"
          as="image"
          href="/assets/one-studio-poster-mobile.webp"
          media="(max-width: 768px)"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
