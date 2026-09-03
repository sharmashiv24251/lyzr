"use client";

import React, { useState, useEffect } from "react";
import ImageSlot from "@/components/ImageSlot";

const LAYERS = [
  { i: '01', t: 'Connect agents from anywhere', l: 'Every platform, every cloud. Register what already runs — no migration, no rewrite.', k: ['Frameworks', 'Also', 'Migration'], v: ['bedrock · azure · vertex', 'langchain · agentforce', 'none required'] },
  { i: '02', t: 'Run on any model', l: 'Swap providers without touching the agent. Pin versions so a deprecation is never a fire drill.', k: ['Hosted', 'Private', 'Switching cost'], v: ['claude · gpt · gemini', 'llama · mistral · yours', 'one config line'] },
  { i: '03', t: 'Rehearse before you ship', l: 'Replay real traffic shapes and adversarial cases against a release candidate until it holds.', k: ['Per release', 'Coverage', 'Gate'], v: ['500 runs', 'edge + adversarial', 'blocks promotion'] },
  { i: '04', t: 'Full trace on every run', l: 'Every step, tool call, token and millisecond — attributable to an agent, a version and an owner.', k: ['Granularity', 'Retention', 'Export'], v: ['per step', 'you decide', 'otel · s3'] },
  { i: '05', t: 'Hallucination and PII guard', l: 'Grounding scored on the way out. Unsupported claims held, personal data redacted before it leaves.', k: ['Grounding', 'Redaction', 'On fail'], v: ['scored 0–1', 'named entities', 'hold + notify'] },
  { i: '06', t: 'Access and governance', l: 'Role-based access, spend budgets, data residency and retention — set once, enforced everywhere.', k: ['Identity', 'Budgets', 'Residency'], v: ['okta · entra · saml', 'per agent / team', 'per region'] },
  { i: '07', t: 'Audit and compliance', l: 'An immutable record of every decision an agent made, exportable the day the auditor asks.', k: ['Log', 'Frameworks', 'Export'], v: ['immutable', 'soc2 · iso · hipaa', 'csv · api'] }
];

