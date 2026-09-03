"use client";

import React, { useEffect, useState } from "react";
import ImageSlot from "@/components/ImageSlot";
import AgentLifecycle from "@/components/AgentLifecycle";
import PlatformVideo from "@/components/PlatformVideo";
import ToolSprawl from "@/components/ToolSprawl";
import Navbar from "@/components/Navbar";

interface BrandTile {
  name: string;
  sub: string;
  size: number;
  weight: string;
  tracking: string;
  hasBadge: boolean;
}

const BRAND_TILES: readonly BrandTile[] = [
  { name: "WTW", sub: "retirement advisory", size: 20, weight: "700", tracking: ".02em", hasBadge: true },
  { name: "accenture", sub: "corporate VC", size: 18, weight: "400", tracking: "-.03em", hasBadge: true },
  { name: "HITACHI", sub: "marketing at scale", size: 16, weight: "600", tracking: ".06em", hasBadge: true },
  { name: "VERIFONE", sub: "payments ops", size: 15, weight: "600", tracking: ".04em", hasBadge: false },
  { name: "Firstsource", sub: "BPO orchestration", size: 17, weight: "600", tracking: "-.025em", hasBadge: true },
  { name: "AirAsia MOVE", sub: "customer service", size: 15.5, weight: "600", tracking: "-.02em", hasBadge: false },
  { name: "IBM", sub: "watsonx catalogue", size: 21, weight: "700", tracking: ".01em", hasBadge: false },
  { name: "aws", sub: "bedrock-native", size: 21, weight: "700", tracking: "-.04em", hasBadge: false },
  { name: "NVIDIA", sub: "inference partner", size: 15, weight: "600", tracking: ".05em", hasBadge: false },
  { name: "Microsoft", sub: "azure ai foundry", size: 17, weight: "500", tracking: "-.02em", hasBadge: false },
  { name: "salesforce", sub: "agentforce", size: 17, weight: "600", tracking: "-.03em", hasBadge: false },
  { name: "Google Cloud", sub: "vertex ai", size: 15.5, weight: "500", tracking: "-.02em", hasBadge: false },
];

export default function LandingPage() {
  const [sovereignTab, setSovereignTab] = useState<"vpc" | "optimus">("vpc");
  useEffect(() => {
    // 1. Reveal observer
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const ease = 'cubic-bezier(.16,1,.3,1)';
    const show = () =>
      els.forEach((e) => {
        e.dataset.revealed = '1';
        e.style.opacity = '1';
        e.style.transform = 'none';
        e.style.willChange = 'auto';
      });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.visibilityState !== 'visible') {
      show();
    } else {
      els.forEach((el) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(16px)';
        el.style.willChange = 'opacity,transform';
      });

      const failsafe = setTimeout(() => {
        els.forEach((e) => {
          if (e.dataset.revealed === '1') return;
          e.dataset.revealed = '1';
          e.style.transition = 'opacity .5s ' + ease;
          e.style.opacity = '1';
          e.style.transform = 'none';
        });
      }, 900);

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target as HTMLElement;
            const sibs = Array.from(el.parentElement ? el.parentElement.children : []).filter(
              (n) => n.hasAttribute && (n as HTMLElement).hasAttribute('data-reveal')
            );
            const d = Math.min(sibs.indexOf(el), 3) * 70;
            el.dataset.revealed = '1';
            el.style.transition = 'opacity .78s ' + ease + ' ' + d + 'ms, transform .78s ' + ease + ' ' + d + 'ms';
            el.style.opacity = '1';
            el.style.transform = 'none';
            setTimeout(() => {
              el.style.willChange = 'auto';
            }, 1000 + d);
            io.unobserve(el);
          });
        },
        { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
      );
      els.forEach((el) => io.observe(el));
    }

    // 2. Animated counters
    let liveTimer: NodeJS.Timeout;
    const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
    const run = (el: HTMLElement) => {
      const raw = el.getAttribute('data-count');
      if (!raw) return;
      const target = parseFloat(raw);
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1500);
        const e = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt(target * (0.62 + 0.38 * e));
        if (t < 1) requestAnimationFrame(step);
        else if (el.hasAttribute('data-live')) {
          let v = target;
          const tick = () => {
            v += 1 + Math.floor(Math.random() * 3);
            el.textContent = fmt(v);
            liveTimer = setTimeout(tick, 1600 + Math.random() * 2200);
          };
          liveTimer = setTimeout(tick, 2200);
        }
      };
      requestAnimationFrame(step);
    };

    const countIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run(e.target as HTMLElement);
            countIo.unobserve(e.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    Array.from(document.querySelectorAll<HTMLElement>('[data-count]')).forEach((el) => countIo.observe(el));

    // 3. Card hover effect
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-card]'));
    const handleEnter = (e: MouseEvent) => {
      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
    };
    const handleLeave = (e: MouseEvent) => {
      (e.currentTarget as HTMLElement).style.transform = 'none';
    };
    cards.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter);
      el.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      clearTimeout(liveTimer);
      cards.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter);
        el.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  // overflow-x must be `clip`, not `hidden`: `hidden` establishes a scroll
  // container, which silently breaks `position: sticky` for every descendant
  // (the pinned lifecycle stage never engaged). `clip` still prevents
  // horizontal scroll but creates no scrollport.
  return (
<div style={{ overflowX: "clip" }}>

<Navbar />

<section id="top" style={{ padding: "clamp(32px,4vw,64px) clamp(18px,4vw,48px) clamp(20px,2.2vw,32px)" }}>
  <div style={{ maxWidth: "1040px", margin: "0 auto", textAlign: "center" }}>
    <h1 data-reveal="1" style={{ margin: "0", fontSize: "clamp(42px,6.2vw,88px)", fontWeight: "500", letterSpacing: "-.045em", lineHeight: ".97", textWrap: "balance" }}>Demos are easy.<br /><span style={{ color: "#A2A29C" }}>Production is the job.</span></h1>
    <p data-reveal="1" style={{ margin: "clamp(20px,2.2vw,28px) auto 0", maxWidth: "34em", fontSize: "clamp(17px,1.3vw,20px)", color: "#5C5C58", letterSpacing: "-.012em", textWrap: "pretty" }}>Lyzr is the layer between a working agent and a governed one &mdash; registry, policy, simulation, observability and guardrails, running inside your own cloud.</p>
    <div data-reveal="1" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "clamp(26px,2.8vw,36px)" }}>
      <a href="#cta" data-squircle="" style={{ fontSize: "16px", fontWeight: "500", padding: "14px 24px", borderRadius: "var(--radius-md, 10px)", background: "var(--lz-accent,#C1502E)", color: "#fff" }}>Talk to us</a>
      <a href="#platform" data-squircle="" style={{ fontSize: "16px", fontWeight: "500", padding: "14px 24px", borderRadius: "var(--radius-md, 10px)", border: "1px solid #DEDED9", color: "#0B0B0B" }}>See the control plane</a>
    </div>
  </div>
