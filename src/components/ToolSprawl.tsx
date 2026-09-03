"use client";

import React, { useEffect, useRef, useState } from "react";
import s from "./ToolSprawl.module.css";

/* ------------------------------------------------------------------
   Six tools. One agent. Nobody accountable.
   Spacious desktop collage · 3-window compact mobile presentation.
   ------------------------------------------------------------------ */

type Vars = React.CSSProperties & Record<string, string | number>;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
  r: number;
}

interface Place {
  /* a: desktop spacious organic collage · b: tablet · c: 3-window compact mobile */
  a?: Box;
  b?: Box;
  c?: Box;
  /* float period + phase */
  fd?: string;
  fdl?: string;
  delay?: string;
}

function place(i: number, p: Place, fallbackDelay?: string) {
  const st: Vars = {
    "--i": i,
    "--fd": p.fd ?? "11s",
    "--fdl": p.fdl ?? "0s",
    "--delay": p.delay ?? fallbackDelay ?? `${i * 60}ms`,
  };
  const on: Record<string, string> = {};
  if (p.a) {
    Object.assign(st, { "--x": p.a.x, "--y": p.a.y, "--w": p.a.w, "--h": p.a.h, "--r": `${p.a.r}deg` });
    on["data-a"] = "";
  }
  if (p.b) {
    Object.assign(st, { "--bx": p.b.x, "--by": p.b.y, "--bw": p.b.w, "--bh": p.b.h, "--br": `${p.b.r}deg` });
    on["data-b"] = "";
  }
  if (p.c) {
    Object.assign(st, { "--cx": p.c.x, "--cy2": p.c.y, "--cw": p.c.w, "--ch": p.c.h, "--cr": `${p.c.r}deg` });
    on["data-c"] = "";
  }
  return { style: st, ...on };
}

/* ---------------- icons ---------------- */

const P: Record<string, string> = {
  home: "M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5",
  cpu: "M7 7h10v10H7zM4 10h3M4 14h3M17 10h3M17 14h3M10 4v3M14 4v3M10 17v3M14 17v3",
  drive: "M4 6h16v5H4zM4 13h16v5H4zM7 8.5h.01M7 15.5h.01",
  share: "M6 12h4m4 0h4M5 12a2 2 0 1 0 0-.1M19 12a2 2 0 1 0 0-.1M12 5a2 2 0 1 0 0-.1M12 19a2 2 0 1 0 0-.1M12 7v3M12 14v3",
  db: "M12 3c4 0 7 1.1 7 2.5S16 8 12 8 5 6.9 5 5.5 8 3 12 3ZM5 5.5v13C5 19.9 8 21 12 21s7-1.1 7-2.5v-13",
  spark: "m12 3 1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9zM18 16.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z",
  shield: "M12 3.5 5.5 6v6c0 4 2.8 6.9 6.5 8.5 3.7-1.6 6.5-4.5 6.5-8.5V6z",
  pulse: "M3 12h4l2.5-6 4 12L16 12h5",
  cursor: "m6 3 12 8-5 1.4L10.5 18z",
  square: "M5 5h14v14H5z",
  circle: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z",
  clock: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8v4l2.5 2",
  link: "M10 14a4 4 0 0 0 5.7 0l2.3-2.3a4 4 0 0 0-5.7-5.7L11 7.3M14 10a4 4 0 0 0-5.7 0L6 12.3a4 4 0 0 0 5.7 5.7L13 16.7",
  gear: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM12 2.6l1 2.5 2.6-.9 1 2.5 2.6.9-.9 2.6.9 2.6-2.6.9-1 2.5-2.6-.9-1 2.5-1-2.5-2.6.9-1-2.5-2.6-.9.9-2.6-.9-2.6 2.6-.9 1-2.5 2.6.9z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM16.5 16.5 21 21",
  send: "M4 12 20 4l-6.5 16-2.3-6.2z",
  warn: "M12 4 2.5 20h19zM12 10v4M12 17.2h.01",
  file: "M7 3h7l4 4v14H7zM14 3v4h4",
  down: "M12 4v11m0 0 4-4m-4 4-4-4M4 19h16",
  print: "M7 8V3h10v5M7 18H4v-7h16v7h-3M8 14h8v6H8z",
  chev: "m6 9 6 6 6-6",
  check: "m5 12.5 4.5 4.5L19 7.5",
  funnel: "M4 5h16l-6 7v7l-4-2v-5z",
  cloud: "M7.5 19a4.5 4.5 0 0 1-.4-9 6 6 0 0 1 11.5 1.6A3.9 3.9 0 0 1 17.5 19z",
  doc: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5",
  fx: "M14 5c-3 0-3 14-6 14M8 12h8",
};

