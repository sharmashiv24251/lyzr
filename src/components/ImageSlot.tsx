"use client";

import React from "react";

interface ImageSlotProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  src?: string;
  placeholder?: string;
  shape?: "rect" | "rounded" | "circle" | "pill";
  radius?: number | string;
  style?: React.CSSProperties;
  className?: string;
  fit?: "cover" | "contain";
  /* object-position for the inner image, e.g. "top" to keep the head of a
     tall artwork visible when the frame is shorter than the source. */
  position?: string;
  priority?: boolean;
}

export default function ImageSlot({
  id,
  src,
  placeholder,
  shape = "rect",
  radius,
  style,
  className,
  fit = "cover",
  position,
  priority = false,
  ...rest
}: ImageSlotProps) {
  // If id is lz-founder and no src provided, default to founder-siva.webp from assets
  const resolvedSrc = src || (id === "lz-founder" ? "/assets/founder-siva.webp" : undefined);

  let borderRadius = "";
  if (shape === "circle") borderRadius = "50%";
  else if (shape === "pill") borderRadius = "var(--radius-full, 9999px)";
  else if (shape === "rounded") borderRadius = radius ? (typeof radius === "number" ? `${radius}px` : radius) : "var(--radius-lg, 14px)";

  // Compute WebP source and fallback if applicable
  const webpSrc = resolvedSrc?.endsWith(".webp")
    ? resolvedSrc
    : resolvedSrc?.replace(/\.(png|jpg|jpeg)$/i, ".webp");

  return (
    <div
      id={id}
      className={className}
      data-squircle={shape === "rounded" ? "" : undefined}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius,
        overflow: "hidden",
        ...style,
      }}
      {...rest}
    >
      {resolvedSrc ? (
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <picture>
            {webpSrc && webpSrc !== resolvedSrc && (
              <source srcSet={webpSrc} type="image/webp" />
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolvedSrc}
              alt={placeholder || ""}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              style={{
                width: "100%",
                height: "100%",
                objectFit: fit,
                objectPosition: position,
                display: "block",
              }}
            />
          </picture>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 16,
            textAlign: "center",
            background: "rgba(127,127,127,.08)",
            color: "#6E6C66",
            border: "1px dashed rgba(127,127,127,.25)",
            borderRadius,
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.5 }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span
            style={{
              fontFamily:
                "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
              fontSize: 12.5,
              lineHeight: 1.3,
              opacity: 0.75,
              maxWidth: "90%",
            }}
          >
            {placeholder || "Drop an image"}
          </span>
        </div>
      )}
    </div>
  );
}
