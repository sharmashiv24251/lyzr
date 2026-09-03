"use client";

import React, { useRef, useState, useEffect } from "react";
import s from "./PlatformVideo.module.css";

export default function PlatformVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Ensure muted autoplay starts smoothly
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be deferred until user interaction
      });
    }
  }, []);

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleVideoClick = () => {
    // On phones / mobile screens (<= 768px), clicking zooms in/out
    if (typeof window !== "undefined" && window.innerWidth <= 768) {
      setIsZoomed((prev) => !prev);
      return;
    }

    // On desktop, clicking toggles play/pause
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <section className={s.section} data-reveal-group="" data-reveal-step="65">
      <div className={s.container}>
        <div className={s.headingGroup}>
          <h2 data-reveal="1" className={s.title}>
            One control plane for every agent.
            <br />
            <span className={s.dim}>Wherever it was built. Whoever built it.</span>
          </h2>
          <p data-reveal="1" className={s.sub}>
            Watch how Lyzr unifies governance, orchestration, simulation, and audit in a single workspace.
          </p>
        </div>

        <div className={s.frameWrapper} data-reveal="1">
          {/* Ambient backlight glow */}
          <div className={s.ambientGlow} aria-hidden="true" />

          {/* Browser / SaaS Frame */}
          <div className={s.frame}>
            {/* Title Bar */}
            <div className={s.titleBar}>
              <div className={s.trafficDots}>
                <span className={`${s.dot} ${s.dotClose}`} />
                <span className={`${s.dot} ${s.dotMin}`} />
                <span className={`${s.dot} ${s.dotMax}`} />
              </div>

              <div className={s.addressPill}>
                <svg
                  className={s.lockIcon}
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>studio.lyzr.ai</span>
              </div>

              <div className={s.statusIndicator}>
                <span className={s.livePulse} />
                <span>Agent Studio</span>
              </div>
            </div>

            {/* Video container */}
            <div
              className={s.videoWrapper}
              onClick={handleVideoClick}
              title={isZoomed ? "Tap to zoom out" : "Tap to zoom in on mobile"}
            >
              <video
                ref={videoRef}
                className={`${s.video} ${isZoomed ? s.videoZoomed : ""}`}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                poster="/assets/one-studio-poster.webp"
              >
                <source src="/assets/one-studio.mp4" type="video/mp4" />
                <source
                  src="https://www.lyzr.ai/wp-content/uploads/2026/05/One-Studio.-Infinite-Possibilities.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              {/* Mobile Zoom Indicator Pill */}
              <div className={s.zoomHint}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {isZoomed ? (
                    <>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </>
                  ) : (
                    <>
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </>
                  )}
                </svg>
                <span>{isZoomed ? "Tap to reset" : "Tap to zoom in"}</span>
              </div>

              {/* Audio toggle button */}
              <button
                type="button"
                className={s.soundBtn}
                onClick={toggleSound}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <line x1="23" y1="9" x2="17" y2="15" />
                      <line x1="17" y1="9" x2="23" y2="15" />
                    </svg>
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                    </svg>
                    <span>Mute</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
