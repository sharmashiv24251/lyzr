"use client";

import React, { useState, useEffect, useCallback } from "react";
import s from "./Navbar.module.css";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Platform", href: "#platform" },
  { label: "Build", href: "#build" },
  { label: "Security", href: "#sovereign" },
  { label: "Customers", href: "#customers" },
  { label: "Resources", href: "#resources" },
  { label: "Pricing", href: "#cta" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close menu when pressing Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeMenu]);

  // Close menu if viewport is resized past breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 920 && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, closeMenu]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  return (
    <>
      <header className={`${s.header} ${isOpen ? s.headerOpen : ""}`}>
        <div className={s.container}>
          {/* Brand Logo */}
          <div className={s.brandGroup}>
            <a href="#top" aria-label="Lyzr Home" className={s.brandLogo} onClick={closeMenu}>
              <img
                src="/assets/lyzr-wordmark-light.png"
                alt="Lyzr"
                width="441"
                height="170"
                loading="eager"
                decoding="async"
                className={s.logoImage}
              />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={s.desktopNav} aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className={s.navLink}>
                {item.label}
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className={s.desktopActions}>
            <a href="#cta" className={s.btnSecondary}>
              Agent Studio
            </a>
            <a href="#cta" className={s.btnPrimary}>
              Talk to us
            </a>
          </div>

          {/* Mobile Controls (Quick CTA + Hamburger) */}
          <div className={s.mobileControls}>
            <a href="#cta" className={s.mobileQuickCta} onClick={closeMenu}>
              Talk to us
            </a>
            <button
              type="button"
              className={`${s.hamburgerBtn} ${isOpen ? s.hamburgerOpen : ""}`}
              onClick={toggleMenu}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
            >
              <span className={s.bar} />
              <span className={s.bar} />
              <span className={s.bar} />
            </button>
          </div>
        </div>

        {/* Mobile Drawer Dropdown directly attached to header */}
        <div
          id="mobile-nav-menu"
          className={`${s.mobileMenu} ${isOpen ? s.mobileMenuOpen : ""}`}
          aria-hidden={!isOpen}
        >
          <ul className={s.mobileNavList}>
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className={s.mobileNavItem}>
                <a href={item.href} className={s.mobileNavLink} onClick={closeMenu}>
                  <span>{item.label}</span>
                  <span className={s.mobileNavArrow} aria-hidden="true">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className={s.mobileDivider} />

          <div className={s.mobileActionGroup}>
            <a href="#cta" className={s.mobileActionSecondary} onClick={closeMenu}>
              Agent Studio
            </a>
            <a href="#cta" className={s.mobileActionPrimary} onClick={closeMenu}>
              Talk to us
            </a>
          </div>
        </div>
      </header>

      {/* Backdrop overlay strictly below the header (z-index: 90 vs header z-index: 100) */}
      <div
        className={`${s.backdrop} ${isOpen ? s.backdropActive : ""}`}
        onClick={closeMenu}
        aria-hidden="true"
      />
    </>
  );
}
