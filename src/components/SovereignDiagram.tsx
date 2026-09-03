"use client";

import Image from "next/image";
import { useState } from "react";

type SovereignView = "vpc" | "optimus";

const tabStyle = (active: boolean) => ({
  padding: "6px 14px",
  fontSize: "12px",
  fontWeight: "500",
  borderRadius: "var(--radius-md, 10px)",
  border: "1px solid",
  borderColor: active ? "var(--lz-accent, #C1502E)" : "#E7E7E2",
  background: active ? "#fff" : "transparent",
  color: active ? "var(--lz-accent, #C1502E)" : "#63635D",
  cursor: "pointer",
  transition:
    "color 160ms var(--ease-out), background-color 160ms var(--ease-out), border-color 160ms var(--ease-out), transform 160ms var(--ease-out)",
});

const statStyle = {
  border: "1px solid #EFEFEB",
  borderRadius: "var(--radius-md, 10px)",
  padding: "13px 10px",
  textAlign: "center" as const,
  background: "#FCFCFB",
};

function Stat({ label, value, highlighted = false }: { label: string; value: string; highlighted?: boolean }) {
  return (
    <div data-squircle="" style={{ ...statStyle, background: highlighted ? "var(--lz-tint, #FBF3EF)" : statStyle.background }}>
      <div style={{ fontSize: "12.5px", fontWeight: "500", letterSpacing: "-.01em" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "9.5px", color: highlighted ? "var(--lz-ink2, #B08574)" : "var(--lz-text-muted)", marginTop: "3px" }}>{value}</div>
    </div>
  );
}

export default function SovereignDiagram() {
  const [view, setView] = useState<SovereignView>("vpc");

  return (
    <div data-reveal="1" data-squircle="" style={{ flex: "1 1 400px", minWidth: 0, background: "#F4F4F1", backgroundImage: "radial-gradient(#E0E0D9 1px, transparent 1px)", backgroundSize: "15px 15px", backgroundPosition: "-1px -1px", borderRadius: "var(--radius-xl)", padding: "clamp(22px,2.6vw,36px)" }}>
      <div role="tablist" aria-label="Sovereign deployment options" style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "20px" }}>
        {(["vpc", "optimus"] as const).map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={view === option}
            onClick={() => setView(option)}
            data-squircle=""
            style={tabStyle(view === option)}
          >
            {option === "vpc" ? "Cloud VPC" : "Optimus Appliance"}
          </button>
        ))}
      </div>

      <div key={view} role="tabpanel" style={{ animation: "lzTabIn 220ms var(--ease-out) forwards" }}>
        {view === "vpc" ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div data-squircle="" style={{ width: "100%", maxWidth: "340px", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-md, 10px)", padding: "15px 16px", display: "flex", alignItems: "center", gap: "11px", animation: "lzDrift 7s ease-in-out infinite", animationPlayState: "var(--lz-play, running)" }}>
              <Image src="/assets/lyzr-wordmark-light.png" alt="Lyzr" width={441} height={170} sizes="40px" style={{ display: "block", height: "15px", width: "auto", filter: "invert(1)" }} />
              <span style={{ fontSize: "14px", fontWeight: "500", letterSpacing: "-.015em" }}>control plane</span>
              <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>policy · audit</span>
            </div>
            <div style={{ height: "58px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <span style={{ width: "1px", flex: 1, background: "repeating-linear-gradient(180deg,#D6D6D0 0 4px,transparent 4px 9px)" }} />
              <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-accent, #C1502E)", whiteSpace: "nowrap" }}>control only · no data</span>
              <span style={{ width: "1px", flex: 1, background: "repeating-linear-gradient(180deg,#D6D6D0 0 4px,transparent 4px 9px)" }} />
            </div>
            <div data-squircle="" style={{ width: "100%", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", padding: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "14px" }}>
                <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "var(--lz-text-muted)" }}>your vpc</span>
                <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "10px", color: "var(--lz-text-muted)" }}>aws · us-east-1</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(90px,1fr))", gap: "8px" }}>
                <Stat label="Agents" value="running" />
                <Stat label="Models" value="yours" />
                <Stat label="Data" value="stays put" highlighted />
              </div>
              <div style={{ marginTop: "12px", height: "5px", borderRadius: "3px", background: "#F1F1ED", overflow: "hidden" }}>
                <span style={{ display: "block", height: "100%", width: "100%", background: "var(--lz-accent, #C1502E)", transformOrigin: "left", animation: "lzBar 5.5s cubic-bezier(.4,0,.2,1) infinite", animationPlayState: "var(--lz-play, running)" }} />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
            <div data-squircle="" style={{ position: "relative", width: "100%", maxWidth: "340px", background: "#0B0B0B", borderRadius: "var(--radius-lg, 14px)", padding: "18px 20px", display: "flex", flexDirection: "column", alignItems: "center", border: "1px solid #222" }}>
              <div style={{ width: "100%", height: "170px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Image src="/assets/optimus.webp" alt="Lyzr Optimus sovereign AI private agent appliance" width={340} height={267} sizes="(max-width: 768px) 260px, 340px" style={{ maxHeight: "160px", width: "auto", objectFit: "contain", display: "block" }} />
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #222" }}>
                <span style={{ fontSize: "11px", fontWeight: "600", letterSpacing: ".08em", textTransform: "uppercase", color: "#A7A7A1" }}>Optimus-1 Node</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "var(--font-mono), ui-monospace, monospace", fontSize: "10px", color: "#61A87D" }}>
                  <span aria-hidden="true" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#61A87D" }} />
                  AIR-GAPPED · 0% EGRESS
                </span>
              </div>
            </div>
            <div data-squircle="" style={{ width: "100%", background: "#fff", border: "1px solid #E7E7E2", borderRadius: "var(--radius-lg, 14px)", padding: "14px 16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(80px,1fr))", gap: "8px" }}>
                <Stat label="Hardware" value="Dedicated" />
                <Stat label="Weights" value="Local" />
                <Stat label="Network" value="Air-gapped" highlighted />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
