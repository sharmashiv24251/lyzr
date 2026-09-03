"use client";

import React from "react";
import styles from "./FooterWordmark.module.css";

interface FooterWordmarkProps {
  className?: string;
}

export default function FooterWordmark({ className }: FooterWordmarkProps) {
  return (
    <div
      data-reveal="1"
      className={`${styles.container} ${className || ""}`}
    >
      <a
        href="#top"
        aria-label="Back to top"
        className={styles.link}
      >
        <svg
          viewBox="0 0 346.3 184.57"
          preserveAspectRatio="xMidYMid meet"
          className={styles.svg}
          role="img"
          aria-label="lyzr"
        >
          <path
            d="M42.09 146.48L24.32 146.48Q12.60 146.48 6.30 140.77Q0 135.06 0 124.32L0 0L29.10 0L29.10 119.73Q29.10 122.95 30.03 124.07Q30.96 125.20 33.98 125.20L42.09 125.20L42.09 146.48M82.04 184.57L60.65 184.57L60.65 163.28L78.32 163.28Q81.84 163.28 83.40 159.18L85.94 152.15L41.21 41.02L73.73 41.02L99.52 121.48L125.30 41.02L157.72 41.02L108.70 167.19Q104.89 176.95 98.05 180.76Q91.21 184.57 82.04 184.57M255.48 146.48L162.02 146.48L162.02 125.78L217.49 65.33L164.85 65.33L164.85 41.02L254.30 41.02L254.30 62.01L198.54 122.07L255.48 122.07L255.48 146.48M302.16 146.48L273.06 146.48L273.06 41.02L301.18 41.02L301.18 59.08Q306.36 48.63 315.05 43.55Q323.74 38.48 333.90 38.48Q336.93 38.48 340.10 38.96Q343.27 39.45 346.30 40.63L344.05 65.43Q337.71 63.67 331.85 63.67Q327.06 63.67 321.84 65.33Q316.61 66.99 312.17 71.19Q307.73 75.39 304.94 82.91Q302.16 90.43 302.16 102.15Z"
            fill="#000000"
          />
        </svg>
      </a>
    </div>
  );
}
