"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import s from "./AgentLifecycle.module.css";

/* ------------------------------------------------------------------
   One agent, described to audited. Scroll is time.

   The window never moves; only the view inside it changes. That is the
   whole reason this reads as an application rather than as five slides:
   the title bar, the sidebar and the account block are load-bearing and
   constant, and scrolling navigates between five real product surfaces
   the way clicking the sidebar would.

   Act 03 fails an evaluation gate and act 04 intercepts PII on the way
   out. Those are the only two acts allowed to use terracotta.
   ------------------------------------------------------------------ */

/* ---------- icons ----------
   One drawn set, 16px grid, 1.35 stroke, round joins. Product UI is
   made of icons; unicode glyphs standing in for them is the single
   fastest way to look like a mockup. */

type IconName =
  | "home" | "wand" | "layers" | "branch" | "shield" | "receipt"
  | "grid" | "sliders" | "search" | "filter" | "chevronR" | "chevronD"
  | "check" | "x" | "dash" | "plus" | "lock" | "clock" | "download"
  | "alert" | "clip" | "hash" | "arrowUR" | "user" | "sort";

const ICONS: Record<IconName, React.ReactNode> = {
  home: <path d="M2.6 6.8 8 2.4l5.4 4.4v6.2a.9.9 0 0 1-.9.9h-9a.9.9 0 0 1-.9-.9V6.8Z" />,
  wand: (
    <>
      <path d="M2.9 13.1 9.2 6.8" />
      <path d="m11.6 2.4.7 1.7 1.7.7-1.7.7-.7 1.7-.7-1.7-1.7-.7 1.7-.7.7-1.7Z" />
      <path d="m4.6 3.2.4 1 1 .4-1 .4-.4 1-.4-1-1-.4 1-.4.4-1Z" />
    </>
  ),
  layers: (
    <>
      <path d="M8 2.2 14 5.3 8 8.4 2 5.3 8 2.2Z" />
      <path d="m2 8.7 6 3.1 6-3.1" />
      <path d="m2 11.4 6 3.1 6-3.1" />
    </>
  ),
  branch: (
    <>
      <circle cx="4.6" cy="3.9" r="1.6" />
      <circle cx="4.6" cy="12.1" r="1.6" />
      <circle cx="11.4" cy="3.9" r="1.6" />
      <path d="M4.6 5.5v5" />
      <path d="M11.4 5.5v.9a3 3 0 0 1-3 3H7.6a3 3 0 0 0-3 3" />
    </>
  ),
  shield: <path d="M8 1.9 13.4 3.8v4.1c0 3.1-2.3 5.4-5.4 6.2-3.1-.8-5.4-3.1-5.4-6.2V3.8L8 1.9Z" />,
  receipt: (
    <>
      <path d="M3.6 2.2h8.8v11.6l-2.2-1.3-2.2 1.3-2.2-1.3-2.2 1.3Z" />
      <path d="M6.1 5.5h3.8M6.1 8.1h3.8" />
    </>
  ),
  grid: (
    <>
      <rect x="2.4" y="2.4" width="4.9" height="4.9" rx="1.1" />
      <rect x="8.7" y="2.4" width="4.9" height="4.9" rx="1.1" />
      <rect x="2.4" y="8.7" width="4.9" height="4.9" rx="1.1" />
      <rect x="8.7" y="8.7" width="4.9" height="4.9" rx="1.1" />
    </>
  ),
  sliders: (
    <>
      <path d="M2.6 4.6h10.8M2.6 11.4h10.8" />
      <circle cx="6" cy="4.6" r="1.6" />
      <circle cx="10.4" cy="11.4" r="1.6" />
    </>
  ),
  search: (
    <>
      <circle cx="7.2" cy="7.2" r="4.3" />
      <path d="m10.4 10.4 3.1 3.1" />
    </>
  ),
  filter: <path d="M2.6 3.4h10.8l-4.2 5v4.3l-2.4 1.2V8.4L2.6 3.4Z" />,
  chevronR: <path d="m6.4 3.6 4.2 4.4-4.2 4.4" />,
  chevronD: <path d="m3.6 6.4 4.4 4.2 4.4-4.2" />,
  check: <path d="m3.2 8.4 3.2 3.2 6.4-7.2" />,
  x: <path d="m4.4 4.4 7.2 7.2M11.6 4.4l-7.2 7.2" />,
  dash: <path d="M4 8h8" />,
  plus: <path d="M8 3.4v9.2M3.4 8h9.2" />,
  lock: (
    <>
      <rect x="3.4" y="7" width="9.2" height="6.6" rx="1.5" />
      <path d="M5.6 7V5.2a2.4 2.4 0 0 1 4.8 0V7" />
    </>
  ),
  clock: (
    <>
      <circle cx="8" cy="8" r="5.8" />
      <path d="M8 4.6V8l2.4 1.6" />
    </>
  ),
  download: (
    <>
      <path d="M8 2.6v7.4m0 0 2.8-2.8M8 10 5.2 7.2" />
      <path d="M3 13.2h10" />
    </>
  ),
  alert: (
    <>
      <path d="M8 2.8 14 13H2Z" />
      <path d="M8 6.6v2.8M8 11.1h.01" />
    </>
  ),
  clip: <path d="M12.4 7.6 7.9 12.1a2.9 2.9 0 0 1-4.1-4.1l4.9-4.9a1.9 1.9 0 0 1 2.7 2.7l-4.9 4.9a.9.9 0 0 1-1.3-1.3l4.5-4.5" />,
  hash: <path d="M6.4 2.6 4.8 13.4M11.2 2.6 9.6 13.4M2.8 5.9h10.4M2.4 10.1h10.4" />,
  arrowUR: <path d="M5.2 10.8 10.8 5.2M6.4 5.2h4.4v4.4" />,
  user: (
    <>
      <circle cx="8" cy="5.6" r="2.6" />
      <path d="M3.2 13.4a4.8 4.8 0 0 1 9.6 0" />
    </>
  ),
  sort: <path d="M4.4 3.4v9.2m0 0L2.2 10.4m2.2 2.2 2.2-2.2M11.6 12.6V3.4m0 0L9.4 5.6m2.2-2.2 2.2 2.2" />,
};