export default function LandingPage() {
  const [mode, setMode] = useState<'business' | 'developer'>('business');
  const [activeLayer, setActiveLayer] = useState<number>(0);
  const [hoverLayer, setHoverLayer] = useState<number | null>(null);

  const currentLayer = LAYERS[hoverLayer !== null ? hoverLayer : activeLayer];

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

  return (
<div style={{ overflowX: "hidden" }}>

<header style={{ position: "sticky", top: "0", zIndex: "60", background: "#fff", borderBottom: "1px solid #EBEBE7" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "14px clamp(18px,4vw,48px)", display: "flex", alignItems: "center", gap: "clamp(16px,2.4vw,34px)", rowGap: "10px", flexWrap: "wrap" }}>
    <a href="#top" aria-label="Lyzr" style={{ display: "flex", alignItems: "center", flex: "none" }}><img src="/assets/lyzr-wordmark-light.png" alt="Lyzr" width="441" height="170" style={{ display: "block", height: "26px", width: "auto", filter: "invert(1)" }} /></a>
    <nav style={{ flex: "1 1 200px", display: "flex", gap: "clamp(13px,1.6vw,24px)", flexWrap: "wrap", rowGap: "6px", fontSize: "15px", color: "#5C5C58", letterSpacing: "-.01em" }}>
      <a href="#platform" style={{ color: "#5C5C58" }}>Platform</a>
      <a href="#build" style={{ color: "#5C5C58" }}>Build</a>
      <a href="#sovereign" style={{ color: "#5C5C58" }}>Security</a>
      <a href="#customers" style={{ color: "#5C5C58" }}>Customers</a>
      <a href="#resources" style={{ color: "#5C5C58" }}>Resources</a>
      <a href="#cta" style={{ color: "#5C5C58" }}>Pricing</a>
    </nav>
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <a href="#cta" style={{ fontSize: "15px", fontWeight: "500", padding: "10px 17px", borderRadius: "10px", border: "1px solid #DEDED9", color: "#0B0B0B" }}>Agent Studio</a>
      <a href="#cta" style={{ fontSize: "15px", fontWeight: "500", padding: "10px 18px", borderRadius: "10px", background: "var(--lz-accent,#C1502E)", color: "#fff" }}>Talk to us</a>
    </div>
  </div>
</header>

<section id="top" style={{ padding: "clamp(44px,5.4vw,80px) clamp(18px,4vw,48px) clamp(28px,3vw,44px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(30px,4vw,64px)", alignItems: "center" }}>

    <div style={{ flex: "1 1 420px", minWidth: "0" }}>
      <div data-reveal="1" style={{ display: "inline-flex", padding: "3px", borderRadius: "999px", background: "#F3F3F0", border: "1px solid #E7E7E2", marginBottom: "clamp(22px,2.4vw,30px)" }}>
        <button
          type="button"
          data-mode="business"
          onClick={() => setMode('business')}
          style={{
            fontFamily: "'Silkscreen', monospace",
            fontSize: "9.5px",
            letterSpacing: ".09em",
            textTransform: "uppercase",
            padding: "9px 15px",
            borderRadius: "999px",
            background: mode === 'business' ? "#fff" : "transparent",
            color: mode === 'business' ? "#0B0B0B" : "#9C9C97",
            boxShadow: mode === 'business' ? "0 1px 2px rgba(0,0,0,.06)" : "none",
          }}
        >
          For business
        </button>
        <button
          type="button"
          data-mode="developer"
          onClick={() => setMode('developer')}
          style={{
            fontFamily: "'Silkscreen', monospace",
            fontSize: "9.5px",
            letterSpacing: ".09em",
            textTransform: "uppercase",
            padding: "9px 15px",
            borderRadius: "999px",
            background: mode === 'developer' ? "#fff" : "transparent",
            color: mode === 'developer' ? "#0B0B0B" : "#9C9C97",
            boxShadow: mode === 'developer' ? "0 1px 2px rgba(0,0,0,.06)" : "none",
          }}
        >
          For developers
        </button>
      </div>
      <h1 data-reveal="1" style={{ margin: "0", fontSize: "clamp(42px,5.6vw,86px)", fontWeight: "500", letterSpacing: "-.045em", lineHeight: ".97" }}>Demos are easy.<br /><span style={{ color: "#A2A29C" }}>Production is the job.</span></h1>
      <p
        data-reveal="1"
        data-slot="hero-sub"
        style={{
          margin: "clamp(20px,2.2vw,28px) 0 0",
          maxWidth: "31em",
          fontSize: "clamp(17px,1.3vw,20px)",
          color: "#5C5C58",
          letterSpacing: "-.012em",
        }}
      >
        {mode === 'business'
          ? 'Lyzr is the layer between a working agent and a governed one — registry, policy, simulation, observability and guardrails, running inside your own cloud.'
          : 'Register agents from any framework, apply a policy pack, simulate a release and deploy to your own VPC — from an SDK, the CLI, or an MCP server your agents can call.'}
      </p>
      <div data-reveal="1" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "clamp(24px,2.6vw,34px)" }}>
        <a href="#cta" style={{ fontSize: "16px", fontWeight: "500", padding: "14px 24px", borderRadius: "11px", background: "var(--lz-accent,#C1502E)", color: "#fff" }}>Talk to us</a>
        <a href="#platform" style={{ fontSize: "16px", fontWeight: "500", padding: "14px 24px", borderRadius: "11px", border: "1px solid #DEDED9", color: "#0B0B0B" }}>See the control plane</a>
      </div>
    </div>

    <div data-reveal="1" style={{ flex: "1.08 1 460px", minWidth: "0" }}>

      <div data-artifact="business" style={{ display: mode === "business" ? "block" : "none", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "22px", padding: "clamp(14px,1.4vw,20px)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>

          <div style={{ flex: "1 1 208px", minWidth: "0", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "13px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,.03),0 18px 36px -28px rgba(0,0,0,.2)" }}>
            <div style={{ padding: "11px 13px", borderBottom: "1px solid #EFEFEB", fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#A8A8A2", display: "flex", alignItems: "center", gap: "7px" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-accent,#C1502E)", animation: "lzPulse 2.4s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}></span>the stack</div>
            <div data-layers="1">
              {[
                { i: "01", lbl: "Connect" },
                { i: "02", lbl: "Any model" },
                { i: "03", lbl: "Simulation" },
                { i: "04", lbl: "Observability" },
                { i: "05", lbl: "Guardrails" },
                { i: "06", lbl: "Governance" },
                { i: "07", lbl: "Audit" },
              ].map((item, idx) => {
                const isSelected = (hoverLayer !== null ? hoverLayer : activeLayer) === idx;
                return (
                  <button
                    key={item.i}
                    type="button"
                    data-layer={idx}
                    onClick={() => setActiveLayer(idx)}
                    onMouseEnter={() => setHoverLayer(idx)}
                    onMouseLeave={() => setHoverLayer(null)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "10px 13px",
                      textAlign: "left",
                      borderBottom: idx < 6 ? "1px solid #F5F5F1" : "none",
                      background: isSelected ? "var(--lz-tint, #FBF3EF)" : "transparent",
                    }}
                  >
                    <span
                      data-dot="1"
                      style={{
                        flex: "none",
                        width: "14px",
                        fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                        fontSize: "9.5px",
                        color: isSelected ? "var(--lz-accent, #C1502E)" : "#C1CDC5",
                      }}
                    >
                      {item.i}
                    </span>
                    <span
                      data-lbl="1"
                      style={{
                        fontSize: "13px",
                        fontWeight: "500",
                        letterSpacing: "-.012em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        color: isSelected ? "var(--lz-accent, #C1502E)" : "#0B0B0B",
                      }}
                    >
                      {item.lbl}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ flex: "1.25 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "13px", padding: "17px 17px 15px", boxShadow: "0 1px 2px rgba(0,0,0,.03),0 18px 36px -28px rgba(0,0,0,.2)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)" }}><span data-slot="idx">layer {currentLayer.i}</span><span style={{ flex: "1", height: "1px", background: "var(--lz-hair,#EFE1DB)" }}></span></div>
              <div data-slot="title" style={{ fontSize: "clamp(17px,1.4vw,21px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2", marginTop: "11px" }}>{currentLayer.t}</div>
              <p data-slot="line" style={{ margin: "8px 0 0", fontSize: "14px", color: "#6E6E68", letterSpacing: "-.008em" }}>{currentLayer.l}</p>
              <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #F1F1ED", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}><span style={{ color: "#9C9C97" }} data-slot="k1">{currentLayer.k[0]}</span><span data-slot="v1" style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", textAlign: "right" }}>{currentLayer.v[0]}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}><span style={{ color: "#9C9C97" }} data-slot="k2">{currentLayer.k[1]}</span><span data-slot="v2" style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", textAlign: "right" }}>{currentLayer.v[1]}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}><span style={{ color: "#9C9C97" }} data-slot="k3">{currentLayer.k[2]}</span><span data-slot="v3" style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", textAlign: "right" }}>{currentLayer.v[2]}</span></div>
              </div>
            </div>
            <div style={{ background: "#0B0B0B", borderRadius: "13px", padding: "15px 17px", color: "#fff", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--lz-accent,#C1502E)", animation: "lzPulse 2.2s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}></span>
              <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "rgba(255,255,255,.55)" }}>deployed in</span>
              <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11.5px" }}>your vpc · us-east-1</span>
            </div>
          </div>

        </div>
      </div>

      <div data-artifact="developer" style={{ display: mode === "developer" ? "block" : "none", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "22px", padding: "clamp(14px,1.4vw,20px)" }}>
        <div style={{ background: "#0B0B0B", borderRadius: "13px", overflow: "hidden", boxShadow: "0 20px 44px -30px rgba(0,0,0,.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "11px 15px", borderBottom: "1px solid rgba(255,255,255,.08)" }}>
            <div style={{ display: "flex", gap: "5px" }}><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,.16)" }}></span><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,.16)" }}></span><span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "rgba(255,255,255,.16)" }}></span></div>
            <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".11em", textTransform: "uppercase", color: "rgba(255,255,255,.42)" }}>lyzr cli</span>
            <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "rgba(255,255,255,.35)" }}>v2.4.1</span>
          </div>
          <div style={{ padding: "18px 17px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "12.5px", lineHeight: "1.85", color: "rgba(255,255,255,.82)" }}>
            <div style={{ animation: "lzTerm 11s ease-out infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ color: "var(--lz-accent,#C1502E)" }}>$</span> pip install lyzr</div>
            <div style={{ animation: "lzTerm 11s ease-out .5s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ color: "var(--lz-accent,#C1502E)" }}>$</span> lyzr registry sync --from bedrock,azure</div>
            <div style={{ color: "rgba(255,255,255,.46)", animation: "lzTerm 11s ease-out 1s infinite", animationPlayState: "var(--lz-play,running)" }}>  ✓ 4 agents discovered · lineage captured</div>
            <div style={{ color: "rgba(255,255,255,.46)", animation: "lzTerm 11s ease-out 1.4s infinite", animationPlayState: "var(--lz-play,running)" }}>  ✓ policy pack applied · 24 rules</div>
            <div style={{ animation: "lzTerm 11s ease-out 2s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ color: "var(--lz-accent,#C1502E)" }}>$</span> lyzr deploy claims-triage --target vpc</div>
            <div style={{ color: "rgba(255,255,255,.46)", animation: "lzTerm 11s ease-out 2.5s infinite", animationPlayState: "var(--lz-play,running)" }}>  → simulation 500/500 passed</div>
            <div style={{ animation: "lzTerm 11s ease-out 3s infinite", animationPlayState: "var(--lz-play,running)" }}>  → <span style={{ color: "#8FBF9F" }}>live</span> us-east-1 · p95 240ms<span style={{ display: "inline-block", width: "7px", height: "14px", background: "var(--lz-accent,#C1502E)", verticalAlign: "-2px", marginLeft: "6px", animation: "lzCaret 1s step-end infinite", animationPlayState: "var(--lz-play,running)" }}></span></div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", padding: "12px 17px", borderTop: "1px solid rgba(255,255,255,.08)", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "rgba(255,255,255,.38)" }}>
            <span>python sdk</span><span>typescript sdk</span><span>rest</span><span>mcp server</span><span>helm chart</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(66px,8vw,116px)" }}>
  
    <div data-reveal="1" style={{ maxWidth: "1280px", margin: "0 auto", background: "var(--lz-tint,#FBF3EF)", border: "1px solid #F0E1D9", borderRadius: "16px", padding: "clamp(20px,2.2vw,30px) clamp(20px,2.4vw,34px)", display: "flex", flexWrap: "wrap", gap: "clamp(18px,3vw,44px)" }}>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".11em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>agents in production</div>
        <div data-count="1047" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>1,047</div>
      </div>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".11em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>policy checks today</div>
        <div data-count="482193" data-live="1" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>482,193</div>
      </div>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".11em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>unsafe outputs held</div>
        <div data-count="3204" data-live="1" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px", color: "var(--lz-accent,#C1502E)" }}>3,204</div>
      </div>
      <div style={{ flex: "1 1 152px" }}>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".11em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>uptime, all deployments</div>
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

      <div data-reveal="1" style={{ flex: "2.35 1 520px", minWidth: "0", display: "flex", flexWrap: "wrap", gap: "clamp(8px,.9vw,11px)", alignContent: "flex-start" }}>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          <span style={{ position: "absolute", top: "10px", right: "10px", width: "21px", height: "21px", borderRadius: "50%", background: "#F5F5F2", display: "grid", placeItems: "center", fontSize: "10.5px", color: "#B4B4AE" }}>↗</span>
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "20px", fontWeight: "700", letterSpacing: ".02em" }}>WTW</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>retirement advisory</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          <span style={{ position: "absolute", top: "10px", right: "10px", width: "21px", height: "21px", borderRadius: "50%", background: "#F5F5F2", display: "grid", placeItems: "center", fontSize: "10.5px", color: "#B4B4AE" }}>↗</span>
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "18px", fontWeight: "400", letterSpacing: "-.03em" }}>accenture</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>corporate VC</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          <span style={{ position: "absolute", top: "10px", right: "10px", width: "21px", height: "21px", borderRadius: "50%", background: "#F5F5F2", display: "grid", placeItems: "center", fontSize: "10.5px", color: "#B4B4AE" }}>↗</span>
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "16px", fontWeight: "600", letterSpacing: ".06em" }}>HITACHI</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>marketing at scale</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "15px", fontWeight: "600", letterSpacing: ".04em" }}>VERIFONE</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>payments ops</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          <span style={{ position: "absolute", top: "10px", right: "10px", width: "21px", height: "21px", borderRadius: "50%", background: "#F5F5F2", display: "grid", placeItems: "center", fontSize: "10.5px", color: "#B4B4AE" }}>↗</span>
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "17px", fontWeight: "600", letterSpacing: "-.025em" }}>Firstsource</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>BPO orchestration</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "15.5px", fontWeight: "600", letterSpacing: "-.02em" }}>AirAsia MOVE</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>customer service</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "21px", fontWeight: "700", letterSpacing: ".01em" }}>IBM</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>watsonx catalogue</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "21px", fontWeight: "700", letterSpacing: "-.04em" }}>aws</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>bedrock-native</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "15px", fontWeight: "600", letterSpacing: ".05em" }}>NVIDIA</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>inference partner</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "17px", fontWeight: "500", letterSpacing: "-.02em" }}>Microsoft</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>azure ai foundry</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "17px", fontWeight: "600", letterSpacing: "-.03em" }}>salesforce</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>agentforce</span>
        </div>
        <div style={{ position: "relative", flex: "1 1 154px", minWidth: "0", background: "#fff", border: "1px solid #EAEAE5", borderRadius: "11px", padding: "22px 14px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px", minHeight: "126px" }}>
          
          <span style={{ display: "block", textAlign: "center" }}><span style={{ display: "block", color: "#9C9C97", whiteSpace: "nowrap", fontSize: "15.5px", fontWeight: "500", letterSpacing: "-.02em" }}>Google Cloud</span></span>
          <span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#BDBDB7", textAlign: "center", letterSpacing: ".02em" }}>vertex ai</span>
        </div>
      </div>

      <div data-reveal="1" style={{ flex: "1 1 262px", minWidth: "0", background: "#0B0B0B", borderRadius: "16px", padding: "22px 22px 20px", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>
        <span style={{ position: "absolute", left: "0", top: "0", right: "0", height: "150px", background: "radial-gradient(70% 100% at 30% 0%,var(--lz-glow,rgba(193,80,46,.4)),transparent 72%)", pointerEvents: "none" }}></span>
        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "9px" }}>
          <span style={{ padding: "5px 8px", borderRadius: "6px", background: "#fff", fontSize: "11.5px", fontWeight: "700", letterSpacing: ".02em", color: "#0B0B0B" }}>WTW</span>
          <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".13em", textTransform: "uppercase", color: "rgba(255,255,255,.5)" }}>wtw · in production</span>
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
      <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".13em", textTransform: "uppercase", color: "#B4B4AE", flex: "none" }}>recognised by</span>
      <span style={{ flex: "1 1 auto", display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.2vw,32px)", fontSize: "14px", color: "#8E8E88", letterSpacing: "-.01em" }}>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>Gartner</span> · Tech Innovator in Agentic AI</span>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>IDC</span> · Top orchestration platform</span>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>Everest</span> · HR &amp; BFSI</span>
        <span><span style={{ color: "#3D3D39", fontWeight: "500" }}>CB Insights</span> · Top 100 AI</span>
      </span>
    </div>

  </div>
</section>

<section id="platform" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(30px,3.4vw,50px)", maxWidth: "24em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>One control plane for every agent.<br /><span style={{ color: "#A2A29C" }}>Wherever it was built. Whoever built it.</span></h2>

    <div data-reveal="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "clamp(18px,2vw,24px)", padding: "clamp(14px,1.6vw,22px)", marginBottom: "clamp(14px,1.6vw,22px)" }}>
      <div style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "14px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,.03),0 30px 56px -36px rgba(0,0,0,.26)" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderBottom: "1px solid #EFEFEB", background: "#FAFAF8" }}>
          <div style={{ display: "flex", gap: "6px" }}><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E0E0DA" }}></span><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E0E0DA" }}></span><span style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#E0E0DA" }}></span></div>
          <span style={{ margin: "0 auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#9C9C97" }}>app.lyzr.ai / registry</span>
          <div style={{ display: "flex", alignItems: "center", gap: "-6px" }}>
            <span style={{ width: "21px", height: "21px", borderRadius: "50%", background: "#DFE4E8", border: "1.5px solid #fff", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "8.5px", color: "#5C6B75" }}>PR</span>
            <span style={{ width: "21px", height: "21px", borderRadius: "50%", background: "#E8DFD9", border: "1.5px solid #fff", marginLeft: "-7px", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "8.5px", color: "#7A6357" }}>AK</span>
            <span style={{ width: "21px", height: "21px", borderRadius: "50%", background: "#E3E3DC", border: "1.5px solid #fff", marginLeft: "-7px", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "8.5px", color: "#75756D" }}>+9</span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "stretch" }}>

          <div style={{ flex: "none", width: "50px", borderRight: "1px solid #EFEFEB", background: "#FCFCFB", padding: "12px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center" }}><span style={{ width: "14px", height: "14px", border: "1.5px solid #C6C6C0", borderRadius: "3px" }}></span></div>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center" }}><span style={{ width: "14px", height: "14px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}><span style={{ height: "1.5px", background: "#C6C6C0" }}></span><span style={{ height: "1.5px", background: "#C6C6C0" }}></span><span style={{ height: "1.5px", background: "#C6C6C0" }}></span></span></div>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center", background: "var(--lz-tint,#FBF3EF)" }}><span style={{ width: "13px", height: "13px", border: "1.5px solid var(--lz-accent,#C1502E)", borderRadius: "3px", position: "relative" }}><span style={{ position: "absolute", inset: "2.5px", background: "var(--lz-accent,#C1502E)", borderRadius: "1px" }}></span></span></div>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center" }}><span style={{ width: "14px", height: "14px", border: "1.5px solid #C6C6C0", borderRadius: "50%" }}></span></div>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center" }}><span style={{ width: "14px", height: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5px" }}><span style={{ background: "#C6C6C0", borderRadius: "1px" }}></span><span style={{ background: "#C6C6C0", borderRadius: "1px" }}></span><span style={{ background: "#C6C6C0", borderRadius: "1px" }}></span><span style={{ background: "#C6C6C0", borderRadius: "1px" }}></span></span></div>
            <span style={{ width: "16px", height: "1px", background: "#EAEAE5", margin: "6px 0" }}></span>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center" }}><span style={{ width: "13px", height: "14px", border: "1.5px solid #C6C6C0", borderRadius: "2px 2px 6px 2px" }}></span></div>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", display: "grid", placeItems: "center" }}><span style={{ width: "14px", height: "14px", border: "1.5px solid #C6C6C0", borderRadius: "50% 50% 4px 4px" }}></span></div>
          </div>

          <div style={{ flex: "1 1 auto", minWidth: "0" }}>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "13px 16px 11px", flexWrap: "wrap", rowGap: "8px" }}>
              <span style={{ fontSize: "12.5px", color: "#A8A8A2", letterSpacing: "-.008em" }}>Registry</span>
              <span style={{ color: "#D6D6D0", fontSize: "12px" }}>/</span>
              <span style={{ fontSize: "15.5px", fontWeight: "500", letterSpacing: "-.018em" }}>Claims Triage</span>
              <span style={{ padding: "2.5px 7px", borderRadius: "5px", border: "1px solid #E7E7E2", background: "#FBFBFA", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#8E8E88" }}>v14</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 8px", borderRadius: "5px", background: "#EDF3EE", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#4E7360" }}><span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#5C8A70", animation: "lzPulse 2.4s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}></span>LIVE</span>
              <span style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                <span style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid #E4E4DF", background: "#fff", fontSize: "12.5px", fontWeight: "500", color: "#3D3D39", whiteSpace: "nowrap" }}>Compare</span>
                <span style={{ padding: "7px 13px", borderRadius: "8px", background: "var(--lz-accent,#C1502E)", color: "#fff", fontSize: "12.5px", fontWeight: "500", whiteSpace: "nowrap" }}>Promote v15</span>
              </span>
            </div>

            <div style={{ display: "flex", gap: "18px", padding: "0 16px", borderBottom: "1px solid #EFEFEB", fontSize: "12.5px", overflow: "hidden" }}>
              <span style={{ padding: "0 0 9px", borderBottom: "2px solid #0B0B0B", fontWeight: "500", whiteSpace: "nowrap" }}>Runs</span>
              <span style={{ padding: "0 0 9px", color: "#9C9C97", whiteSpace: "nowrap" }}>Traces</span>
              <span style={{ padding: "0 0 9px", color: "#9C9C97", whiteSpace: "nowrap" }}>Policy <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#C6C6C0" }}>24</span></span>
              <span style={{ padding: "0 0 9px", color: "#9C9C97", whiteSpace: "nowrap" }}>Simulations</span>
              <span style={{ padding: "0 0 9px", color: "#9C9C97", whiteSpace: "nowrap" }}>Cost</span>
              <span style={{ padding: "0 0 9px", color: "#9C9C97", whiteSpace: "nowrap" }}>Audit log</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", borderBottom: "1px solid #F4F4F0", flexWrap: "wrap", rowGap: "8px" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", padding: "6px 10px", borderRadius: "7px", border: "1px solid #EAEAE5", background: "#FCFCFB", fontSize: "11.5px", color: "#B4B4AE", minWidth: "132px" }}><span style={{ width: "9px", height: "9px", border: "1.4px solid #C6C6C0", borderRadius: "50%" }}></span>Filter runs</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 9px", borderRadius: "6px", border: "1px solid #E7E7E2", background: "#fff", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C5C58" }}>verdict: all</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 9px", borderRadius: "6px", border: "1px solid #E7E7E2", background: "#fff", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C5C58" }}>window: 1h</span>
              <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px", color: "#A8A8A2", whiteSpace: "nowrap" }}>6,204 runs · 1 held</span>
            </div>

            <div style={{ width: "calc(100% + 96px)" }}>
              <div style={{ display: "flex", alignItems: "center", padding: "0", borderBottom: "1px solid #EFEFEB", background: "#FCFCFB", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2" }}>
                <span style={{ flex: "0 0 108px", padding: "8px 12px" }}>run</span>
                <span style={{ flex: "0 0 96px", padding: "8px 8px" }}>started</span>
                <span style={{ flex: "0 0 62px", padding: "8px 8px", textAlign: "right" }}>steps</span>
                <span style={{ flex: "0 0 74px", padding: "8px 8px", textAlign: "right" }}>cost</span>
                <span style={{ flex: "0 0 128px", padding: "8px 12px" }}>verdict</span>
                <span style={{ flex: "0 0 150px", padding: "8px 12px" }}>note</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0", padding: "0", borderBottom: "1px solid #F4F4F0", background: "transparent" }}>
              <span style={{ flex: "0 0 108px", padding: "9px 12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#0B0B0B", whiteSpace: "nowrap" }}>run_8f2c91</span>
              <span style={{ flex: "0 0 96px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", whiteSpace: "nowrap" }}>09:42:18</span>
              <span style={{ flex: "0 0 62px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>7</span>
              <span style={{ flex: "0 0 74px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>$0.031</span>
              <span style={{ flex: "0 0 128px", padding: "9px 12px", fontSize: "11px", whiteSpace: "nowrap" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 8px", borderRadius: "5px", background: "#EDF3EE", color: "#4E7360", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px" }}>ALLOWED</span></span>
              <span style={{ flex: "0 0 150px", padding: "9px 12px", fontSize: "11.5px", color: "#8E8E88", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>tier-2 cover approved</span>
            </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0", padding: "0", borderBottom: "1px solid #F4F4F0", background: "transparent" }}>
              <span style={{ flex: "0 0 108px", padding: "9px 12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#0B0B0B", whiteSpace: "nowrap" }}>run_8f2c8e</span>
              <span style={{ flex: "0 0 96px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", whiteSpace: "nowrap" }}>09:42:04</span>
              <span style={{ flex: "0 0 62px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>7</span>
              <span style={{ flex: "0 0 74px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>$0.029</span>
              <span style={{ flex: "0 0 128px", padding: "9px 12px", fontSize: "11px", whiteSpace: "nowrap" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 8px", borderRadius: "5px", background: "#EDF3EE", color: "#4E7360", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px" }}>ALLOWED</span></span>
              <span style={{ flex: "0 0 150px", padding: "9px 12px", fontSize: "11.5px", color: "#8E8E88", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>routed to payments</span>
            </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0", padding: "0", borderBottom: "1px solid #F4F4F0", background: "var(--lz-tint,#FBF3EF)" }}>
              <span style={{ flex: "0 0 108px", padding: "9px 12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#0B0B0B", whiteSpace: "nowrap" }}>run_8f2c7a</span>
              <span style={{ flex: "0 0 96px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", whiteSpace: "nowrap" }}>09:41:51</span>
              <span style={{ flex: "0 0 62px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>5</span>
              <span style={{ flex: "0 0 74px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>$0.018</span>
              <span style={{ flex: "0 0 128px", padding: "9px 12px", fontSize: "11px", whiteSpace: "nowrap" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 8px", borderRadius: "5px", background: "var(--lz-tint,#FBF3EF)", color: "var(--lz-accent,#C1502E)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px" }}>HELD</span></span>
              <span style={{ flex: "0 0 150px", padding: "9px 12px", fontSize: "11.5px", color: "#8E8E88", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>SSN in outbound draft</span>
            </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0", padding: "0", borderBottom: "1px solid #F4F4F0", background: "transparent" }}>
              <span style={{ flex: "0 0 108px", padding: "9px 12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#0B0B0B", whiteSpace: "nowrap" }}>run_8f2c62</span>
              <span style={{ flex: "0 0 96px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", whiteSpace: "nowrap" }}>09:41:33</span>
              <span style={{ flex: "0 0 62px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>9</span>
              <span style={{ flex: "0 0 74px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>$0.044</span>
              <span style={{ flex: "0 0 128px", padding: "9px 12px", fontSize: "11px", whiteSpace: "nowrap" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 8px", borderRadius: "5px", background: "#EDF3EE", color: "#4E7360", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px" }}>ALLOWED</span></span>
              <span style={{ flex: "0 0 150px", padding: "9px 12px", fontSize: "11.5px", color: "#8E8E88", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>escalated to adjuster</span>
            </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0", padding: "0", borderBottom: "1px solid #F4F4F0", background: "transparent" }}>
              <span style={{ flex: "0 0 108px", padding: "9px 12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#0B0B0B", whiteSpace: "nowrap" }}>run_8f2c4d</span>
              <span style={{ flex: "0 0 96px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", whiteSpace: "nowrap" }}>09:41:12</span>
              <span style={{ flex: "0 0 62px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>6</span>
              <span style={{ flex: "0 0 74px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>$0.026</span>
              <span style={{ flex: "0 0 128px", padding: "9px 12px", fontSize: "11px", whiteSpace: "nowrap" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 8px", borderRadius: "5px", background: "#EDF3EE", color: "#4E7360", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px" }}>ALLOWED</span></span>
              <span style={{ flex: "0 0 150px", padding: "9px 12px", fontSize: "11.5px", color: "#8E8E88", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>duplicate claim closed</span>
            </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0", padding: "0", borderBottom: "1px solid #F4F4F0", background: "transparent" }}>
              <span style={{ flex: "0 0 108px", padding: "9px 12px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#0B0B0B", whiteSpace: "nowrap" }}>run_8f2c39</span>
              <span style={{ flex: "0 0 96px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", whiteSpace: "nowrap" }}>09:40:58</span>
              <span style={{ flex: "0 0 62px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>7</span>
              <span style={{ flex: "0 0 74px", padding: "9px 8px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#8E8E88", textAlign: "right" }}>$0.030</span>
              <span style={{ flex: "0 0 128px", padding: "9px 12px", fontSize: "11px", whiteSpace: "nowrap" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "3px 8px", borderRadius: "5px", background: "#EDF3EE", color: "#4E7360", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px" }}>ALLOWED</span></span>
              <span style={{ flex: "0 0 150px", padding: "9px 12px", fontSize: "11.5px", color: "#8E8E88", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>tier-1 cover approved</span>
            </div>
            </div>

          </div>

          <div style={{ flex: "none", width: "244px", borderLeft: "1px solid #EFEFEB", background: "#FCFCFB", padding: "14px 15px", display: "none" }}>
            <span></span>
          </div>

        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "9px 16px", borderTop: "1px solid #EFEFEB", background: "#FAFAF8", flexWrap: "wrap", rowGap: "6px" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#8E8E88" }}><span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-accent,#C1502E)", animation: "lzPulse 2.2s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}></span>bedrock:claude-sonnet-4</span>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#C6C6C0" }}>|</span>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#8E8E88" }}>vpc-0a91f · us-east-1</span>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#C6C6C0" }}>|</span>
          <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#8E8E88" }}>owner priya.raman@northbridge.com</span>
          <span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#8E8E88", whiteSpace: "nowrap" }}>p95 240ms</span>
        </div>

      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,360px),1fr))", gap: "clamp(14px,1.6vw,22px)" }}>

      <div data-reveal="1" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "20px", padding: "clamp(22px,2.2vw,32px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(21px,1.8vw,29px)", fontWeight: "500", letterSpacing: "-.026em", lineHeight: "1.16" }}>Register the agents you didn't build. <span style={{ color: "#A2A29C" }}>Nothing gets rewritten.</span></h3>
          <a href="#cta" aria-label="Explore the registry" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "50%", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div style={{ marginTop: "clamp(22px,2.4vw,34px)", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "12px", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "8px", padding: "9px 14px", borderBottom: "1px solid #EFEFEB", background: "#FCFCFB", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2" }}>
            <span style={{ flex: "1.5" }}>agent</span><span style={{ flex: "1" }}>built on</span><span style={{ flex: ".85" }}>runs / day</span><span style={{ flex: ".6", textAlign: "right" }}>state</span>
          </div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Claims Triage</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>bedrock</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>18,402</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>KYC Reviewer</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>azure ai</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>6,110</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Collections Desk</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>langchain</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>2,988</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Renewals Analyst</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>vertex</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "#5C5C58" }}>941</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#A8A8A2" }}>STAGED</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", fontSize: "13px", alignItems: "center", background: "var(--lz-tint,#FBF3EF)", animation: "lzRowIn 8s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Vendor Diligence</span><span style={{ flex: "1", color: "#8E8E88", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>agentforce</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-ink2,#B08574)" }}>—</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "var(--lz-accent,#C1502E)" }}>SYNCED</span></div>
        </div>
      </div>

      <div data-reveal="1" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "20px", padding: "clamp(22px,2.2vw,32px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(21px,1.8vw,29px)", fontWeight: "500", letterSpacing: "-.026em", lineHeight: "1.16" }}>Policy runs before the model does. <span style={{ color: "#A2A29C" }}>Every call, every time.</span></h3>
          <a href="#cta" aria-label="Explore policy" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "50%", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "#5C5C58" }}>↗</a>
        </div>
        <div style={{ marginTop: "clamp(22px,2.4vw,34px)", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "12px", padding: "16px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "11px" }}>
            <span>request</span><span>outcome</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 17px 1fr", rowGap: "9px", alignItems: "center" }}>
            <div style={{ gridColumn: "2", gridRow: "1 / span 4", justifySelf: "center", width: "1px", height: "100%", background: "repeating-linear-gradient(180deg,#DEDED9 0 4px,transparent 4px 9px)" }}></div>

            <div style={{ gridColumn: "1", gridRow: "1", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "#8E8E88" }}></span>summarise policy</span></div>
            <div style={{ gridColumn: "3", gridRow: "1", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C7A66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out .35s infinite", animationPlayState: "var(--lz-play,running)" }}>ALLOWED</div>

            <div style={{ gridColumn: "1", gridRow: "2", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) .55s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "#8E8E88" }}></span>issue refund $4,200</span></div>
            <div style={{ gridColumn: "3", gridRow: "2", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C7A66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out .9s infinite", animationPlayState: "var(--lz-play,running)" }}>ALLOWED · LOGGED</div>

            <div style={{ gridColumn: "1", gridRow: "3", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--lz-tint2,#E4CFC6)", background: "var(--lz-tint,#FBF3EF)", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) 1.1s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-accent,#C1502E)" }}></span>lookup SSN ···9930</span></div>
            <div style={{ gridColumn: "3", gridRow: "3", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "var(--lz-accent,#C1502E)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out 1.45s infinite", animationPlayState: "var(--lz-play,running)" }}>HELD AT GATE</div>

            <div style={{ gridColumn: "1", gridRow: "4", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "8px", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) 1.65s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "#8E8E88" }}></span>escalate to human</span></div>
            <div style={{ gridColumn: "3", gridRow: "4", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C5C58", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out 2s infinite", animationPlayState: "var(--lz-play,running)" }}>ROUTED · RISK</div>
          </div>
          <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px solid #F1F1ED", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px", color: "#A8A8A2" }}><span>role · budget · residency · retention</span><span style={{ color: "#5C5C58" }}>24 rules</span></div>
        </div>
      </div>

    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,1.6vw,22px)", marginTop: "clamp(14px,1.6vw,22px)" }}>

      <div data-reveal="1" data-card="1" style={{ flex: "1 1 calc(50% - 11px)", minWidth: "min(100%,258px)", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "20px", padding: "clamp(20px,2vw,28px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <h3 style={{ margin: "0", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>See every step an agent took. <span style={{ color: "#A2A29C" }}>Down to the token.</span></h3>
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "11px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "4px" }}><span>claims triage</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>run_8f2c91</span></div>
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

      <div data-reveal="1" data-card="1" style={{ flex: "1 1 calc(50% - 11px)", minWidth: "min(100%,258px)", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "20px", padding: "clamp(20px,2vw,28px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <h3 style={{ margin: "0", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Catch what shouldn't leave. <span style={{ color: "#A2A29C" }}>Before it does.</span></h3>
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "11px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "11px" }}><span>outbound</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>claims-triage · run 4c11</span></div>
          <div style={{ border: "1px solid #EFEFEB", borderRadius: "7px", background: "#fff", padding: "14px 15px 13px", boxShadow: "0 1px 0 #F4F4F0,0 6px 14px -10px rgba(0,0,0,.14)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "9px", borderBottom: "1px solid #F1F1ED" }}>
              <span style={{ width: "14px", height: "14px", borderRadius: "3px", background: "#0B0B0B" }}></span>
              <span style={{ fontSize: "10.5px", fontWeight: "600", letterSpacing: ".07em", textTransform: "uppercase" }}>Northbridge Mutual</span>
              <span style={{ marginLeft: "auto", fontFamily: "'Silkscreen',monospace", fontSize: "7.5px", letterSpacing: ".13em", textTransform: "uppercase", color: "#A8A8A2" }}>claim decision</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "#A8A8A2", padding: "9px 0 8px" }}>Ref CLM-2291-04 · 14 March 2026</div>
            <p style={{ margin: "0 0 7px", fontSize: "10.5px", lineHeight: "1.72", color: "#44443F" }}>Dear <span style={{ position: "relative", display: "inline-block" }}>Ms A. Nkemdi<span style={{ position: "absolute", left: "-2px", right: "-2px", top: "0", bottom: "1px", background: "#0B0B0B", borderRadius: "2px", animation: "lzWipe 7s cubic-bezier(.4,0,.2,1) 0s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span>,</p>
            <p style={{ margin: "0 0 7px", fontSize: "10.5px", lineHeight: "1.72", color: "#44443F" }}>We have completed our review of the claim submitted against policy <span style={{ position: "relative", display: "inline-block" }}>NM-412-88-9930<span style={{ position: "absolute", left: "-2px", right: "-2px", top: "0", bottom: "1px", background: "#0B0B0B", borderRadius: "2px", animation: "lzWipe 7s cubic-bezier(.4,0,.2,1) .4s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span>. Based on the treatment dates and the schedule of benefits in force on the date of loss, the claim qualifies for tier-2 cover with effect from 1 March 2026.</p>
            <p style={{ margin: "0", fontSize: "10.5px", lineHeight: "1.72", color: "#8E8E88" }}>Yours sincerely,<br />Claims Triage · Northbridge Mutual</p>
          </div>
          <div style={{ marginTop: "13px", paddingTop: "11px", borderTop: "1px solid #F1F1ED", display: "flex", flexDirection: "column", gap: "7px", fontSize: "11.5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#8E8E88" }}>PII redacted</span><span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace" }}>2 spans</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#8E8E88" }}>Grounding score</span><span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace" }}>0.96</span></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "#8E8E88" }}>Unsupported claims</span><span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", color: "var(--lz-accent,#C1502E)" }}>1 held</span></div>
          </div>
        </div>
      </div>

      <div data-reveal="1" data-card="1" style={{ flex: "1 1 calc(50% - 11px)", minWidth: "min(100%,258px)", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "20px", padding: "clamp(20px,2vw,28px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <h3 style={{ margin: "0", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Know what each agent costs. <span style={{ color: "#A2A29C" }}>And what it sent back.</span></h3>
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "11px", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "12px" }}><span>cost / week</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>last 7</span></div>
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

      <div data-reveal="1" data-card="1" style={{ flex: "1 1 calc(50% - 11px)", minWidth: "min(100%,258px)", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "20px", padding: "clamp(20px,2vw,28px)", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <h3 style={{ margin: "0", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Or start from one already running. <span style={{ color: "#A2A29C" }}>A hundred of them.</span></h3>
        <div style={{ marginTop: "20px", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "11px", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 13px", borderBottom: "1px solid #EFEFEB", background: "#FCFCFB", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2" }}><span>blueprints</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>bfsi · hr · support</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>JZ</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Jazon</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI SDR</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>312 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>DI</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Diane</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI HR partner</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>188 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#8E8E88" }}>DW</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Dwight</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI RFP scout</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>96 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", background: "var(--lz-tint,#FBF3EF)", animation: "lzRowIn 8.5s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ width: "22px", height: "22px", borderRadius: "6px", background: "var(--lz-hair,#F1DED6)", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-ink2,#B08574)" }}>SK</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Skott</span><span style={{ fontSize: "12px", color: "#A2A29C", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI marketer</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-accent,#C1502E)" }}>CLONING</span></div>
        </div>
      </div>

    </div>
  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
    <h2 data-reveal="1" style={{ margin: "0 auto", maxWidth: "20em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Six tools. One agent.<br /><span style={{ color: "#A2A29C" }}>Nobody accountable.</span></h2>
    <p data-reveal="1" style={{ margin: "18px auto 0", maxWidth: "33em", fontSize: "clamp(16px,1.2vw,19px)", color: "#5C5C58", letterSpacing: "-.012em" }}>This is what taking a single agent to production looks like without a control plane.</p>
    <div data-reveal="1" style={{ marginTop: "clamp(30px,3.6vw,52px)", borderRadius: "clamp(16px,1.8vw,22px)", overflow: "hidden", background: "#F4F4F1" }}>
      <ImageSlot id="lz-sprawl" shape="rect" src="/assets/sprawl.png" placeholder="Tool-sprawl collage" style={{ width: "100%", height: "auto", aspectRatio: "16/8" }} />
    </div>
    <p data-reveal="1" style={{ margin: "16px auto 0", fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".13em", textTransform: "uppercase", color: "#B8B8B2" }}>five systems · four owners · no audit trail</p>
  </div>
</section>

<section id="build" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(30px,3.4vw,50px)", maxWidth: "22em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Describe the agent.<br /><span style={{ color: "#A2A29C" }}>Architect builds the stack.</span></h2>
    <div data-reveal="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "clamp(18px,2vw,24px)", padding: "clamp(20px,2.4vw,34px)", display: "flex", flexWrap: "wrap", gap: "clamp(20px,2.4vw,40px)", alignItems: "center" }}>
      <div style={{ flex: "1 1 300px", minWidth: "0" }}>
        <p style={{ margin: "0", fontSize: "clamp(16px,1.2vw,19px)", color: "#3D3D39", letterSpacing: "-.012em", maxWidth: "26em" }}>Plain language in, a working agent out — logic, integrations, access control and interface, wired into the systems you already run. Governance is applied at build time, not bolted on afterwards.</p>
        <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginTop: "22px", fontSize: "16px", fontWeight: "500", color: "var(--lz-accent,#C1502E)" }}>Open Architect <span>→</span></a>
      </div>
      <div style={{ flex: "1.35 1 400px", minWidth: "0" }}>
        <div style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "13px", padding: "16px", boxShadow: "0 20px 40px -30px rgba(0,0,0,.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", border: "1px solid #EAEAE5", borderRadius: "10px", padding: "12px 13px", background: "#FCFCFB" }}>
            <span style={{ flex: "none", width: "6px", height: "6px", borderRadius: "50%", background: "var(--lz-accent,#C1502E)" }}></span>
            <span style={{ flex: "1", minWidth: "0", overflow: "hidden", whiteSpace: "nowrap", fontSize: "13.5px", letterSpacing: "-.01em", color: "#3D3D39" }}><span style={{ display: "inline-block", overflow: "hidden", whiteSpace: "nowrap", verticalAlign: "bottom", animation: "lzWipe 9s steps(46,end) infinite", animationPlayState: "var(--lz-play,running)" }}>An agent that reviews vendor contracts against our policy</span><span style={{ display: "inline-block", width: "6px", height: "14px", background: "var(--lz-accent,#C1502E)", verticalAlign: "-2px", marginLeft: "2px", animation: "lzCaret 1s step-end infinite", animationPlayState: "var(--lz-play,running)" }}></span></span>
            <span style={{ flex: "none", fontSize: "12px", fontWeight: "500", padding: "7px 13px", borderRadius: "7px", background: "var(--lz-accent,#C1502E)", color: "#fff" }}>Build</span>
          </div>
          <div style={{ marginTop: "16px", padding: "18px 12px", borderRadius: "10px", background: "#FAFAF8", border: "1px solid #F0F0EC" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", alignItems: "center" }}>
              <span style={{ padding: "7px 11px", borderRadius: "8px", background: "#fff", border: "1px solid #E7E7E2", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", animation: "lzNode 9s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}>intake</span>
              <span style={{ color: "#D6D6D0", fontSize: "11px", animation: "lzNode 9s ease-in-out .2s infinite", animationPlayState: "var(--lz-play,running)" }}>—</span>
              <span style={{ padding: "7px 11px", borderRadius: "8px", background: "#fff", border: "1px solid #E7E7E2", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", animation: "lzNode 9s ease-in-out .4s infinite", animationPlayState: "var(--lz-play,running)" }}>clause extract</span>
              <span style={{ color: "#D6D6D0", fontSize: "11px", animation: "lzNode 9s ease-in-out .6s infinite", animationPlayState: "var(--lz-play,running)" }}>—</span>
              <span style={{ padding: "7px 11px", borderRadius: "8px", background: "#fff", border: "1px solid #E7E7E2", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", animation: "lzNode 9s ease-in-out .8s infinite", animationPlayState: "var(--lz-play,running)" }}>policy match</span>
              <span style={{ color: "#D6D6D0", fontSize: "11px", animation: "lzNode 9s ease-in-out 1s infinite", animationPlayState: "var(--lz-play,running)" }}>—</span>
              <span style={{ padding: "7px 11px", borderRadius: "8px", background: "var(--lz-accent,#C1502E)", color: "#fff", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", animation: "lzNode 9s ease-in-out 1.2s infinite", animationPlayState: "var(--lz-play,running)" }}>human sign-off</span>
            </div>
            <div style={{ marginTop: "15px", display: "flex", flexWrap: "wrap", gap: "13px", justifyContent: "center", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2" }}>
              <span style={{ animation: "lzNode 9s ease-in-out 1.4s infinite", animationPlayState: "var(--lz-play,running)" }}>sharepoint</span>
              <span style={{ animation: "lzNode 9s ease-in-out 1.55s infinite", animationPlayState: "var(--lz-play,running)" }}>sap</span>
              <span style={{ animation: "lzNode 9s ease-in-out 1.7s infinite", animationPlayState: "var(--lz-play,running)" }}>okta rbac</span>
              <span style={{ animation: "lzNode 9s ease-in-out 1.85s infinite", animationPlayState: "var(--lz-play,running)" }}>audit log</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <div data-reveal="1" style={{ flex: "1 1 400px", minWidth: "0", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "clamp(18px,2vw,24px)", padding: "clamp(22px,2.6vw,40px)" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: "340px", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "12px", padding: "15px 16px", display: "flex", alignItems: "center", gap: "11px", animation: "lzDrift 7s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}>
          <img src="/assets/lyzr-wordmark-light.png" alt="" width="441" height="170" style={{ display: "block", height: "15px", width: "auto", filter: "invert(1)" }} />
          <span style={{ fontSize: "14px", fontWeight: "500", letterSpacing: "-.015em" }}>control plane</span>
          <span style={{ marginLeft: "auto", fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2" }}>policy · audit</span>
        </div>
        <div style={{ height: "58px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          <span style={{ width: "1px", flex: "1", background: "repeating-linear-gradient(180deg,#D6D6D0 0 4px,transparent 4px 9px)" }}></span>
          <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)", whiteSpace: "nowrap" }}>control only · no data</span>
          <span style={{ width: "1px", flex: "1", background: "repeating-linear-gradient(180deg,#D6D6D0 0 4px,transparent 4px 9px)" }}></span>
        </div>
        <div style={{ width: "100%", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "14px", padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "14px" }}><span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".11em", textTransform: "uppercase", color: "#A8A8A2" }}>your vpc</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#BDBDB7" }}>aws · us-east-1</span></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: "8px" }}>
            <div style={{ border: "1px solid #EFEFEB", borderRadius: "9px", padding: "13px 10px", textAlign: "center", background: "#FCFCFB" }}><div style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Agents</div><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#A8A8A2", marginTop: "3px" }}>running</div></div>
            <div style={{ border: "1px solid #EFEFEB", borderRadius: "9px", padding: "13px 10px", textAlign: "center", background: "#FCFCFB" }}><div style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Models</div><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#A8A8A2", marginTop: "3px" }}>yours</div></div>
            <div style={{ border: "1px solid #EFEFEB", borderRadius: "9px", padding: "13px 10px", textAlign: "center", background: "var(--lz-tint,#FBF3EF)" }}><div style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Data</div><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-ink2,#B08574)", marginTop: "3px" }}>stays put</div></div>
          </div>
          <div style={{ marginTop: "12px", height: "5px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "100%", background: "var(--lz-accent,#C1502E)", transformOrigin: "left", animation: "lzBar 5.5s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(26px,3.4vw,58px)", alignItems: "center" }}>
    <div data-reveal="1" style={{ flex: "1.25 1 420px", minWidth: "0", position: "relative", borderRadius: "clamp(16px,1.8vw,20px)", overflow: "hidden", background: "#F4F4F1" }}>
      <ImageSlot id="lz-story" shape="rect" src="/assets/story-ops.png" placeholder="Customer operations floor" style={{ width: "100%", height: "auto", aspectRatio: "16/10" }} />
      <div style={{ position: "absolute", left: "0", right: "0", bottom: "0", padding: "20px", background: "linear-gradient(180deg,transparent,rgba(11,11,11,.62))", pointerEvents: "none" }}>
        <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".13em", textTransform: "uppercase", color: "rgba(255,255,255,.82)" }}>airasia move · customer operations</span>
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
  <div data-reveal="1" style={{ maxWidth: "1280px", margin: "0 auto", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "clamp(18px,2vw,24px)", padding: "clamp(20px,2.4vw,34px)", display: "flex", flexWrap: "wrap", gap: "clamp(18px,2.2vw,32px)", alignItems: "stretch" }}>

    <div style={{ flex: "1 1 250px", minWidth: "0", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ borderRadius: "14px", overflow: "hidden", background: "#E9E9E4", flex: "1 1 auto" }}>
        <ImageSlot id="lz-founder" shape="rect" placeholder="Founder portrait — Siva Surendira (lyzr.ai)" style={{ width: "100%", height: "auto", aspectRatio: "4/5" }} src="/assets/founder-siva.png" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 2px" }}>
        <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".13em", textTransform: "uppercase", color: "#B4B4AE" }}>jersey city</span>
        <span style={{ flex: "1", height: "1px", background: "#E4E4DF" }}></span>
        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#B4B4AE" }}>2026</span>
      </div>
    </div>

    <div style={{ flex: "1.7 1 400px", minWidth: "0", background: "#fff", border: "1px solid #EDEDE8", borderRadius: "14px", padding: "clamp(24px,2.8vw,44px)", boxShadow: "0 1px 0 #F1F1EC,0 22px 44px -32px rgba(0,0,0,.2)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".13em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)" }}>a note from the founder</span>
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
    <div data-reveal="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "clamp(18px,2vw,24px)", padding: "clamp(24px,2.8vw,44px)" }}>
      <div style={{ position: "relative", height: "2px", background: "#E4E4DF", borderRadius: "2px", margin: "0 0 30px" }}><span style={{ position: "absolute", inset: "0", background: "var(--lz-accent,#C1502E)", borderRadius: "2px", transformOrigin: "left", animation: "lzBar 10s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: "clamp(18px,2.2vw,34px)" }}>
        <div>
          <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2" }}>week 1</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Pick the use case</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Applied AI architects sit with your team and choose the workflow worth automating.</p>
        </div>
        <div>
          <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2" }}>week 2–4</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Co-build it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Your engineers and ours build in the same workspace, inside your environment.</p>
        </div>
        <div>
          <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2" }}>week 5–7</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Harden it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Simulation, policy, guardrails and sign-off — the part most projects skip.</p>
        </div>
        <div>
          <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8.5px", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)" }}>week 8</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>You own it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Live in production, handed over with the IP and the roadmap.</p>
        </div>
      </div>
      <div style={{ marginTop: "clamp(26px,3vw,40px)", paddingTop: "22px", borderTop: "1px solid #E4E4DF", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: "0", fontSize: "15px", color: "#6E6E68", letterSpacing: "-.008em", maxWidth: "38em" }}>Prefer to move alone, or through a partner? Both work — 100+ partners deliver on Lyzr across BFSI, healthcare and telco.</p>
        <a href="#cta" style={{ fontSize: "15px", fontWeight: "500", padding: "12px 20px", borderRadius: "10px", background: "#fff", border: "1px solid #DEDED9", whiteSpace: "nowrap" }}>Find a partner</a>
      </div>
    </div>
  </div>
</section>

<section id="resources" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(28px,3vw,44px)", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Take something with you.</h2>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,1.6vw,22px)", alignItems: "stretch" }}>
      <a data-reveal="1" data-card="1" href="#cta" style={{ flex: "1 1 250px", minWidth: "0", background: "#F4F4F1", borderRadius: "20px", overflow: "hidden", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <ImageSlot id="lz-res-1" shape="rect" src="/assets/cover-1.png" placeholder="Cover — agentic roadmap playbook" style={{ width: "100%", height: "auto", aspectRatio: "5/3" }} />
        <div style={{ padding: "22px 22px 26px" }}>
          <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2" }}>playbook</div>
          <div style={{ fontSize: "19px", fontWeight: "500", letterSpacing: "-.022em", marginTop: "10px", lineHeight: "1.25" }}>Building an agentic roadmap for 2026</div>
        </div>
      </a>
      <a data-reveal="1" data-card="1" href="#cta" style={{ flex: "1 1 250px", minWidth: "0", background: "#F4F4F1", borderRadius: "20px", overflow: "hidden", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <ImageSlot id="lz-res-2" shape="rect" placeholder="Cover — 101 enterprise AI use cases" style={{ width: "100%", height: "auto", aspectRatio: "5/3" }} />
        <div style={{ padding: "22px 22px 26px" }}>
          <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2" }}>library</div>
          <div style={{ fontSize: "19px", fontWeight: "500", letterSpacing: "-.022em", marginTop: "10px", lineHeight: "1.25" }}>101 use cases you could deploy today</div>
        </div>
      </a>
      <a data-reveal="1" data-card="1" href="#cta" style={{ flex: "1 1 250px", minWidth: "0", background: "#F4F4F1", borderRadius: "20px", overflow: "hidden", transition: "transform .45s cubic-bezier(.16,1,.3,1)" }}>
        <ImageSlot id="lz-res-3" shape="rect" placeholder="Cover — prototype to production guide" style={{ width: "100%", height: "auto", aspectRatio: "5/3" }} />
        <div style={{ padding: "22px 22px 26px" }}>
          <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2" }}>guide</div>
          <div style={{ fontSize: "19px", fontWeight: "500", letterSpacing: "-.022em", marginTop: "10px", lineHeight: "1.25" }}>Getting a prototype past the valley of death</div>
        </div>
      </a>
    </div>
  </div>
</section>

<section id="cta" style={{ padding: "0 clamp(18px,4vw,48px) clamp(70px,8vw,120px)" }}>
  <div data-reveal="1" style={{ maxWidth: "1280px", margin: "0 auto", background: "#0B0B0B", borderRadius: "clamp(18px,2vw,26px)", padding: "clamp(48px,7vw,116px) clamp(24px,4vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "50%", top: "0", width: "min(760px,110%)", height: "100%", transform: "translateX(-50%)", background: "radial-gradient(60% 55% at 50% 0%,var(--lz-glow,rgba(193,80,46,.4)),transparent 70%)", pointerEvents: "none" }}></div>
    <div style={{ position: "relative" }}>
      <h2 style={{ margin: "0 auto", maxWidth: "18em", fontSize: "clamp(32px,4.4vw,70px)", fontWeight: "500", letterSpacing: "-.04em", lineHeight: "1.02", color: "#fff" }}>Bring a use case.<br /><span style={{ color: "var(--lz-lite,#E08A67)" }}>Leave with an agent in production.</span></h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "clamp(30px,3.4vw,44px)" }}>
        <a href="#top" style={{ fontSize: "16px", fontWeight: "500", padding: "15px 26px", borderRadius: "11px", background: "var(--lz-accent,#C1502E)", color: "#fff" }}>Talk to us</a>
        <a href="#top" style={{ fontSize: "16px", fontWeight: "500", padding: "15px 26px", borderRadius: "11px", border: "1px solid rgba(255,255,255,.24)", color: "#fff" }}>Open Agent Studio</a>
      </div>
    </div>
  </div>
</section>

<footer style={{ borderTop: "1px solid #EBEBE7", padding: "clamp(48px,5vw,76px) clamp(18px,4vw,48px) clamp(32px,3vw,44px)", background: "#FAFAF8" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,64px)" }}>
    <div style={{ flex: "1 1 240px", minWidth: "0" }}>
      <a href="#top" aria-label="Lyzr" style={{ display: "inline-flex" }}><img src="/assets/lyzr-wordmark-light.png" alt="Lyzr" width="441" height="170" style={{ display: "block", height: "27px", width: "auto", filter: "invert(1)" }} /></a>
      <p style={{ margin: "18px 0 0", fontSize: "14px", color: "#8E8E88", letterSpacing: "-.008em", maxWidth: "22em" }}>525 Washington Blvd, 2410<br />Jersey City, NJ 07310, USA</p>
      <div style={{ marginTop: "22px", display: "flex", gap: "8px", maxWidth: "300px" }}>
        <span style={{ flex: "1", padding: "11px 14px", borderRadius: "10px", border: "1px solid #E4E4DF", background: "#fff", fontSize: "14px", color: "#A8A8A2" }}>Work email</span>
        <span style={{ padding: "11px 16px", borderRadius: "10px", background: "var(--lz-accent,#C1502E)", color: "#fff", fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap" }}>Subscribe</span>
      </div>
      <p style={{ margin: "11px 0 0", fontSize: "13px", color: "#A8A8A2" }}>Field notes on agents in production. Twice a month.</p>
    </div>
    <div style={{ flex: "2 1 420px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "clamp(20px,2.4vw,34px)" }}>
      <div>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>platform</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#platform" style={{ color: "#3D3D39" }}>Control plane</a><a href="#build" style={{ color: "#3D3D39" }}>Agent Studio</a><a href="#build" style={{ color: "#3D3D39" }}>Architect</a><a href="#platform" style={{ color: "#3D3D39" }}>Blueprints</a><a href="#sovereign" style={{ color: "#3D3D39" }}>Responsible AI</a></div>
      </div>
      <div>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>solutions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#customers" style={{ color: "#3D3D39" }}>Banking</a><a href="#customers" style={{ color: "#3D3D39" }}>Insurance</a><a href="#customers" style={{ color: "#3D3D39" }}>Customer service</a><a href="#customers" style={{ color: "#3D3D39" }}>HR</a><a href="#customers" style={{ color: "#3D3D39" }}>Marketing</a></div>
      </div>
      <div>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>agents</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#platform" style={{ color: "#3D3D39" }}>Jazon · SDR</a><a href="#platform" style={{ color: "#3D3D39" }}>Skott · Marketer</a><a href="#platform" style={{ color: "#3D3D39" }}>Diane · HR</a><a href="#platform" style={{ color: "#3D3D39" }}>Dwight · RFP</a><a href="#platform" style={{ color: "#3D3D39" }}>Jeff · Support</a></div>
      </div>
      <div>
        <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: "8px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8A8A2", paddingBottom: "15px" }}>company</div>
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