</section>

<div id="platform">
  <div className="lz-desktop-platform">
    <AgentLifecycle />
  </div>
  <div className="lz-mobile-platform">
    <PlatformVideo />
  </div>
</div>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(66px,8vw,116px)" }}>
  
    <div data-reveal="1" data-squircle="" style={{ maxWidth: "1280px", margin: "0 auto", background: "var(--lz-tint,#FBF3EF)", border: "1px solid #F0E1D9", borderRadius: "var(--radius-xl)", padding: "clamp(20px,2.2vw,30px) clamp(20px,2.4vw,34px)", display: "flex", flexWrap: "wrap", gap: "clamp(18px,3vw,44px)" }}>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>agents in production</div>
        <div data-count="1047" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>1,047</div>
      </div>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>policy checks today</div>
        <div data-count="482193" data-live="1" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>482,193</div>
      </div>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>unsafe outputs stopped</div>
        <div data-count="3204" data-live="1" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px", color: "var(--lz-accent,#C1502E)" }}>3,204</div>
      </div>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>uptime, all deployments</div>
        <div style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>99.9%</div>
      </div>
    </div>
  
</section>

<section id="customers" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

    <div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,48px)", alignItems: "flex-end", marginBottom: "clamp(26px,3vw,40px)" }}>
      <h2 style={{ margin: "0", flex: "1 1 460px", maxWidth: "24em", fontSize: "clamp(28px,3.3vw,50px)", fontWeight: "500", letterSpacing: "-.034em", lineHeight: "1.05" }}>In production at 500+ enterprises. <span style={{ color: "#A2A29C" }}>Built on the clouds they already trust.</span></h2>
      <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "9px", fontSize: "16px", fontWeight: "500", paddingBottom: "6px", whiteSpace: "nowrap" }}>Read the case studies <span style={{ color: "#A2A29C" }}>→</span></a>
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,1.6vw,20px)" }}>

      <div data-reveal="1" className="lz-brand-wall">
        {BRAND_TILES.map((brand) => (
          <div
            key={brand.name}
            data-squircle=""
            className="lz-brand-card"
          >
            {brand.hasBadge && (
              <span className="lz-brand-badge">↗</span>
            )}
            <span
              className="lz-brand-title"
              style={{
                "--brand-size": `${brand.size}px`,
                "--brand-weight": brand.weight,
                "--brand-tracking": brand.tracking,
              } as React.CSSProperties}
            >
              {brand.name}
            </span>
            <span className="lz-brand-sub">{brand.sub}</span>
          </div>
        ))}
      </div>

      <div data-reveal="1" data-squircle="" style={{ flex: "1 1 262px", minWidth: "0", background: "#0B0B0B", borderRadius: "var(--radius-xl)", padding: "22px 22px 20px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <span style={{ position: "absolute", left: "0", top: "0", right: "0", height: "150px", background: "radial-gradient(70% 100% at 30% 0%,var(--lz-glow,rgba(193,80,46,.4)),transparent 72%)", pointerEvents: "none" }}></span>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "9px" }}>
          <span data-squircle="" style={{ padding: "5px 8px", borderRadius: "var(--radius-xs, 6px)", background: "#fff", fontSize: "11.5px", fontWeight: "700", letterSpacing: ".02em", color: "#0B0B0B" }}>WTW</span>
          <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>wtw · in production</span>
        </div>
        <div style={{ position: "relative", marginTop: "auto", paddingTop: "34px" }}>
          <div style={{ fontSize: "clamp(38px,3.8vw,54px)", fontWeight: "500", letterSpacing: "-.042em", lineHeight: ".94", color: "#fff" }}>1 yr+</div>
          <p style={{ margin: "9px 0 0", fontSize: "14px", lineHeight: "1.5", color: "rgba(255,255,255,.62)", letterSpacing: "-.01em", maxWidth: "20em" }}>A governed retirement advisor that brought customers back from ChatGPT.</p>
          <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,.12)", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px" }}><span style={{ color: "rgba(255,255,255,.45)" }}>compliance</span><span style={{ color: "#fff" }}>100%</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px" }}><span style={{ color: "rgba(255,255,255,.45)" }}>agents live</span><span style={{ color: "#fff" }}>12</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px" }}><span style={{ color: "rgba(255,255,255,.45)" }}>audit exports</span><span style={{ color: "var(--lz-lite,#E08A67)" }}>340</span></div>
          </div>
        </div>
      </div>

    </div>

    <div data-reveal="1" style={{ marginTop: "clamp(20px,2.2vw,28px)", paddingTop: "clamp(18px,2vw,24px)", borderTop: "1px solid #EDEDE8", display: "flex", flexWrap: "wrap", gap: "clamp(16px,2.6vw,40px)", alignItems: "baseline" }}>
      <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#B4B4AE", flex: "none" }}>recognised by</span>
      <span style={{ flex: "1 1 auto", display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.2vw,32px)", fontSize: "14px", color: "#8E8E88", letterSpacing: "-.01em" }}>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>Gartner</span> · Tech Innovator in Agentic AI</span>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>IDC</span> · Top orchestration platform</span>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>Everest</span> · HR &amp; BFSI</span>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>CB Insights</span> · Top 100 AI</span>
      </span>
    </div>

  </div>
</section>

<section id="surfaces" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(30px,3.4vw,50px)", maxWidth: "22em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Registry, policy, traces, guardrails, cost.<br /><span data-dim="1">Every one of them, without a rewrite.</span></h2>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,330px),1fr))", gap: "clamp(14px,1.6vw,22px)", alignItems: "stretch" }}>


      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Register the agents you didn&apos;t build. <span data-dim="1">Nothing gets rewritten.</span></h3>
          <a href="#cta" aria-label="Explore the registry" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "8px", padding: "9px 14px", borderBottom: "1px solid #EFEFEB", background: "#FCFCFB", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>
            <span style={{ flex: "1.5" }}>agent</span><span style={{ flex: "1" }}>built on</span><span style={{ flex: ".85" }}>runs / day</span><span style={{ flex: ".6", textAlign: "right" }}>state</span>
          </div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Claims Triage</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>bedrock</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>18,402</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>KYC Reviewer</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>azure ai</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>6,110</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Collections Desk</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>langchain</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>2,988</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Renewals Analyst</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>vertex</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>941</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#A8A8A2" }}>STAGED</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", fontSize: "13px", alignItems: "center", background: "var(--lz-tint,#FBF3EF)", animation: "lzRowIn 8s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Vendor Diligence</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>agentforce</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-ink2,#B08574)" }}>—</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "var(--lz-accent,#C1502E)" }}>SYNCED</span></div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Policy runs before the model does. <span data-dim="1">Every call, every time.</span></h3>
          <a href="#cta" aria-label="Explore policy" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "16px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "11px" }}>
            <span>request</span><span>outcome</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 17px 1fr", rowGap: "9px", alignItems: "center" }}>
            <div style={{ gridColumn: "2", gridRow: "1 / span 4", justifySelf: "center", width: "1px", height: "100%", background: "repeating-linear-gradient(180deg,#DEDED9 0 4px,transparent 4px 9px)" }}></div>

            <div style={{ gridColumn: "1", gridRow: "1", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "#8E8E88" }}></span>summarise policy</span></div>
            <div style={{ gridColumn: "3", gridRow: "1", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C7A66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out .35s infinite", animationPlayState: "var(--lz-play,running)" }}>ALLOWED</div>

            <div style={{ gridColumn: "1", gridRow: "2", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) .55s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "#8E8E88" }}></span>issue refund $4,200</span></div>
            <div style={{ gridColumn: "3", gridRow: "2", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C7A66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out .9s infinite", animationPlayState: "var(--lz-play,running)" }}>ALLOWED · LOGGED</div>

            <div style={{ gridColumn: "1", gridRow: "3", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--lz-tint2,#E4CFC6)", background: "var(--lz-tint,#FBF3EF)", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) 1.1s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-accent,#C1502E)" }}></span>lookup SSN ···9930</span></div>
            <div style={{ gridColumn: "3", gridRow: "3", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "var(--lz-accent,#C1502E)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out 1.45s infinite", animationPlayState: "var(--lz-play,running)" }}>HELD AT GATE</div>

            <div style={{ gridColumn: "1", gridRow: "4", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) 1.65s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "#8E8E88" }}></span>escalate to human</span></div>
            <div style={{ gridColumn: "3", gridRow: "4", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C5C58", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out 2s infinite", animationPlayState: "var(--lz-play,running)" }}>ROUTED · RISK</div>
          </div>
          <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px solid #F1F1ED", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px", color: "#A8A8A2" }}><span>role · budget · residency · retention</span><span style={{ color: "#5C5C58" }}>24 rules</span></div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>See every step an agent took. <span data-dim="1">Down to the token.</span></h3>
          <a href="#cta" aria-label="Explore traces" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "4px" }}><span style={{ textTransform: "uppercase" }}>claims triage</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>run_8f2c91</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#BDBDB7" }}>retrieve</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "34%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>180ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#BDBDB7" }}>plan</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "58%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) .3s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>420ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#BDBDB7" }}>tool·crm</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "76%", background: "var(--lz-accent,#C1502E)", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) .6s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-accent,#C1502E)" }}>760ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#BDBDB7" }}>draft</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "46%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) .9s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>310ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#BDBDB7" }}>verify</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "22%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) 1.2s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>140ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#BDBDB7" }}>policy</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "18%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) 1.5s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>90ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#BDBDB7" }}>redact</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "12%", background: "var(--lz-accent,#C1502E)", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) 1.8s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-accent,#C1502E)" }}>60ms</span></div>
          <div style={{ display: "flex", gap: "14px", marginTop: "6px", paddingTop: "11px", borderTop: "1px solid #F4F4F0" }}>
            <span style={{ flex: "1" }}><span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7" }}>total</span><span style={{ display: "block", fontSize: "14px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "2px" }}>1.96s</span></span>
            <span style={{ flex: "1" }}><span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7" }}>tokens</span><span style={{ display: "block", fontSize: "14px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "2px" }}>4,318</span></span>
            <span style={{ flex: "1" }}><span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7" }}>cost</span><span style={{ display: "block", fontSize: "14px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "2px" }}>$0.031</span></span>
          </div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Rehearse before you ship. <span data-dim="1">Fifty thousand times.</span></h3>
          <a href="#cta" aria-label="Explore the simulation engine" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "10px" }}><span>simulation</span><span style={{ marginLeft: "auto" }}>claims-triage v15 · pre-prod</span></div>
          <div style={{ display: "flex", gap: "10px", paddingBottom: "11px", borderBottom: "1px solid #F1F1ED" }}>
            <div style={{ flex: "1" }}><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#A8A8A2" }}>scenarios</div><div style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "3px" }}>50,000</div></div>
            <div style={{ flex: "1" }}><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#A8A8A2" }}>adversarial</div><div style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "3px" }}>2,400</div></div>
            <div style={{ flex: "1" }}><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#A8A8A2" }}>six sigma</div><div style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "3px" }}>5.8&#963;</div></div>
          </div>
          <div style={{ marginTop: "11px", display: "flex", flexDirection: "column", gap: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ flex: "1", color: "#44443F" }}>tier-2 cover</span><span style={{ flex: "none", width: "70px", height: "4px", background: "#F1F1ED" }}><span style={{ display: "block", height: "100%", width: "99%", background: "#5C8A70" }}></span></span><span style={{ flex: "none", width: "44px", textAlign: "right", color: "#4E7360" }}>99.4%</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ flex: "1", color: "#44443F" }}>duplicate claim</span><span style={{ flex: "none", width: "70px", height: "4px", background: "#F1F1ED" }}><span style={{ display: "block", height: "100%", width: "97%", background: "#5C8A70" }}></span></span><span style={{ flex: "none", width: "44px", textAlign: "right", color: "#4E7360" }}>97.2%</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ flex: "1", color: "#44443F" }}>policy edge case</span><span style={{ flex: "none", width: "70px", height: "4px", background: "#F1F1ED" }}><span style={{ display: "block", height: "100%", width: "38%", background: "var(--lz-accent,#C1502E)" }}></span></span><span style={{ flex: "none", width: "44px", textAlign: "right", color: "var(--lz-accent,#C1502E)" }}>held</span></div>
          </div>
          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #F1F1ED", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>
            <span>2 failures reproduced</span>
            <a
              href="/assets/claim-letter.webp"
              target="_blank"
              rel="noopener noreferrer"
              title="Inspect audited claim decision artifact"
              style={{ color: "var(--lz-accent,#C1502E)", display: "inline-flex", alignItems: "center", gap: "4px", textDecoration: "none", fontWeight: "600" }}
            >
              audited draft ↗
            </a>
          </div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Know what each agent costs. <span data-dim="1">And what it sent back.</span></h3>
          <a href="#cta" aria-label="Explore cost controls" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "12px" }}><span>cost / week</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>last 7</span></div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "92px" }}>
            <span style={{ flex: "1", height: "38%", background: "#E9E9E3", borderRadius: "3px 3px 0 0", transformOrigin: "bottom", animation: "lzRise 7s cubic-bezier(.3,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span>
            <span style={{ flex: "1", height: "52%", background: "#E9E9E3", borderRadius: "3px 3px 0 0", transformOrigin: "bottom", animation: "lzRise 7s cubic-bezier(.3,0,.2,1) .09s infinite", animationPlayState: "var(--lz-play,running)" }}></span>
            <span style={{ flex: "1", height: "44%", background: "#E9E9E3", borderRadius: "3px 3px 0 0", transformOrigin: "bottom", animation: "lzRise 7s cubic-bezier(.3,0,.2,1) .18s infinite", animationPlayState: "var(--lz-play,running)" }}></span>
            <span style={{ flex: "1", height: "69%", background: "#E9E9E3", borderRadius: "3px 3px 0 0", transformOrigin: "bottom", animation: "lzRise 7s cubic-bezier(.3,0,.2,1) .27s infinite", animationPlayState: "var(--lz-play,running)" }}></span>
            <span style={{ flex: "1", height: "61%", background: "#E9E9E3", borderRadius: "3px 3px 0 0", transformOrigin: "bottom", animation: "lzRise 7s cubic-bezier(.3,0,.2,1) .36s infinite", animationPlayState: "var(--lz-play,running)" }}></span>
            <span style={{ flex: "1", height: "84%", background: "var(--lz-mid,#E4B9A8)", borderRadius: "3px 3px 0 0", transformOrigin: "bottom", animation: "lzRise 7s cubic-bezier(.3,0,.2,1) .45s infinite", animationPlayState: "var(--lz-play,running)" }}></span>
            <span style={{ flex: "1", height: "100%", background: "var(--lz-accent,#C1502E)", borderRadius: "3px 3px 0 0", transformOrigin: "bottom", animation: "lzRise 7s cubic-bezier(.3,0,.2,1) .54s infinite", animationPlayState: "var(--lz-play,running)" }}></span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "7px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#C6C6C0" }}><span>mon</span><span>sun</span></div>
          <div style={{ marginTop: "11px", paddingTop: "11px", borderTop: "1px solid #F1F1ED", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px", color: "#8E8E88" }}>cost / resolved case</span>
            <span style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em" }}>$0.31</span>
          </div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Or start from one already running. <span data-dim="1">A hundred of them.</span></h3>
          <a href="#cta" aria-label="Explore blueprints" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 13px", borderBottom: "1px solid #EFEFEB", background: "#FCFCFB", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}><span>blueprints</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>bfsi · hr · support</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>JZ</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Jazon</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI SDR</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>312 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>DI</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Diane</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI HR partner</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>188 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>DW</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Dwight</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI RFP scout</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>96 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", background: "var(--lz-tint,#FBF3EF)", animation: "lzRowIn 8.5s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "var(--lz-hair,#F1DED6)", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-ink2,#B08574)" }}>SK</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Skott</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI marketer</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-accent,#C1502E)" }}>CLONING</span></div>
        </div>
      </div>


    </div>
  </div>
</section>

<section id="sprawl" className="lz-sprawl-section" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
    <h2 data-reveal="1" style={{ margin: "0 auto", maxWidth: "20em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Six tools. One agent.<br /><span style={{ color: "#A2A29C" }}>Nobody accountable.</span></h2>
    <p data-reveal="1" style={{ margin: "18px auto 0", maxWidth: "33em", fontSize: "clamp(16px,1.2vw,19px)", color: "#5C5C58", letterSpacing: "-.012em" }}>This is what taking a single agent to production looks like without a control plane.</p>
    <div style={{ margin: "clamp(30px,3.6vw,52px) auto 0" }}>
      <ToolSprawl />
    </div>
    <p data-reveal="1" style={{ margin: "16px auto 0", fontSize: "11.5px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#B8B8B2" }}>six systems · four owners · no audit trail</p>
  </div>
</section>

<section id="sovereign" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,72px)", alignItems: "center" }}>
    <div data-reveal="1" style={{ flex: "1 1 340px", minWidth: "0" }}>
      <h2 style={{ margin: "0", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Your cloud. Your models.<br /><span style={{ color: "#A2A29C" }}>Your IP.</span></h2>
      <p style={{ margin: "22px 0 0", maxWidth: "28em", fontSize: "clamp(16px,1.2vw,19px)", color: "#5C5C58", letterSpacing: "-.012em" }}>Lyzr deploys inside your environment. Prompts, traces and customer data never cross the boundary, and the agents you build stay yours to take anywhere.</p>
      <div style={{ marginTop: "26px", maxWidth: "30em" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "13px 0", borderTop: "1px solid #EAEAE5", fontSize: "14.5px" }}><span style={{ color: "#5C5C58" }}>Runs in</span><span style={{ letterSpacing: "-.01em" }}>VPC, private cloud or air-gapped</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "13px 0", borderTop: "1px solid #EAEAE5", fontSize: "14.5px" }}><span style={{ color: "#5C5C58" }}>Models</span><span style={{ letterSpacing: "-.01em" }}>Any provider, swappable</span></div>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "13px 0", borderTop: "1px solid #EAEAE5", borderBottom: "1px solid #EAEAE5", fontSize: "14.5px" }}><span style={{ color: "#5C5C58" }}>Certified</span><span style={{ letterSpacing: "-.01em" }}>SOC 2 Type II · ISO 27001 · HIPAA · GDPR</span></div>
      </div>
      <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginTop: "24px", fontSize: "16px", fontWeight: "500", color: "var(--lz-accent,#C1502E)" }}>Read the security brief <span>→</span></a>
    </div>
    <div data-reveal="1" data-squircle="" style={{ flex: "1 1 400px", minWidth: "0", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.6vw,36px)" }}>
      {/* Switch Tabs between VPC and Optimus */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        <button
          type="button"
          onClick={() => setSovereignTab("vpc")}
          data-squircle=""
          style={{
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "500",
            borderRadius: "var(--radius-md, 10px)",
            border: "1px solid",
            borderColor: sovereignTab === "vpc" ? "var(--lz-accent,#C1502E)" : "#E7E7E2",
            background: sovereignTab === "vpc" ? "#fff" : "transparent",
            color: sovereignTab === "vpc" ? "var(--lz-accent,#C1502E)" : "#63635D",
            cursor: "pointer",
            transition: "all .2s ease",
          }}
        >
          Cloud VPC
        </button>
        <button
          type="button"
          onClick={() => setSovereignTab("optimus")}
          data-squircle=""
          style={{
            padding: "6px 14px",
            fontSize: "12px",
            fontWeight: "500",
            borderRadius: "var(--radius-md, 10px)",
            border: "1px solid",
            borderColor: sovereignTab === "optimus" ? "var(--lz-accent,#C1502E)" : "#E7E7E2",
            background: sovereignTab === "optimus" ? "#fff" : "transparent",
            color: sovereignTab === "optimus" ? "var(--lz-accent,#C1502E)" : "#63635D",
            cursor: "pointer",
            transition: "all .2s ease",
          }}
        >
          Optimus Appliance
        </button>
      </div>

      {sovereignTab === "vpc" ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div data-squircle="" style={{ width: "100%", maxWidth: "340px", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-md, 10px)", padding: "15px 16px", display: "flex", alignItems: "center", gap: "11px", animation: "lzDrift 7s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}>
            <img src="/assets/lyzr-wordmark-light.png" alt="Lyzr" width="441" height="170" loading="lazy" decoding="async" style={{ display: "block", height: "15px", width: "auto", filter: "invert(1)" }} />
            <span style={{ fontSize: "14px", fontWeight: "500", letterSpacing: "-.015em" }}>control plane</span>
            <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>policy · audit</span>
          </div>
          <div style={{ height: "58px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
            <span style={{ width: "1px", flex: "1", background: "repeating-linear-gradient(180deg,#D6D6D0 0 4px,transparent 4px 9px)" }}></span>
            <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)", whiteSpace: "nowrap" }}>control only · no data</span>
            <span style={{ width: "1px", flex: "1", background: "repeating-linear-gradient(180deg,#D6D6D0 0 4px,transparent 4px 9px)" }}></span>
          </div>
          <div data-squircle="" style={{ width: "100%", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", padding: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "14px" }}><span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>your vpc</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#BDBDB7" }}>aws · us-east-1</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: "8px" }}>
              <div data-squircle="" style={{ border: "1px solid #EFEFEB", borderRadius: "var(--radius-md, 10px)", padding: "13px 10px", textAlign: "center", background: "#FCFCFB" }}><div style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Agents</div><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#A8A8A2", marginTop: "3px" }}>running</div></div>
              <div data-squircle="" style={{ border: "1px solid #EFEFEB", borderRadius: "var(--radius-md, 10px)", padding: "13px 10px", textAlign: "center", background: "#FCFCFB" }}><div style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Models</div><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#A8A8A2", marginTop: "3px" }}>yours</div></div>
              <div data-squircle="" style={{ border: "1px solid #EFEFEB", borderRadius: "var(--radius-md, 10px)", padding: "13px 10px", textAlign: "center", background: "var(--lz-tint,#FBF3EF)" }}><div style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Data</div><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-ink2,#B08574)", marginTop: "3px" }}>stays put</div></div>
            </div>
            <div style={{ marginTop: "12px", height: "5px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "100%", background: "var(--lz-accent,#C1502E)", transformOrigin: "left", animation: "lzBar 5.5s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span></div>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div data-squircle="" style={{ position: "relative", width: "100%", maxWidth: "340px", background: "#0B0B0B", borderRadius: "var(--radius-lg, 14px)", padding: "18px 20px", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #222" }}>
            <div style={{ width: "100%", height: "170px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <picture>
                <source srcSet="/assets/optimus.webp" type="image/webp" />
                <img
                  src="/assets/optimus.png"
                  alt="Lyzr Optimus sovereign AI private agent appliance"
                  width="340"
                  height="267"
                  loading="lazy"
                  decoding="async"
                  style={{ maxHeight: "160px", width: "auto", objectFit: "contain", display: "block" }}
                />
              </picture>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #222" }}>
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#8E8E88" }}>Optimus-1 Node</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#61A87D" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#61A87D" }} />
                AIR-GAPPED · 0% EGRESS
              </span>
            </div>
          </div>
          <div data-squircle="" style={{ width: "100%", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", padding: "14px 16px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))", gap: "8px" }}>
              <div data-squircle="" style={{ border: "1px solid #EFEFEB", borderRadius: "var(--radius-md, 10px)", padding: "11px 8px", textAlign: "center", background: "#FCFCFB" }}>
                <div style={{ fontSize: "12px", fontWeight: "500", letterSpacing: "-.01em" }}>Hardware</div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#A8A8A2", marginTop: "2px" }}>Dedicated</div>
              </div>
              <div data-squircle="" style={{ border: "1px solid #EFEFEB", borderRadius: "var(--radius-md, 10px)", padding: "11px 8px", textAlign: "center", background: "#FCFCFB" }}>
                <div style={{ fontSize: "12px", fontWeight: "500", letterSpacing: "-.01em" }}>Weights</div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#A8A8A2", marginTop: "2px" }}>Local</div>
              </div>
              <div data-squircle="" style={{ border: "1px solid #EFEFEB", borderRadius: "var(--radius-md, 10px)", padding: "11px 8px", textAlign: "center", background: "var(--lz-tint,#FBF3EF)" }}>
                <div style={{ fontSize: "12px", fontWeight: "500", letterSpacing: "-.01em" }}>Network</div>
                <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "var(--lz-ink2,#B08574)", marginTop: "2px" }}>Air-gapped</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(26px,3.4vw,58px)", alignItems: "center" }}>
    <div data-reveal="1" data-squircle="" style={{ flex: "1.25 1 420px", minWidth: "0", position: "relative", borderRadius: "var(--radius-xl)", overflow: "hidden", background: "#F4F4F1" }}>
      <ImageSlot id="lz-story" shape="rect" src="/assets/story-ops.webp" placeholder="Customer operations floor" style={{ width: "100%", height: "auto", aspectRatio: "16/10" }} />
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "20px", background: "linear-gradient(180deg,transparent,rgba(11,11,11,.62))", pointerEvents: "none" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "rgba(255,255,255,.82)" }}>airasia move · customer operations</span>
      </div>
    </div>
    <div data-reveal="1" style={{ flex: "1 1 330px", minWidth: "0" }}>
      <h2 style={{ margin: "0", fontSize: "clamp(26px,2.6vw,40px)", fontWeight: "500", letterSpacing: "-.032em", lineHeight: "1.08" }}>Response time down 95%. <span style={{ color: "#A2A29C" }}>Across every market they fly.</span></h2>
      <p style={{ margin: "24px 0 0", fontSize: "clamp(16px,1.2vw,19px)", color: "#3D3D39", letterSpacing: "-.012em", maxWidth: "27em" }}>“We stopped managing tickets and started managing outcomes. The agents absorb the volume, and we can still show an auditor exactly what happened on any single case.”</p>
      <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #EAEAE5" }}>
        <div style={{ fontSize: "15px", fontWeight: "500", letterSpacing: "-.012em" }}>Head of Customer Operations</div>
        <div style={{ fontSize: "14.5px", color: "#8E8E88" }}>AirAsia MOVE</div>
      </div>
      <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginTop: "20px", fontSize: "16px", fontWeight: "500", color: "var(--lz-accent,#C1502E)" }}>All customer stories <span>→</span></a>
    </div>
  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div data-reveal="1" data-squircle="" style={{ maxWidth: "1280px", margin: "0 auto", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(20px,2.4vw,34px)", display: "flex", flexWrap: "wrap", gap: "clamp(18px,2.2vw,32px)", alignItems: "stretch" }}>

    <div style={{ flex: "1 1 250px", minWidth: "0", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div data-squircle="" style={{ borderRadius: "var(--radius-lg, 14px)", overflow: "hidden", background: "#E9E9E4", flex: "1 1 auto" }}>
        <ImageSlot id="lz-founder" shape="rect" placeholder="Founder portrait — Siva Surendira (lyzr.ai)" style={{ width: "100%", height: "auto", aspectRatio: "4/5" }} src="/assets/founder-siva.webp" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 2px" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#B4B4AE" }}>jersey city</span>
        <span style={{ flex: "1", height: "1px", background: "#E4E4DF" }}></span>
        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#B4B4AE" }}>2026</span>
      </div>
    </div>

    <div data-squircle="" style={{ flex: "1.7 1 400px", minWidth: "0", background: "#fff", border: "1px solid #EDEDE8", borderRadius: "var(--radius-lg, 14px)", padding: "clamp(24px,2.8vw,44px)", boxShadow: "0 1px 0 #F1F1EC,0 22px 44px -32px rgba(0,0,0,.2)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)" }}>a note from the founder</span>
        <span style={{ flex: "1", height: "1px", background: "var(--lz-hair,#EFE1DB)" }}></span>
      </div>
      <p style={{ margin: "clamp(20px,2.2vw,28px) 0 0", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.42", letterSpacing: "-.022em", color: "#1A1A18", maxWidth: "26em" }}>Most agent platforms sell you tools and leave your team to work out the rest. We think building an agent is the easy part now — productionisation is where the real work starts.</p>
      <p style={{ margin: "clamp(14px,1.4vw,20px) 0 0", fontSize: "clamp(15px,1.15vw,17.5px)", lineHeight: "1.62", color: "#5C5C58", letterSpacing: "-.012em", maxWidth: "32em" }}>So we operate like Palantir for the agent era: platform and people together, our engineers deep in your data, staying until the thing is live and governed. That is the whole company.</p>
      <div style={{ marginTop: "auto", paddingTop: "clamp(24px,2.6vw,36px)" }}>
        <div style={{ height: "1px", background: "#EDEDE8", marginBottom: "16px" }}></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
          <span style={{ width: "3px", height: "34px", borderRadius: "2px", background: "var(--lz-accent,#C1502E)", flex: "none" }}></span>
          <span style={{ flex: "1 1 auto", minWidth: "0" }}>
            <span style={{ display: "block", fontSize: "15.5px", fontWeight: "500", letterSpacing: "-.015em" }}>Siva Surendira</span>
            <span style={{ display: "block", fontSize: "14px", color: "#8E8E88", letterSpacing: "-.01em" }}>Founder &amp; CEO, Lyzr</span>
          </span>
          <a href="#cta" style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", whiteSpace: "nowrap" }}>read the long version ↗</a>
        </div>
      </div>
    </div>

  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(28px,3vw,44px)", maxWidth: "24em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>A platform, and the engineers who ship it. <span style={{ color: "#A2A29C" }}>Eight weeks, typically.</span></h2>
    <div data-reveal="1" data-squircle="" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(24px,2.8vw,44px)" }}>
      <div style={{ position: "relative", height: "2px", background: "#E4E4DF", borderRadius: "2px", margin: "0 0 30px" }}><span style={{ position: "absolute", inset: "0", background: "var(--lz-accent,#C1502E)", borderRadius: "2px", transformOrigin: "left", animation: "lzBar 10s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: "clamp(18px,2.2vw,34px)" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>week 1</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Pick the use case</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Applied AI architects sit with your team and choose the workflow worth automating.</p>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>week 2–4</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Co-build it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Your engineers and ours build in the same workspace, inside your environment.</p>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>week 5–7</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Harden it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Simulation, policy, guardrails and sign-off — the part most projects skip.</p>
        </div>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)" }}>week 8</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>You own it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Live in production, handed over with the IP and the roadmap.</p>
        </div>
      </div>
      <div style={{ marginTop: "clamp(26px,3vw,40px)", paddingTop: "22px", borderTop: "1px solid #E4E4DF", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: "0", fontSize: "15px", color: "#6E6E68", letterSpacing: "-.008em", maxWidth: "38em" }}>Prefer to move alone, or through a partner? Both work — 100+ partners deliver on Lyzr across BFSI, healthcare and telco.</p>
        <a href="#cta" data-squircle="" style={{ fontSize: "15px", fontWeight: "500", padding: "12px 20px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #DEDED9", whiteSpace: "nowrap" }}>Find a partner</a>
      </div>
    </div>
  </div>
</section>

<section id="resources" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(28px,3vw,44px)", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Take something with you.</h2>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,1.6vw,22px)", alignItems: "stretch" }}>
      <a data-reveal="1" data-card="1" href="#cta" style={{ flex: "1 1 250px", minWidth: "0", display: "flex", flexDirection: "column", gap: "clamp(10px,1vw,14px)" }}>
        <div data-squircle="" data-res-media="" style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: "#F4F4F1", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <ImageSlot
            id="lz-res-1"
            data-res-book=""
            shape="rect"
            src="/assets/cover-3.webp"
            placeholder="The Agentic AI Roadmap — playbook cover"
            style={{
              position: "absolute",
              width: "76%",
              height: "auto",
              aspectRatio: "1 / 2",
              top: "calc(clamp(14px,1.8vw,22px) - 15.2%)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div data-squircle="" data-res-body="" style={{ background: "#F4F4F1", borderRadius: "var(--radius-xl)", padding: "20px 22px 24px", flex: "1 1 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>playbook</div>
          <div style={{ fontSize: "19px", fontWeight: "500", letterSpacing: "-.022em", marginTop: "10px", lineHeight: "1.25" }}>Building an agentic roadmap for 2026</div>
        </div>
      </a>
      <a data-reveal="1" data-card="1" href="#cta" style={{ flex: "1 1 250px", minWidth: "0", display: "flex", flexDirection: "column", gap: "clamp(10px,1vw,14px)" }}>
        <div data-squircle="" data-res-media="" style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: "#F4F4F1", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <ImageSlot
            id="lz-res-2"
            data-res-book=""
            shape="rect"
            src="/assets/cover-1.webp"
            placeholder="101 Enterprise AI Use Cases — template cover"
            style={{
              position: "absolute",
              width: "76%",
              height: "auto",
              aspectRatio: "1 / 2",
              top: "calc(clamp(14px,1.8vw,22px) - 15.2%)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div data-squircle="" data-res-body="" style={{ background: "#F4F4F1", borderRadius: "var(--radius-xl)", padding: "20px 22px 24px", flex: "1 1 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>library</div>
          <div style={{ fontSize: "19px", fontWeight: "500", letterSpacing: "-.022em", marginTop: "10px", lineHeight: "1.25" }}>101 use cases you could deploy today</div>
        </div>
      </a>
      <a data-reveal="1" data-card="1" href="#cta" style={{ flex: "1 1 250px", minWidth: "0", display: "flex", flexDirection: "column", gap: "clamp(10px,1vw,14px)" }}>
        <div data-squircle="" data-res-media="" style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: "#F4F4F1", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <ImageSlot
            id="lz-res-3"
            data-res-book=""
            shape="rect"
            src="/assets/cover-2.webp"
            placeholder="Prototype to Production — field guide cover"
            style={{
              position: "absolute",
              width: "76%",
              height: "auto",
              aspectRatio: "1 / 2",
              top: "calc(clamp(14px,1.8vw,22px) - 15.2%)",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <div data-squircle="" data-res-body="" style={{ background: "#F4F4F1", borderRadius: "var(--radius-xl)", padding: "20px 22px 24px", flex: "1 1 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>guide</div>
          <div style={{ fontSize: "19px", fontWeight: "500", letterSpacing: "-.022em", marginTop: "10px", lineHeight: "1.25" }}>Getting a prototype past the valley of death</div>
        </div>
      </a>
    </div>
  </div>
</section>

<section id="tiers" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(30px,3.4vw,50px)", maxWidth: "22em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Start where you already are.<br /><span data-dim="1">Three ways in, one control plane.</span></h2>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(14px,1.6vw,22px)", alignItems: "stretch" }}>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(18px,2vw,26px)" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>control plane · self-serve</div>
          <h3 style={{ margin: "12px 0 0", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Govern what already runs. <span data-dim="1">Nothing moves.</span></h3>
          <p style={{ margin: "12px 0 0", fontSize: "14.5px", lineHeight: "1.55", color: "#4A4A46" }}>Register the agents your teams already built on Bedrock, Azure, LangChain or Agentforce. Add policy, traces and audit without a rewrite.</p>
        </div>
        <dl style={{ margin: "auto 0 0", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 0", borderTop: "1px solid #E4E4DF", fontSize: "13.5px" }}><dt style={{ margin: "0", color: "#63635D" }}>First agent live</dt><dd style={{ margin: "0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" }}>48h</dd></div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 0", borderTop: "1px solid #E4E4DF", fontSize: "13.5px" }}><dt style={{ margin: "0", color: "#63635D" }}>Your VPC</dt><dd style={{ margin: "0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" }}>$0.03 / run</dd></div>
        </dl>
        <a href="#cta" data-squircle="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "9px", padding: "13px 20px", borderRadius: "var(--radius-md, 10px)", background: "var(--lz-accent,#C1502E)", color: "#fff", fontSize: "15px", fontWeight: "500" }}>Start in Agent Studio <span aria-hidden="true">&#8594;</span></a>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(18px,2vw,26px)" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>agentic os · co-build</div>
          <h3 style={{ margin: "12px 0 0", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Run a whole function. <span data-dim="1">Not one workflow.</span></h3>
          <p style={{ margin: "12px 0 0", fontSize: "14.5px", lineHeight: "1.55", color: "#4A4A46" }}>A dedicated agent stack for HR, marketing, finance or service. Agents share context, feed each other, and sharpen with every cycle.</p>
        </div>
        <dl style={{ margin: "auto 0 0", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 0", borderTop: "1px solid #E4E4DF", fontSize: "13.5px" }}><dt style={{ margin: "0", color: "#63635D" }}>Pre-built agents</dt><dd style={{ margin: "0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" }}>400+</dd></div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 0", borderTop: "1px solid #E4E4DF", fontSize: "13.5px" }}><dt style={{ margin: "0", color: "#63635D" }}>Objective to live</dt><dd style={{ margin: "0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" }}>8 weeks</dd></div>
        </dl>
        <a href="#cta" data-squircle="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "9px", padding: "13px 20px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #DEDED9", color: "#0B0B0B", fontSize: "15px", fontWeight: "500" }}>Explore Agentic OS <span aria-hidden="true">&#8594;</span></a>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(18px,2vw,26px)" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2" }}>sovereign ai · regulated</div>
          <h3 style={{ margin: "12px 0 0", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Air-gapped, on your own iron. <span data-dim="1">Nothing leaves.</span></h3>
          <p style={{ margin: "12px 0 0", fontSize: "14.5px", lineHeight: "1.55", color: "#4A4A46" }}>Full stack inside your walls, for banks, insurers and government. Your models, your hardware, your keys, and a complete audit trail.</p>
        </div>
        <dl style={{ margin: "auto 0 0", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 0", borderTop: "1px solid #E4E4DF", fontSize: "13.5px" }}><dt style={{ margin: "0", color: "#63635D" }}>Data leaving</dt><dd style={{ margin: "0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" }}>0%</dd></div>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", padding: "10px 0", borderTop: "1px solid #E4E4DF", fontSize: "13.5px" }}><dt style={{ margin: "0", color: "#63635D" }}>vs frontier API cost</dt><dd style={{ margin: "0", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12px" }}>&#8722;95%</dd></div>
        </dl>
        <a href="#cta" data-squircle="" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "9px", padding: "13px 20px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #DEDED9", color: "#0B0B0B", fontSize: "15px", fontWeight: "500" }}>Talk to us <span aria-hidden="true">&#8594;</span></a>
      </div>

    </div>
  </div>
</section>

<section id="cta" style={{ padding: "0 clamp(18px,4vw,48px) clamp(70px,8vw,120px)" }}>
  <div data-reveal="1" data-squircle="" style={{ maxWidth: "1280px", margin: "0 auto", background: "#0B0B0B", borderRadius: "var(--radius-2xl)", padding: "clamp(48px,7vw,116px) clamp(24px,4vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "50%", top: "0", width: "min(760px,110%)", height: "100%", transform: "translateX(-50%)", background: "radial-gradient(60% 55% at 50% 0%,var(--lz-glow,rgba(193,80,46,.4)),transparent 70%)", pointerEvents: "none" }}></div>
    <div style={{ position: "relative" }}>
      <h2 style={{ margin: "0 auto", maxWidth: "18em", fontSize: "clamp(32px,4.4vw,70px)", fontWeight: "500", letterSpacing: "-.04em", lineHeight: "1.02", color: "#fff" }}>Bring a use case.<br /><span style={{ color: "var(--lz-lite,#E08A67)" }}>Leave with an agent in production.</span></h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "clamp(30px,3.4vw,44px)" }}>
        <a href="#top" data-squircle="" style={{ fontSize: "16px", fontWeight: "500", padding: "15px 26px", borderRadius: "var(--radius-md, 10px)", background: "var(--lz-accent,#C1502E)", color: "#fff" }}>Talk to us</a>
        <a href="#top" data-squircle="" style={{ fontSize: "16px", fontWeight: "500", padding: "15px 26px", borderRadius: "var(--radius-md, 10px)", border: "1px solid rgba(255,255,255,.24)", color: "#fff" }}>Open Agent Studio</a>
      </div>
    </div>
  </div>
</section>

<footer style={{ borderTop: "1px solid #EBEBE7", padding: "clamp(48px,5vw,76px) clamp(18px,4vw,48px) clamp(32px,3vw,44px)", background: "#FAFAF8" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,64px)" }}>
    <div style={{ flex: "1 1 240px", minWidth: "0" }}>
      <a href="#top" aria-label="Lyzr" style={{ display: "inline-flex" }}><img src="/assets/lyzr-wordmark-light.png" alt="Lyzr" width="441" height="170" loading="lazy" decoding="async" style={{ display: "block", height: "27px", width: "auto", filter: "invert(1)" }} /></a>
      <p style={{ margin: "18px 0 0", fontSize: "14px", color: "#8E8E88", letterSpacing: "-.008em", maxWidth: "22em" }}>525 Washington Blvd, 2410<br />Jersey City, NJ 07310, USA</p>
      <div style={{ marginTop: "22px", display: "flex", gap: "8px", maxWidth: "300px" }}>
        <span data-squircle="" style={{ flex: "1", padding: "11px 14px", borderRadius: "var(--radius-md, 10px)", border: "1px solid #E4E4DF", background: "#fff", fontSize: "14px", color: "#A8A8A2" }}>Work email</span>
        <span data-squircle="" style={{ padding: "11px 16px", borderRadius: "var(--radius-md, 10px)", background: "var(--lz-accent,#C1502E)", color: "#fff", fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap" }}>Subscribe</span>
      </div>
      <p style={{ margin: "11px 0 0", fontSize: "13px", color: "#A8A8A2" }}>Field notes on agents in production. Twice a month.</p>
    </div>
    <div style={{ flex: "2 1 420px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "clamp(20px,2.4vw,34px)" }}>
      <div>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>platform</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#platform" style={{ color: "#3D3D39" }}>Control plane</a><a href="#build" style={{ color: "#3D3D39" }}>Agent Studio</a><a href="#build" style={{ color: "#3D3D39" }}>Architect</a><a href="#platform" style={{ color: "#3D3D39" }}>Blueprints</a><a href="#sovereign" style={{ color: "#3D3D39" }}>Responsible AI</a></div>
      </div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>solutions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#customers" style={{ color: "#3D3D39" }}>Banking</a><a href="#customers" style={{ color: "#3D3D39" }}>Insurance</a><a href="#customers" style={{ color: "#3D3D39" }}>Customer service</a><a href="#customers" style={{ color: "#3D3D39" }}>HR</a><a href="#customers" style={{ color: "#3D3D39" }}>Marketing</a></div>
      </div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>agents</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#platform" style={{ color: "#3D3D39" }}>Jazon · SDR</a><a href="#platform" style={{ color: "#3D3D39" }}>Skott · Marketer</a><a href="#platform" style={{ color: "#3D3D39" }}>Diane · HR</a><a href="#platform" style={{ color: "#3D3D39" }}>Dwight · RFP</a><a href="#platform" style={{ color: "#3D3D39" }}>Jeff · Support</a></div>
      </div>
      <div>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>company</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#customers" style={{ color: "#3D3D39" }}>About</a><a href="#resources" style={{ color: "#3D3D39" }}>News</a><a href="#cta" style={{ color: "#3D3D39" }}>Careers</a><a href="#cta" style={{ color: "#3D3D39" }}>Pricing</a><a href="#cta" style={{ color: "#3D3D39" }}>Contact</a></div>
      </div>
    </div>
  </div>
  <div style={{ maxWidth: "1280px", margin: "clamp(36px,4vw,56px) auto 0", paddingTop: "22px", borderTop: "1px solid #EBEBE7", display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "space-between", fontSize: "13px", color: "#A8A8A2" }}>
    <span>© 2026 Lyzr AI. All rights reserved.</span>
    <span style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}><a href="#top" style={{ color: "#A8A8A2" }}>Privacy</a><a href="#top" style={{ color: "#A8A8A2" }}>Terms</a><a href="#top" style={{ color: "#A8A8A2" }}>Trust centre</a></span>
  </div>
</footer>

</div>

  );
}