function Icon({ n, cls }: { n: IconName; cls?: string }) {
  return (
    <svg
      className={cls ? `${s.icon} ${cls}` : s.icon}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.35}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONS[n]}
    </svg>
  );
}

/* ---------- acts ---------- */

type ActId = "describe" | "register" | "gate" | "hold" | "answer";

interface Act {
  id: ActId;
  rail: string;
  icon: IconName;
  intercept: boolean;
  badge?: string;
  caption: React.ReactNode;
}

const ACTS: Act[] = [
  {
    id: "describe",
    rail: "Architect",
    icon: "wand",
    intercept: false,
    caption: (
      <>
        Plain language in, a working agent out — logic, integrations, access
        control and interface, wired into the systems you already run.{" "}
        <b>Governance is applied at build time, not bolted on afterwards.</b>
      </>
    ),
  },
  {
    id: "register",
    rail: "Registry",
    icon: "layers",
    intercept: false,
    badge: "17",
    caption: (
      <>
        Every agent your organisation runs, whoever built it and wherever it
        runs, with an owner against each one.{" "}
        <b>Registration is a gate, not a request</b> — an unregistered agent
        cannot deploy.
      </>
    ),
  },
  {
    id: "gate",
    rail: "Pipeline",
    icon: "branch",
    intercept: true,
    badge: "1",
    caption: (
      <>
        Enterprise software has had CI/CD for decades. Agent deployments have
        not. <b>Every deployment is tracked to the commit</b>, and the one that
        fails evaluation never reaches a user.
      </>
    ),
  },
  {
    id: "hold",
    rail: "Guardrails",
    icon: "shield",
    intercept: true,
    badge: "1",
    caption: (
      <>
        The draft was correct and still could not be sent. Policy runs before
        the model does, on every call.{" "}
        <b>Nothing reaches a customer without passing the guard layer.</b>
      </>
    ),
  },
  {
    id: "answer",
    rail: "Audit",
    icon: "receipt",
    intercept: false,
    caption: (
      <>
        Without a control plane the answer is &ldquo;something accessed our CRM
        at 2pm.&rdquo;{" "}
        <b>
          With one it carries a name, an owner, a timestamp and a policy
          version
        </b>{" "}
        — and the record cannot be edited after the fact.
      </>
    ),
  },
];

/* Sidebar entries that are not acts. A real control plane has more
   surface than the five screens this sequence walks through, and saying
   so costs one line each. */
const NAV_EXTRA_TOP = [{ label: "Overview", icon: "home" as IconName }];
const NAV_EXTRA_BOTTOM = [
  { label: "Integrations", icon: "grid" as IconName },
  { label: "Settings", icon: "sliders" as IconName },
];

/* ---------- data ----------
   Principle 4: one org, one owner, one run id, one claim reference,
   threaded through all five screens. dispute-resolver-v2.3 appears in
   the registry, then again in the audit trail. */

const PROMPT = "Triage inbound claims, check policy, draft the decision letter.";

const CAPABILITIES = [
  { verb: "Read", what: "the inbound claim queue", via: "SharePoint" },
  { verb: "Look up", what: "policy and schedule of benefits", via: "SAP" },
  { verb: "Enforce", what: "who may approve a decision", via: "Okta RBAC" },
  { verb: "Record", what: "every decision it makes", via: "Audit log" },
];

const MODELS = [
  { label: "openai", logo: "/assets/logos/openai.svg" },
  { label: "anthropic", logo: "/assets/logos/anthropic.svg" },
  { label: "gemini", logo: "/assets/logos/vertex.svg" },
  { label: "nvidia", logo: "/assets/logos/nvidia.svg" },
];

const AGENTS = [
  { name: "Claims Triage", id: "claims-triage-v4.1", owner: "P. Raman", init: "PR", on: "bedrock", logo: "/assets/logos/bedrock.svg", runs: "18,402", p95: "1.9s", state: "LIVE", tone: "ok" },
  { name: "KYC Reviewer", id: "kyc-reviewer-v2.0", owner: "A. Nayar", init: "AN", on: "azure ai", logo: "/assets/logos/azure.svg", runs: "6,110", p95: "2.4s", state: "LIVE", tone: "ok" },
  { name: "Collections Desk", id: "collections-desk-v1.7", owner: "M. Osei", init: "MO", on: "langchain", logo: "/assets/logos/langchain.svg", runs: "2,988", p95: "3.1s", state: "LIVE", tone: "ok" },
  { name: "Dispute Resolver", id: "dispute-resolver-v2.3", owner: "P. Raman", init: "PR", on: "bedrock", logo: "/assets/logos/bedrock.svg", runs: "1,204", p95: "2.2s", state: "LIVE", tone: "ok" },
  { name: "Renewals Analyst", id: "renewals-analyst-v0.9", owner: "J. Whitmore", init: "JW", on: "vertex", logo: "/assets/logos/vertex.svg", runs: "941", p95: "2.8s", state: "STAGED", tone: "idle" },
  { name: "Vendor Diligence", id: "vendor-diligence-v1.0", owner: "A. Nayar", init: "AN", on: "agentforce", logo: "/assets/logos/agentforce.svg", runs: "—", p95: "—", state: "SYNCED", tone: "idle" },
];

