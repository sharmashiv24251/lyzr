import type { CSSProperties } from "react";
import Image from "next/image";
import ImageSlot from "@/components/ImageSlot";
import AgentLifecycle from "@/components/AgentLifecycle";
import PlatformVideo from "@/components/PlatformVideo";
import ToolSprawl from "@/components/ToolSprawl";
import Navbar from "@/components/Navbar";
import FooterWordmark from "@/components/FooterWordmark";
import LandingMotion from "@/components/LandingMotion";
import SovereignDiagram from "@/components/SovereignDiagram";

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
  // overflow-x must be `clip`, not `hidden`: `hidden` establishes a scroll
  // container, which silently breaks `position: sticky` for every descendant
  // (the pinned lifecycle stage never engaged). `clip` still prevents
  // horizontal scroll but creates no scrollport.
  return (
<LandingMotion>
<Navbar />

<section id="top" data-reveal-group="" data-reveal-step="75" style={{ padding: "var(--lz-hero-pt, clamp(32px,4vw,64px)) clamp(18px,4vw,48px) clamp(20px,2.2vw,32px)" }}>
  <div style={{ maxWidth: "1040px", margin: "0 auto", textAlign: "center" }}>
    <h1 data-reveal="1" style={{ margin: "0", fontSize: "clamp(42px,6.2vw,88px)", fontWeight: "500", letterSpacing: "-.045em", lineHeight: ".97", textWrap: "balance" }}>Demos are easy.<br /><span style={{ color: "var(--lz-text-muted)" }}>Production is the job.</span></h1>
    <p data-reveal="1" style={{ margin: "clamp(20px,2.2vw,28px) auto 0", maxWidth: "34em", fontSize: "clamp(17px,1.3vw,20px)", color: "var(--lz-text-secondary)", letterSpacing: "-.012em", textWrap: "pretty" }}>Lyzr is the layer between a working agent and a governed one &mdash; registry, policy, simulation, observability and guardrails, running inside your own cloud.</p>
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

<section data-reveal-group="" data-reveal-step="65" style={{ padding: "0 clamp(18px,4vw,48px) clamp(66px,8vw,116px)" }}>
  
    <div data-reveal="1" data-squircle="" style={{ maxWidth: "1280px", margin: "0 auto", background: "var(--lz-tint,#FBF3EF)", border: "1px solid #F0E1D9", borderRadius: "var(--radius-xl)", padding: "clamp(20px,2.2vw,30px) clamp(20px,2.4vw,34px)", display: "flex", flexWrap: "wrap", gap: "clamp(18px,3vw,44px)" }}>
      <div data-reveal="1" style={{ flex: "1 1 152px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>agents in production</div>
        <div data-count="1047" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>1,047</div>
      </div>
      <div data-reveal="1" style={{ flex: "1 1 152px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>policy checks today</div>
        <div data-count="482193" data-live="1" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>482,193</div>
      </div>
      <div data-reveal="1" style={{ flex: "1 1 152px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none" }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></svg>unsafe outputs stopped</div>
        <div data-count="3204" data-live="1" style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px", color: "var(--lz-accent,#C1502E)" }}>3,204</div>
      </div>
      <div data-reveal="1" style={{ flex: "1 1 152px" }}>
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-ink2,#B08574)" }}>uptime, all deployments</div>
        <div style={{ fontSize: "clamp(24px,2.4vw,34px)", fontWeight: "500", letterSpacing: "-.03em", marginTop: "7px" }}>99.9%</div>
      </div>
    </div>
  
</section>

<section id="customers" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>

    <div data-reveal="1" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(20px,3vw,48px)", alignItems: "flex-end", marginBottom: "clamp(26px,3vw,40px)" }}>
      <h2 style={{ margin: "0", flex: "1 1 460px", maxWidth: "24em", fontSize: "clamp(28px,3.3vw,50px)", fontWeight: "500", letterSpacing: "-.034em", lineHeight: "1.05" }}>In production at 500+ enterprises. <span style={{ color: "var(--lz-text-muted)" }}>Built on the clouds they already trust.</span></h2>
      <a href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "9px", fontSize: "16px", fontWeight: "500", paddingBottom: "6px", whiteSpace: "nowrap" }}>Read the case studies <span style={{ color: "var(--lz-text-muted)" }}>→</span></a>
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,1.6vw,20px)" }}>

      <div data-reveal-group="" data-reveal-step="48" className="lz-brand-wall">
        {BRAND_TILES.map((brand) => (
          <div
            key={brand.name}
            data-reveal="1"
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
              } as CSSProperties}
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
      <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", flex: "none" }}>recognised by</span>
      <span style={{ flex: "1 1 auto", display: "flex", flexWrap: "wrap", gap: "clamp(14px,2.2vw,32px)", fontSize: "14px", color: "var(--lz-text-muted)", letterSpacing: "-.01em" }}>
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

    <div data-reveal-group="" data-reveal-step="75" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,330px),1fr))", gap: "clamp(14px,1.6vw,22px)", alignItems: "stretch" }}>


      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Register the agents you didn&apos;t build. <span data-dim="1">Nothing gets rewritten.</span></h3>
          <a href="#cta" aria-label="Explore the registry" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "var(--lz-text-secondary)" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden" }}>
          <div style={{ display: "flex", gap: "8px", padding: "9px 14px", borderBottom: "1px solid #EFEFEB", background: "#FCFCFB", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>
            <span style={{ flex: "1.5" }}>agent</span><span style={{ flex: "1" }}>built on</span><span style={{ flex: ".85" }}>runs / day</span><span style={{ flex: ".6", textAlign: "right" }}>state</span>
          </div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Claims Triage</span><span style={{ flex: "1", color: "var(--lz-text-muted)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>bedrock</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-text-secondary)" }}>18,402</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>KYC Reviewer</span><span style={{ flex: "1", color: "var(--lz-text-muted)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>azure ai</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-text-secondary)" }}>6,110</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Collections Desk</span><span style={{ flex: "1", color: "var(--lz-text-muted)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>langchain</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-text-secondary)" }}>2,988</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "#5C7A66" }}>LIVE</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", borderBottom: "1px solid #F4F4F0", fontSize: "13px", alignItems: "center" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Renewals Analyst</span><span style={{ flex: "1", color: "var(--lz-text-muted)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>vertex</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-text-secondary)" }}>941</span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "var(--lz-text-muted)" }}>STAGED</span></div>
          <div style={{ display: "flex", gap: "8px", padding: "10px 14px", fontSize: "13px", alignItems: "center", background: "var(--lz-tint,#FBF3EF)", animation: "lzRowIn 8s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "1.5", fontWeight: "500", letterSpacing: "-.01em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Vendor Diligence</span><span style={{ flex: "1", color: "var(--lz-text-muted)", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px" }}>agentforce</span><span style={{ flex: ".85", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-ink2,#B08574)" }}></span><span style={{ flex: ".6", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "var(--lz-accent,#C1502E)" }}>SYNCED</span></div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Policy runs before the model does. <span data-dim="1">Every call, every time.</span></h3>
          <a href="#cta" aria-label="Explore policy" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "var(--lz-text-secondary)" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "16px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "16px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "11px" }}>
            <span>request</span><span>outcome</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 17px 1fr", rowGap: "9px", alignItems: "center" }}>
            <div style={{ gridColumn: "2", gridRow: "1 / span 4", justifySelf: "center", width: "1px", height: "100%", background: "repeating-linear-gradient(180deg,#DEDED9 0 4px,transparent 4px 9px)" }}></div>

            <div style={{ gridColumn: "1", gridRow: "1", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-text-muted)" }}></span>summarise policy</span></div>
            <div style={{ gridColumn: "3", gridRow: "1", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C7A66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out .35s infinite", animationPlayState: "var(--lz-play,running)" }}>ALLOWED</div>

            <div style={{ gridColumn: "1", gridRow: "2", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) .55s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-text-muted)" }}></span>issue refund $4,200</span></div>
            <div style={{ gridColumn: "3", gridRow: "2", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "#5C7A66", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out .9s infinite", animationPlayState: "var(--lz-play,running)" }}>ALLOWED · LOGGED</div>

            <div style={{ gridColumn: "1", gridRow: "3", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid var(--lz-tint2,#E4CFC6)", background: "var(--lz-tint,#FBF3EF)", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) 1.1s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-accent,#C1502E)" }}></span>lookup SSN ···9930</span></div>
            <div style={{ gridColumn: "3", gridRow: "3", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "var(--lz-accent,#C1502E)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out 1.45s infinite", animationPlayState: "var(--lz-play,running)" }}>HELD AT GATE</div>

            <div style={{ gridColumn: "1", gridRow: "4", display: "flex", justifyContent: "flex-end", minWidth: "0" }}><span data-squircle="" style={{ display: "inline-flex", alignItems: "center", gap: "7px", maxWidth: "100%", padding: "6px 10px", borderRadius: "var(--radius-sm, 8px)", border: "1px solid #EAEAE5", background: "#FBFBFA", fontSize: "11.5px", letterSpacing: "-.005em", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzSlideX 7s cubic-bezier(.4,0,.2,1) 1.65s infinite", animationPlayState: "var(--lz-play,running)" }}><span style={{ flex: "none", width: "5px", height: "5px", borderRadius: "50%", background: "var(--lz-text-muted)" }}></span>escalate to human</span></div>
            <div style={{ gridColumn: "3", gridRow: "4", minWidth: "0", paddingLeft: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", letterSpacing: ".04em", color: "var(--lz-text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", animation: "lzNode 7s ease-in-out 2s infinite", animationPlayState: "var(--lz-play,running)" }}>ROUTED · RISK</div>
          </div>
          <div style={{ marginTop: "15px", paddingTop: "12px", borderTop: "1px solid #F1F1ED", display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px", color: "var(--lz-text-muted)" }}><span>role · budget · residency · retention</span><span style={{ color: "var(--lz-text-secondary)" }}>24 rules</span></div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>See every step an agent took. <span data-dim="1">Down to the token.</span></h3>
          <a href="#cta" aria-label="Explore traces" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "var(--lz-text-secondary)" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "4px" }}><span style={{ textTransform: "uppercase" }}>claims triage</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>run_8f2c91</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>retrieve</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "34%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>180ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>plan</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "58%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) .3s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>420ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>tool·crm</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "76%", background: "var(--lz-accent,#C1502E)", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) .6s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-accent,#C1502E)" }}>760ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>draft</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "46%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) .9s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>310ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>verify</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "22%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) 1.2s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>140ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>policy</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "18%", background: "#0B0B0B", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) 1.5s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>90ms</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}><span style={{ flex: "none", width: "54px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>redact</span><span style={{ flex: "1", height: "6px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}><span style={{ display: "block", height: "100%", width: "12%", background: "var(--lz-accent,#C1502E)", transformOrigin: "left", animation: "lzBar 6s cubic-bezier(.4,0,.2,1) 1.8s infinite", animationPlayState: "var(--lz-play,running)" }}></span></span><span style={{ flex: "none", width: "34px", textAlign: "right", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-accent,#C1502E)" }}>60ms</span></div>
          <div style={{ display: "flex", gap: "14px", marginTop: "6px", paddingTop: "11px", borderTop: "1px solid #F4F4F0" }}>
            <span style={{ flex: "1" }}><span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "var(--lz-text-muted)" }}>total</span><span style={{ display: "block", fontSize: "14px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "2px" }}>1.96s</span></span>
            <span style={{ flex: "1" }}><span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "var(--lz-text-muted)" }}>tokens</span><span style={{ display: "block", fontSize: "14px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "2px" }}>4,318</span></span>
            <span style={{ flex: "1" }}><span style={{ display: "block", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "var(--lz-text-muted)" }}>cost</span><span style={{ display: "block", fontSize: "14px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "2px" }}>$0.031</span></span>
          </div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Rehearse before you ship. <span data-dim="1">Fifty thousand times.</span></h3>
          <a href="#cta" aria-label="Explore the simulation engine" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "var(--lz-text-secondary)" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "10px" }}><span>simulation</span><span style={{ marginLeft: "auto" }}>claims-triage v15 · pre-prod</span></div>
          <div style={{ display: "flex", gap: "10px", paddingBottom: "11px", borderBottom: "1px solid #F1F1ED" }}>
            <div style={{ flex: "1" }}><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "var(--lz-text-muted)" }}>scenarios</div><div style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "3px" }}>50,000</div></div>
            <div style={{ flex: "1" }}><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "var(--lz-text-muted)" }}>adversarial</div><div style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "3px" }}>2,400</div></div>
            <div style={{ flex: "1" }}><div style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9px", color: "var(--lz-text-muted)" }}>six sigma</div><div style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em", marginTop: "3px" }}>5.8&#963;</div></div>
          </div>
          <div style={{ marginTop: "11px", display: "flex", flexDirection: "column", gap: "9px", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ flex: "1", color: "#44443F" }}>tier-2 cover</span><span style={{ flex: "none", width: "70px", height: "4px", background: "#F1F1ED" }}><span style={{ display: "block", height: "100%", width: "99%", background: "#5C8A70" }}></span></span><span style={{ flex: "none", width: "44px", textAlign: "right", color: "#4E7360" }}>99.4%</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ flex: "1", color: "#44443F" }}>duplicate claim</span><span style={{ flex: "none", width: "70px", height: "4px", background: "#F1F1ED" }}><span style={{ display: "block", height: "100%", width: "97%", background: "#5C8A70" }}></span></span><span style={{ flex: "none", width: "44px", textAlign: "right", color: "#4E7360" }}>97.2%</span></div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><span style={{ flex: "1", color: "#44443F" }}>policy edge case</span><span style={{ flex: "none", width: "70px", height: "4px", background: "#F1F1ED" }}><span style={{ display: "block", height: "100%", width: "38%", background: "var(--lz-accent,#C1502E)" }}></span></span><span style={{ flex: "none", width: "44px", textAlign: "right", color: "var(--lz-accent,#C1502E)" }}>held</span></div>
          </div>
          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #F1F1ED", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>
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

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Know what each agent costs. <span data-dim="1">And what it sent back.</span></h3>
          <a href="#cta" aria-label="Explore cost controls" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "var(--lz-text-secondary)" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden", padding: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "12px" }}><span>cost / week</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>last 7</span></div>
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
            <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10.5px", color: "var(--lz-text-muted)" }}>cost / resolved case</span>
            <span style={{ fontSize: "16px", fontWeight: "500", letterSpacing: "-.02em" }}>$0.31</span>
          </div>
        </div>
      </div>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(20px,2.2vw,30px)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <h3 style={{ margin: "0", flex: "1", fontSize: "clamp(19px,1.4vw,23px)", fontWeight: "500", letterSpacing: "-.022em", lineHeight: "1.2" }}>Or start from one already running. <span data-dim="1">A hundred of them.</span></h3>
          <a href="#cta" aria-label="Explore blueprints" data-squircle="" data-affordance="" style={{ flex: "none", width: "38px", height: "38px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #E7E7E2", display: "grid", placeItems: "center", fontSize: "15px", color: "var(--lz-text-secondary)" }}>↗</a>
        </div>
        <div data-squircle="" data-panel="" style={{ background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", flex: "1 1 auto", height: "clamp(230px,18vw,286px)", overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "9px 13px", borderBottom: "1px solid #EFEFEB", background: "#FCFCFB", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}><span>blueprints</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", letterSpacing: "0", textTransform: "none", color: "#C6C6C0" }}>bfsi · hr · support</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>JZ</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Jazon</span><span style={{ fontSize: "12px", color: "var(--lz-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI SDR</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>312 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>DI</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Diane</span><span style={{ fontSize: "12px", color: "var(--lz-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI HR partner</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>188 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", borderBottom: "1px solid #F4F4F0" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "#F1F1ED", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-text-muted)" }}>DW</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Dwight</span><span style={{ fontSize: "12px", color: "var(--lz-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI RFP scout</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "#C6C6C0" }}>96 forks</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 13px", background: "var(--lz-tint,#FBF3EF)", animation: "lzRowIn 8.5s ease-in-out infinite", animationPlayState: "var(--lz-play,running)" }}><span data-squircle="" style={{ width: "22px", height: "22px", borderRadius: "var(--radius-xs, 6px)", background: "var(--lz-hair,#F1DED6)", display: "grid", placeItems: "center", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-ink2,#B08574)" }}>SK</span><span style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>Skott</span><span style={{ fontSize: "12px", color: "var(--lz-text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>AI marketer</span><span style={{ marginLeft: "auto", fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "9.5px", color: "var(--lz-accent,#C1502E)" }}>CLONING</span></div>
        </div>
      </div>


    </div>
  </div>
</section>

<section id="sprawl" className="lz-sprawl-section" data-reveal-group="" data-reveal-step="70" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", textAlign: "center" }}>
    <h2 data-reveal="1" style={{ margin: "0 auto", maxWidth: "20em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Six tools. One agent.<br /><span style={{ color: "var(--lz-text-muted)" }}>Nobody accountable.</span></h2>
    <p data-reveal="1" style={{ margin: "18px auto 0", maxWidth: "33em", fontSize: "clamp(16px,1.2vw,19px)", color: "var(--lz-text-secondary)", letterSpacing: "-.012em" }}>This is what taking a single agent to production looks like without a control plane.</p>
    <div data-reveal="1" style={{ margin: "clamp(30px,3.6vw,52px) auto 0" }}>
      <ToolSprawl />
    </div>
    <p data-reveal="1" style={{ margin: "16px auto 0", fontSize: "11.5px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>six systems · four owners · no audit trail</p>
  </div>
</section>

<section id="sovereign" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,72px)", alignItems: "center" }}>
    <div data-reveal-group="" data-reveal-step="65" style={{ flex: "1 1 340px", minWidth: "0" }}>
      <h2 data-reveal="1" style={{ margin: "0", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Your cloud. Your models.<br /><span style={{ color: "var(--lz-text-muted)" }}>Your IP.</span></h2>
      <p data-reveal="1" style={{ margin: "22px 0 0", maxWidth: "28em", fontSize: "clamp(16px,1.2vw,19px)", color: "var(--lz-text-secondary)", letterSpacing: "-.012em" }}>Lyzr deploys inside your environment. Prompts, traces and customer data never cross the boundary, and the agents you build stay yours to take anywhere.</p>
      <div style={{ marginTop: "26px", maxWidth: "30em" }}>
        <div data-reveal="1" style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "13px 0", borderTop: "1px solid #EAEAE5", fontSize: "14.5px" }}><span style={{ color: "var(--lz-text-secondary)" }}>Runs in</span><span style={{ letterSpacing: "-.01em" }}>VPC, private cloud or air-gapped</span></div>
        <div data-reveal="1" style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "13px 0", borderTop: "1px solid #EAEAE5", fontSize: "14.5px" }}><span style={{ color: "var(--lz-text-secondary)" }}>Models</span><span style={{ letterSpacing: "-.01em" }}>Any provider, swappable</span></div>
        <div data-reveal="1" style={{ display: "flex", justifyContent: "space-between", gap: "16px", padding: "13px 0", borderTop: "1px solid #EAEAE5", borderBottom: "1px solid #EAEAE5", fontSize: "14.5px" }}><span style={{ color: "var(--lz-text-secondary)" }}>Certified</span><span style={{ letterSpacing: "-.01em" }}>SOC 2 Type II · ISO 27001 · HIPAA · GDPR</span></div>
      </div>
      <a data-reveal="1" href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginTop: "24px", fontSize: "16px", fontWeight: "500", color: "var(--lz-accent,#C1502E)" }}>Read the security brief <span>→</span></a>
    </div>
    <SovereignDiagram />
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
    <div data-reveal-group="" data-reveal-step="75" style={{ flex: "1 1 330px", minWidth: "0" }}>
      <h2 data-reveal="1" style={{ margin: "0", fontSize: "clamp(26px,2.6vw,40px)", fontWeight: "500", letterSpacing: "-.032em", lineHeight: "1.08" }}>Response time down 95%. <span style={{ color: "var(--lz-text-muted)" }}>Across every market they fly.</span></h2>
      <p data-reveal="1" style={{ margin: "24px 0 0", fontSize: "clamp(16px,1.2vw,19px)", color: "#3D3D39", letterSpacing: "-.012em", maxWidth: "27em" }}>“We stopped managing tickets and started managing outcomes. The agents absorb the volume, and we can still show an auditor exactly what happened on any single case.”</p>
      <div data-reveal="1" style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #EAEAE5" }}>
        <div style={{ fontSize: "15px", fontWeight: "500", letterSpacing: "-.012em" }}>Head of Customer Operations</div>
        <div style={{ fontSize: "14.5px", color: "var(--lz-text-muted)" }}>AirAsia MOVE</div>
      </div>
      <a data-reveal="1" href="#cta" style={{ display: "inline-flex", alignItems: "center", gap: "9px", marginTop: "20px", fontSize: "16px", fontWeight: "500", color: "var(--lz-accent,#C1502E)" }}>All customer stories <span>→</span></a>
    </div>
  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div data-squircle="" style={{ maxWidth: "1280px", margin: "0 auto", background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(20px,2.4vw,34px)", display: "flex", flexWrap: "wrap", gap: "clamp(18px,2.2vw,32px)", alignItems: "stretch" }}>

    <div data-reveal="1" style={{ flex: "1 1 250px", minWidth: "0", maxWidth: "340px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div data-squircle="" style={{ borderRadius: "var(--radius-lg, 14px)", overflow: "hidden", background: "#E9E9E4", flex: "1 1 auto" }}>
        <ImageSlot id="lz-founder" shape="rect" placeholder="Founder portrait · Siva Surendira (lyzr.ai)" style={{ width: "100%", height: "auto", aspectRatio: "4/5" }} src="/assets/founder-siva.webp" />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "0 2px" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>jersey city</span>
        <span style={{ flex: "1", height: "1px", background: "#E4E4DF" }}></span>
        <span style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "10px", color: "var(--lz-text-muted)" }}>2026</span>
      </div>
    </div>

    <div data-reveal-group="" data-reveal-step="75" data-squircle="" style={{ flex: "1.7 1 400px", minWidth: "0", background: "#fff", border: "1px solid #EDEDE8", borderRadius: "var(--radius-lg, 14px)", padding: "clamp(24px,2.8vw,44px)", boxShadow: "0 1px 0 #F1F1EC,0 22px 44px -32px rgba(0,0,0,.2)", display: "flex", flexDirection: "column" }}>
      <div data-reveal="1" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)" }}>a note from the founder</span>
        <span style={{ flex: "1", height: "1px", background: "var(--lz-hair,#EFE1DB)" }}></span>
      </div>
      <p data-reveal="1" style={{ margin: "clamp(20px,2.2vw,28px) 0 0", fontSize: "clamp(18px,1.7vw,26px)", lineHeight: "1.42", letterSpacing: "-.022em", color: "#1A1A18", maxWidth: "26em" }}>Most agent platforms sell you tools and leave your team to work out the rest. We think building an agent is the easy part now. Productionisation is where the real work starts.</p>
      <p data-reveal="1" style={{ margin: "clamp(14px,1.4vw,20px) 0 0", fontSize: "clamp(15px,1.15vw,17.5px)", lineHeight: "1.62", color: "var(--lz-text-secondary)", letterSpacing: "-.012em", maxWidth: "32em" }}>So we operate like Palantir for the agent era: platform and people together, our engineers deep in your data, staying until the thing is live and governed. That is the whole company.</p>
      <div data-reveal="1" style={{ marginTop: "auto", paddingTop: "clamp(24px,2.6vw,36px)" }}>
        <div style={{ height: "1px", background: "#EDEDE8", marginBottom: "16px" }}></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center" }}>
          <span style={{ width: "3px", height: "34px", borderRadius: "2px", background: "var(--lz-accent,#C1502E)", flex: "none" }}></span>
          <span style={{ flex: "1 1 auto", minWidth: "0" }}>
            <span style={{ display: "block", fontSize: "15.5px", fontWeight: "500", letterSpacing: "-.015em" }}>Siva Surendira</span>
            <span style={{ display: "block", fontSize: "14px", color: "var(--lz-text-muted)", letterSpacing: "-.01em" }}>Founder &amp; CEO, Lyzr</span>
          </span>
          <a href="#cta" style={{ fontFamily: "'JetBrains Mono',ui-monospace,monospace", fontSize: "11px", color: "var(--lz-text-muted)", whiteSpace: "nowrap" }}>read the long version ↗</a>
        </div>
      </div>
    </div>

  </div>
</section>

<section style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(28px,3vw,44px)", maxWidth: "24em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>A platform, and the engineers who ship it. <span style={{ color: "var(--lz-text-muted)" }}>Eight weeks, typically.</span></h2>
    <div data-squircle="" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(24px,2.8vw,44px)" }}>
      <div style={{ position: "relative", height: "2px", background: "#E4E4DF", borderRadius: "2px", margin: "0 0 30px" }}><span style={{ position: "absolute", inset: "0", background: "var(--lz-accent,#C1502E)", borderRadius: "2px", transformOrigin: "left", animation: "lzBar 10s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play,running)" }}></span></div>
      <div data-reveal-group="" data-reveal-step="70" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,190px),1fr))", gap: "clamp(18px,2.2vw,34px)" }}>
        <div data-reveal="1">
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>week 1</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Pick the use case</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Applied AI architects sit with your team and choose the workflow worth automating.</p>
        </div>
        <div data-reveal="1">
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>week 2–4</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Co-build it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Your engineers and ours build in the same workspace, inside your environment.</p>
        </div>
        <div data-reveal="1">
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>week 5–7</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>Harden it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Simulation, policy, guardrails and sign-off. The part most projects skip.</p>
        </div>
        <div data-reveal="1">
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-accent,#C1502E)" }}>week 8</div>
          <div style={{ fontSize: "clamp(17px,1.3vw,21px)", fontWeight: "500", letterSpacing: "-.02em", marginTop: "9px", lineHeight: "1.25" }}>You own it</div>
          <p style={{ margin: "8px 0 0", fontSize: "14.5px", color: "#6E6E68", letterSpacing: "-.008em" }}>Live in production, handed over with the IP and the roadmap.</p>
        </div>
      </div>
      <div data-reveal="1" style={{ marginTop: "clamp(26px,3vw,40px)", paddingTop: "22px", borderTop: "1px solid #E4E4DF", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: "0", fontSize: "15px", color: "#6E6E68", letterSpacing: "-.008em", maxWidth: "38em" }}>Prefer to move alone, or through a partner? Both work. 100+ partners deliver on Lyzr across BFSI, healthcare and telco.</p>
        <a href="#cta" data-squircle="" style={{ fontSize: "15px", fontWeight: "500", padding: "12px 20px", borderRadius: "var(--radius-md, 10px)", background: "#fff", border: "1px solid #DEDED9", whiteSpace: "nowrap" }}>Find a partner</a>
      </div>
    </div>
  </div>