function Icon({ n, w }: { n: string; w?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w ?? 1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={P[n]} />
    </svg>
  );
}

function Bar({ title, right, dark }: { title?: string; right?: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`${s.bar}${dark ? ` ${s.termBar}` : ""}`}>
      <span className={s.dots}>
        <i /><i /><i />
      </span>
      {title ? <span className={s.barTitle}>{title}</span> : null}
      {right ? <span className={s.barRight}>{right}</span> : null}
    </div>
  );
}

/* ---------------- curved dashed arrows ---------------- */

function Arrows({ id, box, paths, cls }: { id: string; box: string; paths: [string, boolean?][]; cls: string }) {
  return (
    <svg className={`${s.arrows} ${cls}`} viewBox={box} fill="none" aria-hidden="true">
      <defs>
        <marker id={`${id}-h`} viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse" markerUnits="strokeWidth">
          <path d="M0.8 1.4 9 5 0.8 8.6Z" fill="#8d8d86" stroke="none" />
        </marker>
      </defs>
      {paths.map(([d, both], i) => (
        <path
          key={i}
          d={d}
          stroke="#8d8d86"
          strokeWidth="1.6"
          strokeDasharray="4 4"
          markerEnd={`url(#${id}-h)`}
          markerStart={both ? `url(#${id}-h)` : undefined}
          style={{ animationDelay: `${(i % 5) * -0.7}s` } as Vars}
        />
      ))}
    </svg>
  );
}

/* Sweeping curved connector paths on spacious 1400x900 canvas */
const ARROWS_A: [string, boolean?][] = [
  // console -> flow
  ["M 350 120 C 375 95 395 85 430 75", true],
  // flow -> metrics
  ["M 750 125 C 765 135 778 145 800 150"],
  // metrics -> chat
  ["M 1050 160 C 1075 135 1095 115 1120 105"],
  // console -> incident
  ["M 190 225 C 205 270 300 280 370 340"],
  // incident -> terminal
  ["M 370 410 C 340 415 320 415 295 415"],
  // terminal -> pdf
  ["M 155 520 C 155 550 165 580 175 620"],
  // incident -> create model (bridges the spacious center)
  ["M 595 425 C 615 440 635 455 660 475"],
  // create model -> trace
  ["M 870 480 C 920 455 960 415 1010 385"],
  // trace -> service overview
  ["M 1190 505 C 1190 555 1160 595 1130 640"],
  // create model -> service overview
  ["M 870 570 C 890 595 910 615 940 640"],
];

const ARROWS_B: [string, boolean?][] = [
  ["M 330 46 C 344 30 358 22 372 22", true],
  ["M 300 264 C 288 278 282 292 286 304"],
  ["M 556 256 C 544 268 538 280 542 292"],
  ["M 330 700 C 348 706 366 704 380 696"],
];

/* Clean 2-arrow connector for the 3-window mobile presentation (360 x 440) */
const ARROWS_C: [string, boolean?][] = [
  // console -> incident
  ["M 175 130 C 185 135 190 140 195 145"],
  // incident -> terminal
  ["M 160 250 C 150 255 140 255 125 255"],
];