const STAGES = [
  { name: "Git push", state: "passed", dur: "2s", tone: "pass" },
  { name: "Code scan", state: "passed", dur: "41s", tone: "pass" },
  { name: "Build image", state: "passed", dur: "3m 12s", tone: "pass" },
  { name: "Non-prod", state: "passed", dur: "1m 04s", tone: "pass" },
  { name: "Evaluation gate", state: "failed", dur: "2m 18s", tone: "fail" },
  { name: "Approval", state: "blocked", dur: "—", tone: "idle" },
  { name: "Prod deploy", state: "blocked", dur: "—", tone: "idle" },
];

const COMMITS = [
  { sha: "a71a73d", msg: "Improve grounding on edge cases", who: "@priya", evals: "18/20", dur: "2m 18s", env: "non-prod", verdict: "blocked", tone: "fail", open: true },
  { sha: "608472f", msg: "Update RAI policy config", who: "@arjun", evals: "20/20", dur: "1m 51s", env: "prod", verdict: "deployed", tone: "idle" },
  { sha: "3bc91e2", msg: "Add hallucination threshold adjustment", who: "@mei", evals: "20/20", dur: "2m 04s", env: "prod", verdict: "deployed", tone: "idle" },
  { sha: "d4f12a9", msg: "Refund logic fix", who: "@priya", evals: "16/20", dur: "2m 33s", env: "—", verdict: "rolled back", tone: "fail" },
];

const EVAL_CHECKS = [
  { name: "Grounding score", want: "≥ 0.95", got: "0.91", ok: false },
  { name: "Unsupported claims", want: "= 0", got: "2 found", ok: false },
  { name: "PII leakage", want: "= 0", got: "0", ok: true },
  { name: "Refusal rate", want: "≤ 2%", got: "0.4%", ok: true },
];

const POLICY_CHECKS = [
  { name: "Grounding", val: "0.96", ok: true },
  { name: "Refusal rate", val: "0.0%", ok: true },
  { name: "Reading level", val: "grade 9", ok: true },
  { name: "PII redaction", val: "2 spans", ok: false },
  { name: "Unsupported claims", val: "1 held", ok: false },
  { name: "Retention class", val: "7 years", ok: true },
];

const HOLD_TIMELINE = [
  { t: "14:32:07.114", what: "Model returned draft" },
  { t: "14:32:07.119", what: "Guard layer ran 6 policies" },
  { t: "14:32:07.121", what: "Held before egress", tone: "fail" },
];

const EVENTS = [
  { t: "14:32:07.121", actor: "dispute-resolver-v2.3", action: "outbound.draft", res: "CLM-2291-04", pol: "v24", result: "held", tone: "fail" },
  { t: "14:32:07.098", actor: "dispute-resolver-v2.3", action: "record.read", res: "northbridge-crm", pol: "v24", result: "allowed", tone: "idle", open: true },
  { t: "14:31:52.004", actor: "claims-triage-v4.1", action: "policy.lookup", res: "sap.benefits", pol: "v24", result: "allowed", tone: "idle" },
  { t: "14:28:44.310", actor: "ci.pipeline", action: "deploy.block", res: "claims-triage", pol: "v24", result: "blocked", tone: "fail" },
];

const RECORD: [string, React.ReactNode][] = [
  ["agent", "dispute-resolver-v2.3"],
  ["owner", "priya.raman@northbridge.com"],
  ["resource", "northbridge-crm · contact 88214"],
  ["action", "record.read · 3 fields"],
  ["policy", "v24 · rbac.crm.read"],
  ["redaction", <span key="r" className={s.hot}>1 span</span>],
  ["event hash", "9f2c7a…a71d34"],
  ["prev hash", "4c1188…8f2c7a"],
];

/* ---------- shared view pieces ---------- */

function ViewHead({
  crumb,
  title,
  meta,
  state,
  actions,
}: {
  crumb: string[];
  title: string;
  meta: React.ReactNode;
  state: { label: string; tone: "ok" | "idle" | "fail" };
  actions: React.ReactNode;
}) {
  return (
    <header className={s.viewHead}>
      <div className={s.viewHeadMain}>
        <div className={s.crumb}>
          {crumb.map((c, i) => (
            <React.Fragment key={c}>
              {i > 0 && <Icon n="chevronR" cls={s.crumbSep} />}
              <span data-cur={i === crumb.length - 1 ? "1" : undefined}>{c}</span>
            </React.Fragment>
          ))}
        </div>
        <div className={s.titleRow}>
          <h3 className={s.viewTitle}>{title}</h3>
          <span className={s.state} data-tone={state.tone}>
            <span className={s.statePip} />
            {state.label}
          </span>
        </div>
        <div className={s.viewMeta}>{meta}</div>
      </div>
      <div className={s.viewActions}>{actions}</div>
    </header>
  );
}