</section>

<section id="resources" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(28px,3vw,44px)", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Take something with you.</h2>
    <div data-reveal-group="" data-reveal-step="85" style={{ display: "flex", flexWrap: "wrap", gap: "clamp(14px,1.6vw,22px)", alignItems: "stretch" }}>
      <a data-reveal="1" data-card="1" href="#cta" style={{ flex: "1 1 250px", minWidth: "0", display: "flex", flexDirection: "column", gap: "clamp(10px,1vw,14px)" }}>
        <div data-squircle="" data-res-media="" style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", background: "#F4F4F1", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
          <ImageSlot
            id="lz-res-1"
            data-res-book=""
            shape="rect"
            src="/assets/cover-3.webp"
            placeholder="The Agentic AI Roadmap · playbook cover"
            style={{
              position: "absolute",
              width: "76%",
              height: "auto",
              aspectRatio: "1 / 2",
              top: "calc(clamp(14px,1.8vw,22px) - 15.2%)",
              left: "50%",
            }}
          />
        </div>
        <div data-squircle="" data-res-body="" style={{ background: "#F4F4F1", borderRadius: "var(--radius-xl)", padding: "20px 22px 24px", flex: "1 1 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>playbook</div>
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
            placeholder="101 Enterprise AI Use Cases · template cover"
            style={{
              position: "absolute",
              width: "76%",
              height: "auto",
              aspectRatio: "1 / 2",
              top: "calc(clamp(14px,1.8vw,22px) - 15.2%)",
              left: "50%",
            }}
          />
        </div>
        <div data-squircle="" data-res-body="" style={{ background: "#F4F4F1", borderRadius: "var(--radius-xl)", padding: "20px 22px 24px", flex: "1 1 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>library</div>
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
            placeholder="Prototype to Production · field guide cover"
            style={{
              position: "absolute",
              width: "76%",
              height: "auto",
              aspectRatio: "1 / 2",
              top: "calc(clamp(14px,1.8vw,22px) - 15.2%)",
              left: "50%",
            }}
          />
        </div>
        <div data-squircle="" data-res-body="" style={{ background: "#F4F4F1", borderRadius: "var(--radius-xl)", padding: "20px 22px 24px", flex: "1 1 auto" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>guide</div>
          <div style={{ fontSize: "19px", fontWeight: "500", letterSpacing: "-.022em", marginTop: "10px", lineHeight: "1.25" }}>Getting a prototype past the valley of death</div>
        </div>
      </a>
    </div>
  </div>
</section>

<section id="tiers" style={{ padding: "0 clamp(18px,4vw,48px) clamp(76px,9vw,132px)" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h2 data-reveal="1" style={{ margin: "0 0 clamp(30px,3.4vw,50px)", maxWidth: "22em", fontSize: "clamp(30px,3.7vw,58px)", fontWeight: "500", letterSpacing: "-.036em", lineHeight: "1.03" }}>Start where you already are.<br /><span data-dim="1">Three ways in, one control plane.</span></h2>

    <div data-reveal-group="" data-reveal-step="85" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: "clamp(14px,1.6vw,22px)", alignItems: "stretch" }}>

      <div data-reveal="1" data-squircle="" data-card="1" style={{ background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px,transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.2vw,32px)", display: "flex", flexDirection: "column", gap: "clamp(18px,2vw,26px)" }}>
        <div>
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>control plane · self-serve</div>
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
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>agentic os · co-build</div>
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
          <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>sovereign ai · regulated</div>
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
  <div data-reveal-group="" data-reveal-step="80" data-squircle="" style={{ maxWidth: "1280px", margin: "0 auto", background: "#0B0B0B", borderRadius: "var(--radius-2xl)", padding: "clamp(48px,7vw,116px) clamp(24px,4vw,64px)", textAlign: "center", position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", left: "50%", top: "0", width: "min(760px,110%)", height: "100%", transform: "translateX(-50%)", background: "radial-gradient(60% 55% at 50% 0%,var(--lz-glow,rgba(193,80,46,.4)),transparent 70%)", pointerEvents: "none" }}></div>
    <div style={{ position: "relative" }}>
      <h2 data-reveal="1" style={{ margin: "0 auto", maxWidth: "18em", fontSize: "clamp(32px,4.4vw,70px)", fontWeight: "500", letterSpacing: "-.04em", lineHeight: "1.02", color: "#fff" }}>Bring a use case.<br /><span style={{ color: "var(--lz-lite,#E08A67)" }}>Leave with an agent in production.</span></h2>
      <div data-reveal="1" style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginTop: "clamp(30px,3.4vw,44px)" }}>
        <a href="#top" data-squircle="" style={{ fontSize: "16px", fontWeight: "500", padding: "15px 26px", borderRadius: "var(--radius-md, 10px)", background: "var(--lz-accent,#C1502E)", color: "#fff" }}>Talk to us</a>
        <a href="#top" data-squircle="" style={{ fontSize: "16px", fontWeight: "500", padding: "15px 26px", borderRadius: "var(--radius-md, 10px)", border: "1px solid rgba(255,255,255,.24)", color: "#fff" }}>Open Agent Studio</a>
      </div>
    </div>
  </div>
</section>

<footer data-reveal-group="" data-reveal-step="55" style={{ borderTop: "1px solid #EBEBE7", padding: "clamp(48px,5vw,76px) clamp(18px,4vw,48px) clamp(32px,3vw,44px)", background: "#FAFAF8" }}>
  <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "clamp(28px,4vw,64px)" }}>
    <div data-reveal="1" style={{ flex: "1 1 240px", minWidth: "0" }}>
      <a href="#top" aria-label="Lyzr" style={{ display: "inline-flex" }}><Image src="/assets/lyzr-wordmark-light.png" alt="Lyzr" width={441} height={170} sizes="70px" style={{ display: "block", height: "27px", width: "auto", filter: "invert(1)" }} /></a>
      <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--lz-text-muted)", letterSpacing: "-.008em", maxWidth: "22em" }}>525 Washington Blvd, 2410<br />Jersey City, NJ 07310, USA</p>
      <div style={{ marginTop: "22px", display: "flex", gap: "8px", maxWidth: "300px" }}>
        <span data-squircle="" style={{ flex: "1", padding: "11px 14px", borderRadius: "var(--radius-md, 10px)", border: "1px solid #E4E4DF", background: "#fff", fontSize: "14px", color: "var(--lz-text-muted)" }}>Work email</span>
        <span data-squircle="" style={{ padding: "11px 16px", borderRadius: "var(--radius-md, 10px)", background: "var(--lz-accent,#C1502E)", color: "#fff", fontSize: "14px", fontWeight: "500", whiteSpace: "nowrap" }}>Subscribe</span>
      </div>
      <p style={{ margin: "11px 0 0", fontSize: "13px", color: "var(--lz-text-muted)" }}>Field notes on agents in production. Twice a month.</p>
    </div>
    <div style={{ flex: "2 1 420px", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: "clamp(20px,2.4vw,34px)" }}>
      <div data-reveal="1">
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "15px" }}>platform</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#platform" style={{ color: "#3D3D39" }}>Control plane</a><a href="#build" style={{ color: "#3D3D39" }}>Agent Studio</a><a href="#build" style={{ color: "#3D3D39" }}>Architect</a><a href="#platform" style={{ color: "#3D3D39" }}>Blueprints</a><a href="#sovereign" style={{ color: "#3D3D39" }}>Responsible AI</a></div>
      </div>
      <div data-reveal="1">
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "15px" }}>solutions</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#customers" style={{ color: "#3D3D39" }}>Banking</a><a href="#customers" style={{ color: "#3D3D39" }}>Insurance</a><a href="#customers" style={{ color: "#3D3D39" }}>Customer service</a><a href="#customers" style={{ color: "#3D3D39" }}>HR</a><a href="#customers" style={{ color: "#3D3D39" }}>Marketing</a></div>
      </div>
      <div data-reveal="1">
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "15px" }}>agents</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#platform" style={{ color: "#3D3D39" }}>Jazon · SDR</a><a href="#platform" style={{ color: "#3D3D39" }}>Skott · Marketer</a><a href="#platform" style={{ color: "#3D3D39" }}>Diane · HR</a><a href="#platform" style={{ color: "#3D3D39" }}>Dwight · RFP</a><a href="#platform" style={{ color: "#3D3D39" }}>Jeff · Support</a></div>
      </div>
      <div data-reveal="1">
        <div style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)", paddingBottom: "15px" }}>company</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "9px", fontSize: "14.5px" }}><a href="#customers" style={{ color: "#3D3D39" }}>About</a><a href="#resources" style={{ color: "#3D3D39" }}>News</a><a href="#cta" style={{ color: "#3D3D39" }}>Careers</a><a href="#cta" style={{ color: "#3D3D39" }}>Pricing</a><a href="#cta" style={{ color: "#3D3D39" }}>Contact</a></div>
      </div>
    </div>
  </div>
  <div data-reveal="1" style={{ maxWidth: "1280px", margin: "clamp(36px,4vw,56px) auto 0", paddingTop: "22px", borderTop: "1px solid #EBEBE7", display: "flex", flexWrap: "wrap", gap: "14px", justifyContent: "space-between", fontSize: "13px", color: "var(--lz-text-muted)" }}>
    <span>© 2026 Lyzr AI. All rights reserved.</span>
    <span style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}><a href="#top" style={{ color: "var(--lz-text-muted)" }}>Privacy</a><a href="#top" style={{ color: "var(--lz-text-muted)" }}>Terms</a><a href="#top" style={{ color: "var(--lz-text-muted)" }}>Trust centre</a></span>
  </div>
  <FooterWordmark />
</footer>

</LandingMotion>

  );
}
