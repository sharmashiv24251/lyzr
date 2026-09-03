"use client";

import { useEffect, type ReactNode } from "react";

/**
 * Progressive enhancement for the landing page's reveal and count-up motion.
 * Keeping this behavior in a leaf Client Component lets the page itself remain
 * a Server Component and avoids shipping the full page module to the browser.
 */
export default function LandingMotion({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const navigation = performance.getEntriesByType(
      "navigation",
    )[0] as PerformanceNavigationTiming | undefined;
    const shouldResetScroll =
      navigation?.type === "reload" ||
      window.location.hash === "#cta" ||
      window.location.hash === "#top";

    if (shouldResetScroll) {
      if (window.location.hash) {
        window.history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const revealGroups = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal-group]"),
    );
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let groupObserver: IntersectionObserver | undefined;
    let standaloneObserver: IntersectionObserver | undefined;

    if (prefersReducedMotion) {
      revealElements.forEach((element) => element.classList.add("lz-in"));
    } else {
      groupObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const group = entry.target as HTMLElement;
            const items = Array.from(
              group.querySelectorAll<HTMLElement>("[data-reveal]"),
            ).filter(
              (element) => element.closest("[data-reveal-group]") === group,
            );
            const step = Number.parseInt(
              group.getAttribute("data-reveal-step") ?? "50",
              10,
            );

            items.forEach((element, index) => {
              if (element.classList.contains("lz-in")) return;
              const explicitDelay = element.getAttribute("data-reveal-delay");
              const delay =
                explicitDelay === null
                  ? index * step
                  : Number.parseInt(explicitDelay, 10);
              element.style.setProperty("--reveal-delay", `${delay}ms`);
              element.classList.add("lz-in");
            });
            groupObserver?.unobserve(group);
          });
        },
        { rootMargin: "0px 0px -40px 0px", threshold: 0.08 },
      );
      revealGroups.forEach((group) => groupObserver?.observe(group));

      standaloneObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target as HTMLElement;
            element.classList.add("lz-in");
            standaloneObserver?.unobserve(element);
          });
        },
        { rootMargin: "0px 0px -40px 0px", threshold: 0.08 },
      );
      revealElements
        .filter((element) => !element.closest("[data-reveal-group]"))
        .forEach((element) => standaloneObserver?.observe(element));
    }

    const timers = new Set<number>();
    const formatCount = (value: number) =>
      Math.round(value).toLocaleString("en-US");
    const animateCount = (element: HTMLElement) => {
      const rawTarget = element.dataset.count;
      if (!rawTarget) return;

      const target = Number.parseFloat(rawTarget);
      const startedAt = performance.now();
      const step = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / 1200);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = formatCount(target * (0.62 + 0.38 * eased));

        if (progress < 1) {
          requestAnimationFrame(step);
          return;
        }
        if (!element.dataset.live) return;

        let liveValue = target;
        const scheduleTick = (delay: number) => {
          const timer = window.setTimeout(() => {
            timers.delete(timer);
            tick();
          }, delay);
          timers.add(timer);
        };
        const tick = () => {
          liveValue += 1 + Math.floor(Math.random() * 3);
          element.textContent = formatCount(liveValue);
          element.classList.remove("lz-count-ticked");
          void element.offsetWidth;
          element.classList.add("lz-count-ticked");
          scheduleTick(1600 + Math.random() * 2200);
        };
        scheduleTick(2200);
      };
      requestAnimationFrame(step);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target as HTMLElement);
          countObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.4 },
    );
    document
      .querySelectorAll<HTMLElement>("[data-count]")
      .forEach((element) => countObserver.observe(element));

    return () => {
      groupObserver?.disconnect();
      standaloneObserver?.disconnect();
      countObserver.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return <div style={{ overflowX: "clip" }}>{children}</div>;
}