function Btn({
  children,
  primary,
  disabled,
  icon,
}: {
  children: React.ReactNode;
  primary?: boolean;
  disabled?: boolean;
  icon?: IconName;
}) {
  /* Deliberately not a <button>. This frame is a picture of an
     application, not an application; real buttons here would add five
     screens of dead tab stops that do nothing when pressed. */
  return (
    <span className={primary ? s.btnPrimary : s.btn} data-off={disabled ? "1" : undefined}>
      {icon && <Icon n={icon} />}
      {children}
    </span>
  );
}

function SearchField({ hint = "⌘K", placeholder }: { hint?: string; placeholder: string }) {
  return (
    <span className={s.search}>
      <Icon n="search" />
      <span className={s.searchPh}>{placeholder}</span>
      <kbd className={s.kbd}>{hint}</kbd>
    </span>
  );
}

function Avatar({ initials, size }: { initials: string; size?: "sm" }) {
  return (
    <span className={s.avatar} data-size={size}>
      {initials}
    </span>
  );
}

function Mark({ src }: { src: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img className={s.mark} src={src} alt="" aria-hidden="true" width={16} height={16} />
  );
}

/* ==================================================================
   ACT 01 — Architect
   ================================================================== */

function ActDescribe() {
  return (
    <>
      <ViewHead
        crumb={["Architect", "New agent"]}
        title="Claims Triage"
        meta={
          <>
            draft · never deployed · <span className={s.metaOwner}>P. Raman</span>
          </>
        }
        state={{ label: "DRAFTING", tone: "idle" }}
        actions={
          <>
            <Btn>Discard</Btn>
            <Btn primary>
              Build agent <kbd className={s.kbdOnDark}>⌘↵</kbd>
            </Btn>
          </>
        }
      />

      <div className={s.architect}>
        <div className={s.buildCol}>
          <div className={s.composer}>
            <div className={s.composerLabel}>Describe what it should do</div>
            <p className={s.promptText}>
              <span data-typed="">{PROMPT}</span>
              <span className={s.caret} />
            </p>
            <div className={s.composerFoot}>
              <span className={s.composerHint}>
                <Icon n="clip" />
                Attach policy documents
              </span>
              <span className={s.composerCount}>58 / 2000</span>
            </div>
          </div>

          <section className={s.panel}>
            <div className={s.panelHead}>
              <span className={s.panelTitle}>Wired into what you already run</span>
              <span className={s.panelMeta}>4 systems · resolved from your tenant</span>
            </div>
            <ul className={s.capList}>
              {CAPABILITIES.map((c) => (
                <li className={s.capRow} key={c.via} data-cap="">
                  <span className={s.capTick}>
                    <Icon n="check" />
                  </span>
                  <span className={s.capText}>
                    <b>{c.verb}</b> {c.what}
                  </span>
                  <span className={s.capVia}>{c.via}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className={s.inspector}>
          <div className={s.inspectGroup}>
            <div className={s.inspectLabel}>Runtime</div>
            <div className={s.kvRow}>
              <span>Deployment</span>
              <b>your vpc</b>
            </div>
            <div className={s.kvRow}>
              <span>Region</span>
              <b>us-east-1</b>
            </div>
            <div className={s.kvRow}>
              <span>Networking</span>
              <b>private link</b>
            </div>
          </div>

          <div className={s.inspectGroup}>
            <div className={s.inspectLabel}>Model</div>
            <div className={s.kvRow}>
              <span>Provider</span>
              <b className={s.modelCell}>
                <span className={s.modelMarks}>
                  {MODELS.map((m) => (
                    <Mark key={m.label} src={m.logo} />
                  ))}
                </span>
                swappable
              </b>
            </div>
            <div className={s.kvRow}>
              <span>Routing</span>
              <b>cost + latency</b>
            </div>
          </div>

          <div className={s.inspectGroup}>
            <div className={s.inspectLabel}>Governance</div>
            <div className={s.kvRow}>
              <span>Policy set</span>
              <b>v24 · inherited</b>
            </div>
            <div className={s.kvRow}>
              <span>Eval gate</span>
              <b>required</b>
            </div>
            <div className={s.kvRow}>
              <span>Migration</span>
              <b>none required</b>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}

/* ==================================================================
   ACT 02 — Registry
   ================================================================== */

function ActRegister() {
  return (
    <>
      <ViewHead
        crumb={["Registry"]}
        title="Agent registry"
        meta="17 agents · 5 platforms · 4 owners"
        state={{ label: "17 / 17 REGISTERED", tone: "ok" }}
        actions={
          <>
            <SearchField placeholder="Search agents" />
            <Btn icon="filter">Filter</Btn>
            <Btn primary icon="plus">
              Register agent
            </Btn>
          </>
        }
      />

      <div className={s.toolbar}>
        <div className={s.segmented}>
          <span data-on="1">All 17</span>
          <span>Live 11</span>
          <span>Staged 4</span>
          <span>Synced 2</span>
        </div>
        <span className={s.toolbarRight}>
          <Icon n="sort" />
          Runs / day
          <Icon n="chevronD" cls={s.chevSm} />
        </span>
      </div>

      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">Agent</th>
              <th scope="col">Owner</th>
              <th scope="col">Built on</th>
              <th scope="col" className={s.right}>Runs / day</th>
              <th scope="col" className={s.right}>p95</th>
              <th scope="col" className={s.right}>State</th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((a) => (
              <tr key={a.id} data-row="">
                <td>
                  <span className={s.agentName}>{a.name}</span>
                  <span className={s.agentId}>{a.id}</span>
                </td>
                <td>
                  <span className={s.ownerCell}>
                    <Avatar initials={a.init} size="sm" />
                    {a.owner}
                  </span>
                </td>
                <td>
                  <span className={s.builtOn}>
                    <Mark src={a.logo} />
                    {a.on}
                  </span>
                </td>
                <td className={`${s.num} ${s.right}`}>{a.runs}</td>
                <td className={`${s.num} ${s.right}`}>{a.p95}</td>
                <td className={s.right}>
                  <span className={s.pill} data-tone={a.tone}>
                    {a.state}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={s.viewFoot}>
        <span>6 of 17 shown</span>
        <span className={s.pager}>
          <i data-on="1">1</i>
          <i>2</i>
          <i>3</i>
          <Icon n="chevronR" cls={s.chevSm} />
        </span>
        <span>none rewritten · none migrated</span>
      </div>
    </>
  );
}

/* ==================================================================
   ACT 03 — Pipeline
   ================================================================== */

function ActGate() {
  return (
    <>
      <ViewHead
        crumb={["Pipeline", "claims-triage"]}
        title="main → prod"
        meta={
          <>
            triggered by <span className={s.metaOwner}>@priya</span> · 4m ago ·
            run #2841
          </>
        }
        state={{ label: "EVAL FAILED", tone: "fail" }}
        actions={
          <>
            <Btn icon="arrowUR">View logs</Btn>
            <Btn primary>Re-run evals</Btn>
          </>
        }
      />

      <div className={s.pipe}>
        {STAGES.map((st, i) => (
          <div className={s.pipeStage} key={st.name} data-tone={st.tone} data-stage="">
            <span className={s.stageTop}>
              <span className={s.stageIco}>
                <Icon n={st.tone === "pass" ? "check" : st.tone === "fail" ? "x" : "dash"} />
              </span>
              <span className={s.stageName}>{st.name}</span>
            </span>
            <span className={s.stageBar}>
              <i />
            </span>
            <span className={s.stageFoot}>
              <span className={s.stageState}>{st.state}</span>
              <span className={s.stageDur}>{st.dur}</span>
            </span>
            {i < STAGES.length - 1 && <span className={s.stageLink} aria-hidden="true" />}
          </div>
        ))}
      </div>

      <div className={s.commits}>
        <div className={s.commitRow} data-head="1">
          <span>Commit</span>
          <span>Message</span>
          <span>Author</span>
          <span className={s.right}>Evals</span>
          <span className={s.right}>Duration</span>
          <span className={s.right}>Env</span>
          <span className={s.right}>Status</span>
        </div>
        {COMMITS.map((c) => (
          <div className={s.commitGroup} key={c.sha} data-commit="" data-open={c.open ? "1" : undefined}>
            <div className={s.commitRow} data-tone={c.tone} data-open={c.open ? "1" : undefined}>
              <span className={s.sha}>
                <Icon n="chevronD" cls={c.open ? s.chevSm : `${s.chevSm} ${s.chevClosed}`} />
                {c.sha}
              </span>
              <span className={s.msg}>{c.msg}</span>
              <span className={s.who}>{c.who}</span>
              <span className={`${s.num} ${s.right}`}>{c.evals}</span>
              <span className={`${s.num} ${s.right}`}>{c.dur}</span>
              <span className={`${s.who} ${s.right}`}>{c.env}</span>
              <span className={`${s.verdict} ${s.right}`}>{c.verdict}</span>
            </div>
            {c.open && (
              <div className={s.evalPanel} data-evalpanel="">
                <div className={s.evalHead}>
                  <Icon n="alert" />
                  Evaluation gate · 2 of 20 checks failed
                </div>
                <div className={s.evalGrid}>
                  {EVAL_CHECKS.map((e) => (
                    <div className={s.evalItem} key={e.name} data-ok={e.ok ? "1" : undefined}>
                      <span className={s.evalName}>{e.name}</span>
                      <span className={s.evalWant}>{e.want}</span>
                      <span className={s.evalGot}>{e.got}</span>
                    </div>
                  ))}
                </div>
                <div className={s.evalFoot}>
                  Blocked at 14:28:44 UTC · prod deploy not attempted
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ==================================================================
   ACT 04 — Guardrails
   ================================================================== */

function Redaction({ width }: { width: string }) {
  return (
    <span className={s.redact} data-redact="" style={{ width }}>
      <i />
    </span>
  );
}

function ActHold() {
  return (
    <>
      <ViewHead
        crumb={["Guardrails", "Outbound"]}
        title="run_8f2c7a"
        meta={
          <>
            dispute-resolver-v2.3 · CLM-2291-04 · 14:32:07 UTC
          </>
        }
        state={{ label: "HELD AT GATE", tone: "fail" }}
        actions={
          <>
            <Btn icon="lock" disabled>
              Release
            </Btn>
            <Btn primary>Request review</Btn>
          </>
        }
      />

      <div className={s.holdGrid}>
        <div className={s.sheetWrap}>
          <div className={s.sheetBar}>
            <span>Outbound draft</span>
            <span className={s.sheetBarR}>1 of 1 · read only</span>
          </div>
          <article className={s.sheet}>
            <div className={s.letterHead}>
              <span className={s.letterMark} />
              <span className={s.letterOrg}>NORTHBRIDGE MUTUAL</span>
              <span className={s.letterKind}>CLAIM DECISION</span>
            </div>
            <div className={s.letterRef}>
              <span className={s.refPip} />
              Ref CLM-2291-04 · 14 March 2026
            </div>
            <div className={s.letterBody}>
              <p>
                Dear <Redaction width="8.5em" />,
              </p>
              <p>
                We have completed our review of the claim submitted against
                policy <Redaction width="7em" />. Based on the treatment dates
                and the schedule of benefits in force on the date of loss, the
                claim qualifies for tier-2 cover with effect from 1 March 2026.
              </p>
              <p>Yours sincerely,</p>
              <p>Claims Triage · Northbridge Mutual</p>
            </div>
          </article>
        </div>

        <aside className={s.holdMeta}>
          <div className={s.holdCard}>
            <div className={s.holdTop}>
              <span className={s.inspectLabel}>Outbound check</span>
              <span className={s.verdictSwap}>
                <span className={s.vAllowed} data-allowed="">
                  ALLOWED
                </span>
                <span className={s.vHeld} data-held="">
                  HELD
                </span>
              </span>
            </div>
            <div className={s.holdNote} data-holdnote="">
              <Icon n="alert" />
              SSN detected in outbound draft
            </div>
            <div className={s.holdRule}>pii.ssn.block · policy v24</div>
          </div>

          <section className={s.panel}>
            <div className={s.panelHead}>
              <span className={s.panelTitle}>Policy checks</span>
              <span className={s.panelMeta}>6 run · 4.1ms</span>
            </div>
            <ul className={s.checkList}>
              {POLICY_CHECKS.map((p) => (
                <li className={s.checkRow} key={p.name} data-ok={p.ok ? "1" : undefined} data-check="">
                  <span className={s.checkIco}>
                    <Icon n={p.ok ? "check" : "alert"} />
                  </span>
                  <span className={s.checkName}>{p.name}</span>
                  <span className={s.checkVal}>{p.val}</span>
                </li>
              ))}
            </ul>
            <ol className={s.timeline}>
              {HOLD_TIMELINE.map((e) => (
                <li key={e.t} data-tone={e.tone}>
                  <span className={s.tlPip} />
                  <span className={s.tlTime}>{e.t}</span>
                  <span className={s.tlWhat}>{e.what}</span>
                </li>
              ))}
            </ol>
          </section>
        </aside>
      </div>
    </>
  );
}

/* ==================================================================
   ACT 05 — Audit
   ================================================================== */

function ActAnswer() {
  return (
    <>
      <ViewHead
        crumb={["Audit"]}
        title="Audit trail"
        meta="immutable · write-once · 7-year retention"
        state={{ label: "HASH-CHAIN VERIFIED", tone: "ok" }}
        actions={
          <>
            <Btn icon="clock">
              Last 24h <Icon n="chevronD" cls={s.chevSm} />
            </Btn>
            <Btn icon="download">Export</Btn>
          </>
        }
      />

      <div className={s.filterBar}>
        <span className={s.fchip}>
          agent<b>dispute-resolver-v2.3</b>
          <Icon n="x" cls={s.fx} />
        </span>
        <span className={s.fchip}>
          resource<b>northbridge-crm</b>
          <Icon n="x" cls={s.fx} />
        </span>
        <span className={s.fadd}>
          <Icon n="plus" />
          Add filter
        </span>
        <span className={s.filterCount}>1,284 events</span>
      </div>

      <div className={s.events}>
        <div className={s.eventRow} data-head="1">
          <span>Time (UTC)</span>
          <span>Actor</span>
          <span>Action</span>
          <span>Resource</span>
          <span className={s.right}>Policy</span>
          <span className={s.right}>Result</span>
        </div>
        {EVENTS.map((e) => (
          <div className={s.eventGroup} key={e.t} data-event="" data-open={e.open ? "1" : undefined}>
            <div className={s.eventRow} data-tone={e.tone} data-open={e.open ? "1" : undefined}>
              <span className={s.evTime}>{e.t}</span>
              <span className={s.evActor}>{e.actor}</span>
              <span className={s.evAction}>{e.action}</span>
              <span className={s.evRes}>{e.res}</span>
              <span className={`${s.evPol} ${s.right}`}>{e.pol}</span>
              <span className={`${s.evResult} ${s.right}`}>{e.result}</span>
            </div>
            {e.open && (
              <div className={s.record} data-record="">
                <dl className={s.recordGrid}>
                  {RECORD.map(([k, v]) => (
                    <div className={s.recordItem} key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className={s.recordSig}>
                  <Icon n="hash" />
                  signature verified · KMS us-east-1 · this record cannot be
                  edited or deleted
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={s.viewFoot}>
        <span>4 of 1,284 events</span>
        <span className={s.footOk}>
          <Icon n="check" />
          hash-chained · last verified 4s ago
        </span>
        <span>retained until 14 Mar 2033</span>
      </div>
    </>
  );
}

const BODIES: Record<ActId, React.ReactNode> = {
  describe: <ActDescribe />,
  register: <ActRegister />,
  gate: <ActGate />,
  hold: <ActHold />,
  answer: <ActAnswer />,
};

/* ==================================================================
   the application window
   ================================================================== */

function Sidebar({ active }: { active: number }) {
  return (
    <nav className={s.side} aria-label="Lyzr control plane">
      <div className={s.sideScroll}>
        {NAV_EXTRA_TOP.map((n) => (
          <span className={s.navItem} key={n.label} data-quiet="1">
            <Icon n={n.icon} />
            {n.label}
          </span>
        ))}

        <div className={s.navLabel}>Governance</div>
        {ACTS.map((a, i) => (
          <span
            className={s.navItem}
            key={a.id}
            data-on={i === active ? "1" : undefined}
            data-intercept={a.intercept ? "1" : undefined}
          >
            <Icon n={a.icon} />
            {a.rail}
            {a.badge && (
              <b className={s.navBadge} data-intercept={a.intercept ? "1" : undefined}>
                {a.badge}
              </b>
            )}
          </span>
        ))}

        <div className={s.navGap} />
        {NAV_EXTRA_BOTTOM.map((n) => (
          <span className={s.navItem} key={n.label} data-quiet="1">
            <Icon n={n.icon} />
            {n.label}
          </span>
        ))}
      </div>

      <div className={s.account}>
        <Avatar initials="PR" />
        <span className={s.accountText}>
          <b>priya.raman</b>
          <i>Platform · admin</i>
        </span>
      </div>
    </nav>
  );
}

function Window({ active, children }: { active: number; children: React.ReactNode }) {
  return (
    <div className={s.frameWrap} data-squircle="">
      <div className={s.frame}>
        <div className={s.titlebar}>
          <span className={s.lights} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className={s.wordmark}>Lyzr</span>
          <span className={s.orgChip}>
            <span className={s.orgMark} />
            Northbridge Mutual
            <Icon n="chevronD" cls={s.chevSm} />
          </span>
          <span className={s.envPill}>prod</span>
          <span className={s.titleSpacer} />
          <SearchField placeholder="Search agents, runs, policies" />
          <span className={s.titleAvatar}>
            <Avatar initials="PR" size="sm" />
          </span>
        </div>
        <div className={s.body}>
          <Sidebar active={active} />
          <div className={s.canvas}>{children}</div>
        </div>
      </div>
    </div>
  );
}

/* Subscribing to a media query is exactly what useSyncExternalStore is for.
   The server snapshot reports "reduced", so SSR emits the static five-block
   markup and hydration matches; the client snapshot then takes over. This
   also means a viewer who flips the OS setting mid-session is respected
   without a reload. */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => true
  );
}

const TITLE = (
  <>
    One control plane for every agent.
    <br />
    <span>Wherever it was built. Whoever built it.</span>
  </>
);

/* ---------- main ---------- */

export default function AgentLifecycle() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);
  const animated = !usePrefersReducedMotion();

  useEffect(() => {
    if (!animated) return;

    let mm: ReturnType<typeof gsap.matchMedia> | null = null;
    let cancelled = false;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const root = rootRef.current;
      const track = trackRef.current;
      if (!root || !track) return;

      mm = gsap.matchMedia();
      mm.add("(min-width: 769px)", () => {
        const acts = gsap.utils.toArray<HTMLElement>(`.${s.act}`);
        const caps = gsap.utils.toArray<HTMLElement>(`.${s.captionItem}`);
        const prog = progRef.current;

        // every act starts hidden except the first
        gsap.set(acts.slice(1), { autoAlpha: 0, y: 14 });
        gsap.set(caps.slice(1), { autoAlpha: 0 });
        gsap.set(acts[0], { autoAlpha: 1, y: 0 });

        /* The sidebar reads whichever act is actually most opaque rather
           than a guess derived from scroll progress. Acts occupy uneven
           slices of the timeline (act 01 types a sentence, act 04 holds
           on the redaction), so progress-based indexing drifted a whole
           act in both directions. Reading GSAP's own inline opacity is
           exact by construction and forces no layout.

           This has to hang off the TIMELINE's onUpdate, not the
           ScrollTrigger's. ScrollTrigger fires only while the scroll
           position changes, but `scrub` keeps easing the playhead for
           another 0.6s after the wheel stops — so a trigger-driven read
           samples the opacities mid-transition and freezes there, which
           left the sidebar highlighting Registry while Pipeline was on
           screen. */
        let lastActive = -1;
        const syncActive = () => {
          let best = 0;
          let bestOpacity = -1;
          for (let k = 0; k < acts.length; k++) {
            const o = parseFloat(acts[k].style.opacity || "0");
            if (o > bestOpacity) {
              bestOpacity = o;
              best = k;
            }
          }
          if (best !== lastActive) {
            lastActive = best;
            setActive(best);
          }
        };

        const tl = gsap.timeline({
          onUpdate: syncActive,
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // scroll-driven, so the progress rule belongs here
            onUpdate: (self) => {
              if (prog) prog.style.transform = `scaleX(${self.progress})`;
            },
          },
        });

        // ---- act 01: type the prompt, then resolve the integrations
        const typed = root.querySelector<HTMLElement>("[data-typed]");
        if (typed) {
          const full = typed.textContent || "";
          const state = { n: 0 };
          typed.textContent = "";
          tl.to(state, {
            n: full.length,
            duration: 1.6,
            ease: "none",
            onUpdate: () => {
              typed.textContent = full.slice(0, Math.round(state.n));
            },
          });
        }
        tl.from(
          root.querySelectorAll("[data-cap]"),
          { autoAlpha: 0, y: 8, stagger: 0.18, duration: 0.5 },
          ">-0.2"
        );
        tl.to({}, { duration: 0.9 });

        // ---- transition to act 02
        tl.to(acts[0], { autoAlpha: 0, y: -14, duration: 0.55 });
        tl.to(caps[0], { autoAlpha: 0, duration: 0.35 }, "<");
        tl.to(acts[1], { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.15");
        tl.to(caps[1], { autoAlpha: 1, duration: 0.4 }, "<");
        tl.from(
          root.querySelectorAll("[data-row]"),
          { autoAlpha: 0, y: 10, stagger: 0.11, duration: 0.45 },
          "<0.1"
        );
        tl.to({}, { duration: 1 });

        // ---- transition to act 03, stages fill, the gate fails
        tl.to(acts[1], { autoAlpha: 0, y: -14, duration: 0.55 });
        tl.to(caps[1], { autoAlpha: 0, duration: 0.35 }, "<");
        tl.to(acts[2], { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.15");
        tl.to(caps[2], { autoAlpha: 1, duration: 0.4 }, "<");
        tl.fromTo(
          root.querySelectorAll(`[data-stage]:not([data-tone="idle"]) .${s.stageBar} i`),
          { width: "0%" },
          { width: "100%", stagger: 0.2, duration: 0.36, ease: "none" },
          "<0.1"
        );
        tl.from(
          root.querySelectorAll("[data-commit]"),
          { autoAlpha: 0, x: -8, stagger: 0.12, duration: 0.4 },
          ">-0.35"
        );
        tl.from(
          root.querySelector("[data-evalpanel]"),
          { autoAlpha: 0, y: -6, duration: 0.4 },
          ">-0.2"
        );
        tl.to({}, { duration: 1 });

        // ---- transition to act 04, the redaction lands
        tl.to(acts[2], { autoAlpha: 0, y: -14, duration: 0.55 });
        tl.to(caps[2], { autoAlpha: 0, duration: 0.35 }, "<");
        tl.to(acts[3], { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.15");
        tl.to(caps[3], { autoAlpha: 1, duration: 0.4 }, "<");
        tl.from(
          root.querySelectorAll("[data-check]"),
          { autoAlpha: 0, x: 8, stagger: 0.07, duration: 0.34 },
          "<0.1"
        );
        tl.to({}, { duration: 0.4 });
        tl.to(root.querySelectorAll("[data-redact] i"), {
          scaleX: 1,
          duration: 0.42,
          stagger: 0.3,
          ease: "power2.inOut",
        });
        tl.to(root.querySelector("[data-allowed]"), { autoAlpha: 0, duration: 0.25 }, ">-0.1");
        tl.to(root.querySelector("[data-held]"), { autoAlpha: 1, duration: 0.25 }, "<");
        tl.from(root.querySelector("[data-holdnote]"), { autoAlpha: 0, x: -6, duration: 0.4 }, "<");
        tl.to({}, { duration: 1.1 });

        // ---- transition to act 05
        tl.to(acts[3], { autoAlpha: 0, y: -14, duration: 0.55 });
        tl.to(caps[3], { autoAlpha: 0, duration: 0.35 }, "<");
        tl.to(acts[4], { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.15");
        tl.to(caps[4], { autoAlpha: 1, duration: 0.4 }, "<");
        tl.from(
          root.querySelectorAll("[data-event]"),
          { autoAlpha: 0, y: 8, stagger: 0.1, duration: 0.4 },
          "<0.1"
        );
        tl.from(
          root.querySelector("[data-record]"),
          { autoAlpha: 0, duration: 0.45 },
          ">-0.15"
        );
        tl.to({}, { duration: 1.2 });
      });
    })();

    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, [animated]);

  /* Static path — reduced motion, or JS that never arrived.
     Five acts become five readable windows. Nothing is hidden behind
     an animation that may never fire. */
  if (!animated) {
    return (
      <section className={s.root} ref={rootRef as React.RefObject<HTMLElement>}>
        <div className={s.staticList}>
          <h2 className={s.title}>{TITLE}</h2>
          {ACTS.map((act, i) => (
            <div className={s.staticItem} key={act.id}>
              <Window active={i}>
                <div className={s.act} data-act={i} data-live="1">
                  {BODIES[act.id]}
                </div>
              </Window>
              <p className={s.captionItem} data-act={i}>
                {act.caption}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={s.root}
      ref={rootRef as React.RefObject<HTMLElement>}
      data-js="1"
    >
      <div
        className={s.track}
        ref={trackRef}
        style={{ minHeight: `${ACTS.length * 95}svh` }}
      >
        <div className={s.stage}>
          <div className={s.head}>
            <h2 className={s.title}>{TITLE}</h2>
            <span className={s.progress} aria-hidden="true">
              <i ref={progRef as React.RefObject<HTMLElement>} />
            </span>
          </div>

          <Window active={active}>
            {ACTS.map((a, i) => (
              <div
                className={s.act}
                key={a.id}
                data-act={i}
                data-live={i === active ? "1" : undefined}
                aria-hidden={i === active ? undefined : true}
              >
                {BODIES[a.id]}
              </div>
            ))}
          </Window>

          <div className={s.caption}>
            {ACTS.map((a, i) => (
              <p className={s.captionItem} key={a.id} data-act={i}>
                {a.caption}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