/* ---------------- layout definitions ---------------- */
const L = {
  // Batch 1
  console: {
    a: { x: 30, y: 25, w: 320, h: 195, r: -2.8 },
    b: { x: 10, y: 30, w: 340, h: 215, r: -1.8 },
    // Mobile: Instances window top-left (scaled down & fully in view)
    c: { x: 30, y: 15, w: 215, h: 125, r: -2.2 },
    fd: "12s",
    delay: "0.04s",
  },
  term: {
    a: { x: 20, y: 295, w: 275, h: 215, r: -3.5 },
    b: { x: 8, y: 280, w: 270, h: 220, r: -2 },
    // Mobile: Terminal bottom-left (ends at y: 370 on 440px canvas, no overflow!)
    c: { x: 20, y: 235, w: 210, h: 135, r: -2 },
    fd: "10.8s",
    fdl: "-3.6s",
    delay: "0.10s",
  },
  flow: {
    a: { x: 425, y: 12, w: 325, h: 225, r: 1.8 },
    b: { x: 380, y: 15, w: 325, h: 230, r: 1.4 },
    fd: "10.5s",
    fdl: "-1.4s",
    delay: "0.16s",
  },
  incident: {
    a: { x: 365, y: 325, w: 230, h: 185, r: -1.8 },
    b: { x: 300, y: 280, w: 230, h: 190, r: -1 },
    // Mobile: Incident mid-right (x: 135 to 310, leaving 50px right margin!)
    c: { x: 135, y: 130, w: 175, h: 135, r: 2.2 },
    fd: "10s",
    fdl: "-2.2s",
    delay: "0.08s",
  },

  // Batch 2 (desktop only)
  metrics: {
    a: { x: 795, y: 85, w: 255, h: 160, r: -2.2 },
    b: { x: 500, y: 50, w: 260, h: 165, r: -1.5 },
    fd: "11.5s",
    fdl: "-3.1s",
    delay: "0.50s",
  },
  chat: {
    a: { x: 1115, y: 20, w: 255, h: 220, r: 2.8 },
    b: { x: 540, y: 250, w: 260, h: 225, r: 1.8 },
    fd: "13s",
    fdl: "-0.8s",
    delay: "0.58s",
  },
  create: {
    a: { x: 655, y: 435, w: 215, h: 215, r: 2.6 },
    b: { x: 290, y: 500, w: 200, h: 215, r: 1.5 },
    fd: "10.2s",
    fdl: "-4.6s",
    delay: "0.62s",
  },
  trace: {
    a: { x: 1005, y: 310, w: 370, h: 190, r: -1.6 },
    b: { x: 460, y: 495, w: 340, h: 198, r: 2 },
    fd: "12s",
    fdl: "-5.2s",
    delay: "0.66s",
  },

  // Batch 3 (desktop only)
  pdf: {
    a: { x: 50, y: 610, w: 260, h: 220, r: 2.6 },
    fd: "11.8s",
    fdl: "-0.5s",
    delay: "0.84s",
  },
  service: {
    a: { x: 935, y: 630, w: 400, h: 94, r: 1.5 },
    fd: "13s",
    fdl: "-3.3s",
    delay: "0.90s",
  },
} satisfies Record<string, Place>;

/* Floating callout speech bubbles (Ramp style) */
const CALLOUTS = [
  {
    av: "SR",
    name: "Sam R.",
    msg: "Latency spike in eu-west-1, rollback?",
    pos: { x: 190, y: 265, r: -1.5 },
    delay: "0.76s",
  },
  {
    av: "UD",
    name: "Uma D.",
    msg: "Drift detected on customer-churn-v2",
    pos: { x: 865, y: 320, r: 2 },
    delay: "0.82s",
  },
];

