import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lyzr — Agents in production",
  description:
    "Lyzr is the layer between a working agent and a governed one — registry, policy, simulation, observability and guardrails, running inside your own cloud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