/* Floating decorative badges & chips */
const CHIPS: { n: string; p: Place }[] = [
  { n: "cloud", p: { a: { x: 375, y: 5, w: 34, h: 34, r: 0 }, fd: "8s", delay: "0.94s" } },
  { n: "gear", p: { a: { x: 1085, y: 15, w: 34, h: 34, r: 0 }, fd: "9s", fdl: "-2s", delay: "0.96s" } },
  { n: "funnel", p: { a: { x: 615, y: 360, w: 34, h: 34, r: 0 }, fd: "8.5s", fdl: "-1.2s", delay: "0.95s" } },
  { n: "check", p: { a: { x: 1315, y: 575, w: 34, h: 34, r: 0 }, fd: "10s", fdl: "-5.5s", delay: "1.0s" } },
  { n: "doc", p: { a: { x: 325, y: 640, w: 34, h: 34, r: 0 }, fd: "9.5s", fdl: "-4s", delay: "0.98s" } },
];

/* ---------------- window components ---------------- */

const INSTANCES = [
  ["api-gateway", "t3.large", "Running", false],
  ["workers-1", "c6i.large", "Running", false],
  ["worker-2", "c6i.large", "Updating", true],
  ["db-primary", "r6i.xlarge", "Running", false],
] as const;

function CloudConsole() {
  const nav = [
    ["home", "Overview"],
    ["cpu", "Compute"],
    ["drive", "Storage"],
    ["share", "Networking"],
    ["db", "Databases"],
    ["spark", "AI / ML"],
  ];
  return (
    <div className={s.win}>
      <Bar />
      <div className={s.body}>
        <div className={s.cloudNav}>
          {nav.map(([ic, label], i) => (
            <span key={label} className={`${s.navItem}${i === 1 ? ` ${s.navOn}` : ""}`}>
              <Icon n={ic} />
              {label}
            </span>
          ))}
        </div>
        <div className={s.cloudMain}>
          <div className={s.crumb}>
            <Icon n="cloud" />
            <span>Cloud <b>/</b> prod <b>/</b> compute</span>
          </div>
          <div className={s.h1}>Instances</div>
          <div className={s.instTbl}>
            <table className={s.tbl}>
              <thead>
                <tr><th>Name</th><th>Type</th><th>Status</th></tr>
              </thead>
              <tbody>
                {INSTANCES.map(([name, type, status, hot], idx) => (
                  <tr key={name} className={idx >= 2 ? s.cloudExtraRow : undefined}>
                    <td>{name}</td>
                    <td>{type}</td>
                    <td>
                      <i className={`${s.statusDot}${hot ? ` ${s.pulseDot}` : ""}`} style={hot ? ({ background: "var(--acc)" } as Vars) : undefined} />
                      {status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

const NODES = [
  { l: "Ingest", x: 12, y: 76, d: 52, t: s.nodeGrey },
  { l: "Validate", x: 172, y: 38, d: 48, t: s.nodeDark },
  { l: "Transform", x: 74, y: 104, d: 54, t: s.nodeHot },
  { l: "Enrich", x: 152, y: 150, d: 48, t: s.nodeGrey },
  { l: "Publish", x: 242, y: 126, d: 52, t: s.nodeDark },
];

const EDGES: [string, boolean?][] = [
  ["M 54 116 C 64 128 70 132 78 132", true],
  ["M 112 110 C 132 88 148 76 166 66", true],
  ["M 204 76 C 228 100 246 116 260 130"],
  ["M 124 146 C 136 158 144 166 152 172", true],
  ["M 194 180 C 218 178 234 170 244 162", true],
  ["M 180 150 C 186 124 188 106 190 90", true],
];

function Workflow() {
  return (
    <div className={s.win}>
      <Bar title="Workflow Editor" />
      <div className={s.body}>
        <div className={s.flowTools}>
          {["cursor", "square", "circle", "clock", "link", "gear"].map((n) => (
            <Icon key={n} n={n} w={1.6} />
          ))}
        </div>
        <div className={s.canvas}>
          <span className={s.kebab}>···</span>
          <svg className={s.edges} viewBox="0 0 310 215" fill="none" aria-hidden="true">
            <defs>
              <marker id="ts-eh" viewBox="0 0 10 10" refX="8.4" refY="5" markerWidth="4.4" markerHeight="4.4" orient="auto-start-reverse" markerUnits="strokeWidth">
                <path d="M0.8 1.4 9 5 0.8 8.6Z" fill="#262622" />
              </marker>
            </defs>
            {EDGES.map(([d, both], i) => (
              <path key={i} d={d} stroke="#262622" strokeWidth="2.1" strokeLinecap="round" markerEnd="url(#ts-eh)" markerStart={both ? "url(#ts-eh)" : undefined} />
            ))}
          </svg>
          {NODES.map((n) => (
            <span key={n.l} className={`${s.node} ${n.t}`} style={{ "--nx": n.x, "--ny": n.y, "--nd": n.d } as Vars}>
              {n.l}
            </span>
          ))}
          <span className={s.zoom}><span>+</span><span>−</span><span>⤢</span></span>
        </div>
      </div>
    </div>
  );
}

/* Authentic Excel-Green Spreadsheet */
const METRICS = [
  ["model-a", "0.923", "0.891", "0.907", "12,483"],
  ["model-b", "0.847", "0.862", "0.854", "8,921"],
  ["model-c", "0.912", "0.938", "0.925", "13,244"],
  ["model-d", "0.876", "0.841", "0.858", "6,772"],
];

function ModelMetrics() {
  return (
    <div className={`${s.win} ${s.sheetWin}`}>
      <div className={s.sheetBar}>
        <span className={s.dots}>
          <i /><i /><i />
        </span>
        <span className={s.sheetBarTitle}>
          <span className={s.excelIcon}>X</span>
          Model Metrics.xlsx
        </span>
      </div>
      <div className={s.sheetFormulaBar}>
        <span className={s.sheetFx}>fx</span>
        <span className={s.sheetFormula}>=EVAL_SCORE(prod_models)</span>
      </div>
      <div className={s.metricsWrap}>
        <table className={s.gridTbl}>
          <thead>
            <tr>
              <th style={{ width: "22px", textAlign: "center" }}>#</th>
              <th>Model</th>
              <th style={{ textAlign: "right" }}>Precision</th>
              <th style={{ textAlign: "right" }}>Recall</th>
              <th style={{ textAlign: "right" }}>F1</th>
              <th style={{ textAlign: "right" }}>Samples</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map((r, i) => (
              <tr key={r[0]}>
                <td style={{ textAlign: "center", color: "#61856e" }}>{i + 1}</td>
                <td style={{ fontWeight: 500 }}>{r[0]}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--mono)" }}>{r[1]}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--mono)" }}>{r[2]}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--mono)" }}>{r[3]}</td>
                <td style={{ textAlign: "right", fontFamily: "var(--mono)" }}>{r[4]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TeamChat() {
  return (
    <div className={s.win}>
      <Bar title="Team Chat" right={<><Icon n="search" /><span style={{ letterSpacing: "0.08em" }}>···</span></>} />
      <div className={`${s.body} ${s.chat}`}>
        <div className={s.msg}>
          <span className={s.av}>AL</span>
          <span className={s.bubble}>Data refresh completed. Metrics look good.</span>
          <span className={s.stamp}>10:24</span>
        </div>
        <div className={`${s.msg} ${s.msgMine}`}>
          <span className={s.av}>JR</span>
          <span className={s.bubble}>Great! I&rsquo;ll run the evaluation suite next.</span>
          <span className={s.stamp}>10:26</span>
        </div>
        <div className={s.msg}>
          <span className={s.av}>UD</span>
          <span className={s.stackTyping} style={{ flex: 1 } as Vars}>
            <span className={`${s.bubble} ${s.lateTyping} ${s.typing}`} style={{ display: "inline-flex" } as Vars}><i /><i /><i /></span>
            <span className={`${s.bubble} ${s.lateMsg}`}>I&rsquo;m seeing a small drift in segment B. Investigating&hellip;</span>
          </span>
          <span className={s.stamp}>10:32</span>
        </div>
        <div className={s.composer}>
          <span className={s.field}>Type a message&hellip;</span>
          <span className={s.send}><Icon n="send" w={1.6} /></span>
        </div>
      </div>
    </div>
  );
}

/* Incident window with vibrating alert */
function IncidentWin() {
  return (
    <div className={`${s.win} ${s.incidentWin}`}>
      <Bar title="Incident #INC-4821" />
      <div className={`${s.body} ${s.incBody}`}>
        <div className={s.p1}>
          <Icon n="warn" w={2} />
          <span>P1 · BLOCKER</span>
        </div>
        <div className={s.incTitle}>API latency spike in eu-west-1</div>
        <div>
          <div className={s.kv}><span>Assignee</span><span><i className={s.avSm}>SR</i>Sam R.</span></div>
          <div className={s.kv}><span>Created</span><span>Apr 12, 2025</span></div>
          <div className={`${s.kv} ${s.incExtraKv}`}><span>Service</span><span>api-gateway</span></div>
          <div className={s.kv} style={{ borderBottom: 0 } as Vars}>
            <span>Labels</span>
            <span><i className={`${s.tag} ${s.tagHot}`}>latency</i> <i className={`${s.tag} ${s.tagGrey}`}>prod</i></span>
          </div>
        </div>
      </div>
    </div>
  );
}

const SPANS: [string, number, number, string][] = [
  ["request", 0, 34, ""],
  ["auth", 8, 17, "light"],
  ["user-service", 30, 26, ""],
  ["model-infer", 38, 30, "hot"],
  ["post-process", 56, 30, ""],
  ["response", 78, 18, ""],
];

function Trace() {
  return (
    <div className={s.win}>
      <Bar title="Trace Waterfall" />
      <div className={`${s.body} ${s.trace}`}>
        <div className={s.axis}>
          {["0ms", "50ms", "100ms", "150ms", "200ms", "250ms"].map((t) => <span key={t}>{t}</span>)}
        </div>
        <div className={s.spans}>
          <span className={s.gridlines} aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} />)}</span>
          {SPANS.map(([name, start, len, tone], i) => (
            <span key={name} className={s.span}>
              <span className={s.spanName}><Icon n="fx" w={2} />{name}</span>
              <span className={s.spanTrack}>
                <i className={s.spanBar} data-t={tone || undefined} style={{ "--s": start, "--l": len, "--i": i } as Vars} />
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const PODS = [
  ["api-gateway-7c8d9f", "2/2", "Running", "0", "4m", false],
  ["worker-1-3b6a7c", "2/2", "Running", "1", "12m", false],
  ["worker-2-9f4d1e", "1/2", "Updating", "3", "8m", true],
  ["db-1-5d9c2f", "2/2", "Running", "0", "1h", false],
] as const;

/* Left-aligned dark developer terminal on the left side */
function Terminal() {
  let i = 0;
  const line = (children: React.ReactNode, grid?: boolean, extraCls?: string) => (
    <div key={i} className={`${s.termLine}${grid ? ` ${s.termRow}` : ""}${extraCls ? ` ${extraCls}` : ""}`} style={{ "--i": i++ } as Vars}>
      {children}
    </div>
  );
  return (
    <div className={`${s.win} ${s.termWin}`}>
      <Bar title="Terminal" dark />
      <div className={`${s.body} ${s.term}`}>
        {line(<><span className={s.termPrompt}>$</span> kubectl get pods -n prod</>)}
        {line(<><span className={s.termHead}>NAME</span><span className={s.termHead}>READY</span><span className={s.termHead}>STATUS</span><span className={s.termHead}>RESTARTS</span><span className={s.termHead}>AGE</span></>, true)}
        {PODS.map(([n, ready, st, rs, age, hot], idx) => line(
          <><span>{n}</span><span>{ready}</span><span className={hot ? s.termHot : undefined}>{st}</span><span>{rs}</span><span className={hot ? s.termHot : undefined}>{age}</span></>,
          true,
          idx === 1 || idx === 2 ? s.termExtraRow : undefined
        ))}
        {line(<>&nbsp;</>, false, s.termExtraRow)}
        {line(<><span className={s.termPrompt}>$</span> ./deploy.sh --env prod</>)}
        {line(<span className={s.termDim}>Deploying&hellip;</span>, false, s.termExtraRow)}
        {line(<span className={s.termOk}>✓ Deployment successful.<i className={s.caret} /></span>)}
      </div>
    </div>
  );
}

function PdfWin() {
  return (
    <div className={s.win}>
      <Bar title="document.pdf" />
      <div className={s.pdfBar}>
        <span>1 <span style={{ color: "#a3a39d" }}>/ 24</span></span>
        <span style={{ marginLeft: "calc(14 * var(--p))", display: "flex", gap: "calc(10 * var(--p))", alignItems: "center" } as Vars}>
          <span>−</span><span>+</span><span>100%</span>
        </span>
        <span style={{ marginLeft: "auto", display: "flex", gap: "calc(11 * var(--p))" } as Vars}><Icon n="down" /><Icon n="print" /></span>
      </div>
      <div className={s.body}>
        <div className={s.pdfRail}>
          {[2, 3].map((n) => (
            <React.Fragment key={n}>
              <span className={s.thumb}>{Array.from({ length: 7 }, (_, i) => <span key={i} style={{ width: i === 6 ? "60%" : "100%" } as Vars} />)}</span>
              <b>{n}</b>
            </React.Fragment>
          ))}
        </div>
        <div className={s.page}>
          <div className={s.pageTitle}>Technical Assessment Report</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "calc(7 * var(--p))" } as Vars}>
            {[100, 96, 88, 100, 70, 94, 82].map((w, i) => <i key={i} className={s.sk} style={{ width: `${w}%` } as Vars} />)}
          </div>
          <span className={s.stampWrap}>
            <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
              <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="3" />
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.6" />
              <path d="M50 14 52.4 20 58.6 20 53.6 24 55.5 30 50 26.4 44.5 30 46.4 24 41.4 20 47.6 20Z M28 22 30 27 35 27 31 30.5 32.5 35.5 28 32.5 23.5 35.5 25 30.5 21 27 26 27Z M72 22 74 27 79 27 75 30.5 76.5 35.5 72 32.5 67.5 35.5 69 30.5 65 27 70 27Z" fill="currentColor" />
              <path d="M50 78 52.4 84 58.6 84 53.6 88 55.5 94 50 90.4 44.5 94 46.4 88 41.4 84 47.6 84Z M28 72 30 77 35 77 31 80.5 32.5 85.5 28 82.5 23.5 85.5 25 80.5 21 77 26 77Z M72 72 74 77 79 77 75 80.5 76.5 85.5 72 82.5 67.5 85.5 69 80.5 65 77 70 77Z" fill="currentColor" />
              <path d="M6 44h88v14H6z" fill="#fff" />
              <text x="50" y="55.5" textAnchor="middle" fill="currentColor" fontSize="13.5" fontWeight="700" fontFamily="Schibsted Grotesk, system-ui, sans-serif" letterSpacing="0.4">CONFIDENTIAL</text>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

function CreateModel() {
  return (
    <div className={s.win}>
      <Bar title="Create Model" />
      <div className={`${s.body} ${s.form}`}>
        <div className={s.label}>Model name</div>
        <div className={s.input}>customer-churn-v2</div>
        <div className={s.label}>Category</div>
        <div className={s.input}>Classification<Icon n="chev" /></div>
        <div className={s.label}>Threshold</div>
        <div className={`${s.input} ${s.inputBad}`}>1.5<Icon n="warn" w={2} /></div>
        <div className={s.err}>Value must be between 0 and 1</div>
        <div className={s.formBtns}>
          <span className={`${s.btn} ${s.btnGhost}`}>Cancel</span>
          <span className={`${s.btn} ${s.btnSolid}`}>Create</span>
        </div>
      </div>
    </div>
  );
}

const STATS: [string, string, string, string][] = [
  ["Requests / min", "12,483", "+ 12%", "M0 20 8 17 15 19 23 15 31 16 39 12 47 14 55 10 63 11 71 7 79 8 88 4 100 3"],
  ["Error rate", "0.48%", "+ 9%", "M0 19 9 18 17 20 25 16 33 18 41 13 49 15 57 12 66 13 74 9 83 10 100 5"],
  ["P95 latency", "128 ms", "+ 9%", "M0 18 8 19 16 16 24 18 32 14 40 16 48 12 56 14 64 10 73 11 82 6 100 4"],
  ["Cost (24h)", "$412.18", "+ 4%", "M0 20 9 18 18 19 27 15 36 17 45 13 54 14 63 11 72 12 81 8 90 6 100 2"],
];

function ServiceOverview() {
  return (
    <div className={s.win}>
      <Bar title="Service Overview" />
      <div className={`${s.body} ${s.stats}`}>
        {STATS.map(([k, v, delta, d], i) => (
          <div key={k} className={s.stat}>
            <span className={s.statK}>{k}</span>
            <span className={s.statV}>{v}</span>
            <span className={s.statFoot}>
              <svg viewBox="0 0 100 24" preserveAspectRatio="none" aria-hidden="true">
                <path className={s.spark} d={d} style={{ "--i": i } as Vars} vectorEffect="non-scaling-stroke" />
              </svg>
              <span>{delta}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const WINDOWS: [keyof typeof L, React.ComponentType][] = [
  ["console", CloudConsole],
  ["term", Terminal],
  ["flow", Workflow],
  ["incident", IncidentWin],
  ["metrics", ModelMetrics],
  ["chat", TeamChat],
  ["create", CreateModel],
  ["trace", Trace],
  ["pdf", PdfWin],
  ["service", ServiceOverview],
];

export default function ToolSprawl() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"rest" | "armed" | "in">("rest");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const frame = requestAnimationFrame(() => {
      setPhase("armed");
    });
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        setPhase("in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    io.observe(el);
    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
    };
  }, []);

  const cls = [s.stage, phase === "armed" && s.armed, phase === "in" && `${s.in} ${s.playing}`].filter(Boolean).join(" ");

  return (
    <div
      ref={ref}
      className={s.frame}
      role="img"
      aria-label="Disparate developer and ops tools: cloud instances, left-aligned developer terminal, workflow node graph, vibrating P1 incident, green Excel spreadsheet, team chat, model form, and trace waterfall."
    >
      <div className={cls}>
        <Arrows id="ts-a" box="0 0 1400 900" paths={ARROWS_A} cls={s.arrowsA} />
        <Arrows id="ts-b" box="0 0 820 730" paths={ARROWS_B} cls={s.arrowsB} />
        <Arrows id="ts-c" box="0 0 360 440" paths={ARROWS_C} cls={s.arrowsC} />

        {WINDOWS.map(([key, C], i) => (
          <div key={key} className={s.slot} {...place(i, L[key])}>
            <C />
          </div>
        ))}

        {CALLOUTS.map((c) => (
          <div
            key={c.name}
            className={s.callout}
            style={{
              "--x": c.pos.x,
              "--y": c.pos.y,
              "--r": `${c.pos.r}deg`,
              "--delay": c.delay,
            } as Vars}
          >
            <span className={s.calloutAv}>{c.av}</span>
            <div className={s.calloutBody}>
              <span className={s.calloutName}>{c.name}</span>
              <span className={s.calloutMsg}>{c.msg}</span>
            </div>
          </div>
        ))}

        {CHIPS.map((c, i) => (
          <span key={c.n} className={s.chip} {...place(WINDOWS.length + i, c.p)}>
            <Icon n={c.n} w={2} />
          </span>
        ))}
      </div>
    </div>
  );
}
