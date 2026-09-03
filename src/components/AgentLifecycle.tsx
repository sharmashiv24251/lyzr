"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import s from "./AgentLifecycle.module.css";

/* ------------------------------------------------------------------
   One agent, described to audited. Scroll is time.

   The frame never moves; only its contents change. Five acts:
   describe → register → gate → hold → answer.

   Act 03 fails an evaluation gate and act 04 intercepts PII on the way
   out. Those are the only two acts allowed to use terracotta.
   ------------------------------------------------------------------ */

type ActId = "describe" | "register" | "gate" | "hold" | "answer";

interface Act {
  id: ActId;
  rail: string;
  crumb: string;
  state: string;
  intercept: boolean;
  caption: React.ReactNode;
}

const ACTS: Act[] = [
  {
    id: "describe",
    rail: "Describe",
    crumb: "app.lyzr.ai / architect",
    state: "DRAFTING",
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
    rail: "Register",
    crumb: "app.lyzr.ai / registry",
    state: "REGISTERED",
    intercept: false,
    caption: (
      <>
        Every agent your organisation runs, whoever built it and wherever it
        runs. <b>Registration is a gate, not a request</b> — an unregistered
        agent cannot deploy.
      </>
    ),
  },
  {
    id: "gate",
    rail: "Gate",
    crumb: "app.lyzr.ai / pipeline",
    state: "EVAL FAILED",
    intercept: true,
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
    rail: "Hold",
    crumb: "app.lyzr.ai / guardrails",
    state: "HELD AT GATE",
    intercept: true,
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
    rail: "Answer",
    crumb: "app.lyzr.ai / audit",
    state: "ANSWERABLE",
    intercept: false,
    caption: (
      <>
        This is the whole product. When someone asks what your agents did,{" "}
        <b>you have an answer with a name, a timestamp and a policy version on
        it</b> — not a shrug.
      </>
    ),
  },
];

/* ------------------------------------------------------------------
   Provider marks — real vendor SVGs, in their own colours.

   These are the only place colour is allowed to enter a product surface
   (PRODUCT.md principle 3), and they are what makes the claim "wherever
   it was built, whoever built it" land: you recognise the stack before
   you read the row.
   ------------------------------------------------------------------ */
function ProviderMark({ src, label }: { src: string; label: string }) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img className={s.mark} src={src} alt="" aria-hidden="true" width={16} height={16} data-mark={label} />
  );
}

const AGENTS = [
  { name: "Claims Triage", on: "bedrock", logo: "/assets/logos/bedrock.svg", runs: "18,402", state: "LIVE", tone: "ok" },
  { name: "KYC Reviewer", on: "azure ai", logo: "/assets/logos/azure.svg", runs: "6,110", state: "LIVE", tone: "ok" },
  { name: "Collections Desk", on: "langchain", logo: "/assets/logos/langchain.svg", runs: "2,988", state: "LIVE", tone: "ok" },
  { name: "Renewals Analyst", on: "vertex", logo: "/assets/logos/vertex.svg", runs: "941", state: "STAGED", tone: "idle" },
  { name: "Vendor Diligence", on: "agentforce", logo: "/assets/logos/agentforce.svg", runs: "—", state: "SYNCED", tone: "idle" },
];

const STAGES = [
  { name: "Git push", state: "passed", tone: "pass" },
  { name: "Code scan", state: "passed", tone: "pass" },
  { name: "Build image", state: "passed", tone: "pass" },
  { name: "Non-prod", state: "passed", tone: "pass" },
  { name: "Evaluation gate", state: "failed", tone: "fail" },
  { name: "Approval", state: "blocked", tone: "idle" },
  { name: "Prod deploy", state: "blocked", tone: "idle" },
];

const COMMITS = [
  { sha: "a71a73d", msg: "Improve grounding on edge cases", who: "@priya", when: "4m ago", verdict: "evaluating", tone: "idle" },
  { sha: "608472f", msg: "Update RAI policy config", who: "@arjun", when: "2d ago", verdict: "prod", tone: "idle" },
  { sha: "3bc91e2", msg: "Add hallucination threshold adjustment", who: "@mei", when: "5d ago", verdict: "prod", tone: "idle" },
  { sha: "d4f12a9", msg: "Refund logic fix, failed eval gate", who: "@priya", when: "8d ago", verdict: "rolled back", tone: "fail" },
];

const MODELS = [
  { label: "openai", logo: "/assets/logos/openai.svg" },
  { label: "anthropic", logo: "/assets/logos/anthropic.svg" },
  { label: "gemini", logo: "/assets/logos/vertex.svg" },
  { label: "nvidia", logo: "/assets/logos/nvidia.svg" },
];

const PROMPT = "Triage inbound claims, check policy, draft the decision letter.";

/* ---------- act bodies ---------- */

function ActDescribe() {
  return (
    <div className={s.architect}>
      <div className={s.promptBar}>
        <span className={s.promptDot} />
        <span className={s.promptText}>
          <span data-typed="">{PROMPT}</span>
          <span className={s.caret} data-caret="" />
        </span>
        <span className={s.buildBtn}>Build</span>
      </div>

      <div className={s.wired}>
        <div className={s.wiredHead}>Wired into what you already run</div>
        <div className={s.chips}>
          {["SharePoint", "SAP", "Okta RBAC", "Audit log"].map((c) => (
            <span className={s.chip} key={c} data-chip="">
              <span className={s.chipTick}>✓</span>
              {c}
            </span>
          ))}
        </div>
        <dl className={s.specRows}>
          <div className={s.specRow}>
            <dt>Runs in</dt>
            <dd>your vpc · us-east-1</dd>
          </div>
          <div className={s.specRow}>
            <dt>Model</dt>
            <dd className={s.modelDd}>
              <span className={s.modelMarks}>
                {MODELS.map((m) => (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img key={m.label} className={s.mark} src={m.logo} alt="" aria-hidden="true" width={16} height={16} />
                ))}
              </span>
              swappable
            </dd>
          </div>
          <div className={s.specRow}>
            <dt>Migration</dt>
            <dd>none required</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function ActRegister() {
  return (
    <>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th scope="col">Agent</th>
              <th scope="col">Built on</th>
              <th scope="col" style={{ textAlign: "right" }}>Runs / day</th>
              <th scope="col" style={{ textAlign: "right" }}>State</th>
            </tr>
          </thead>
          <tbody>
            {AGENTS.map((a) => (
              <tr key={a.name} data-row="">
                <td className={s.agentName}>{a.name}</td>
                <td>
                  <span className={s.builtOn}>
                    <ProviderMark src={a.logo} label={a.on} />
                    {a.on}
                  </span>
                </td>
                <td className={s.num}>{a.runs}</td>
                <td style={{ textAlign: "right" }}>
                  <span className={s.pill} data-tone={a.tone}>{a.state}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={s.tableFoot}>
        <span>17 in production · 5 shown</span>
        <span>none rewritten · none migrated</span>
      </div>
    </>
  );
}

function ActGate() {
  return (
    <>
      <div className={s.pipe}>
        {STAGES.map((st) => (
          <div className={s.stageBox} key={st.name} data-tone={st.tone} data-stage="">
            <span className={s.stageName}>{st.name}</span>
            <span className={s.stageBar}>
              <i />
            </span>
            <span className={s.stageState}>{st.state}</span>
          </div>
        ))}
      </div>
      <div className={s.commits}>
        <div className={s.commitRow} data-head="1">
          <span>Commit</span>
          <span>Message</span>
          <span>Deployed by</span>
          <span>When</span>
          <span className={s.verdict}>Status</span>
        </div>
        {COMMITS.map((c) => (
          <div className={s.commitRow} key={c.sha} data-tone={c.tone} data-commit="">
            <span className={s.sha}>{c.sha}</span>
            <span className={s.msg}>{c.msg}</span>
            <span className={s.who}>{c.who}</span>
            <span className={s.when}>{c.when}</span>
            <span className={s.verdict}>{c.verdict}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function Redaction({ width }: { width: string }) {
  return (
    <span className={s.redact} data-redact="" style={{ width }}>
      <i />
    </span>
  );
}

function ActHold() {
  return (
    <div className={s.holdGrid}>
      <div className={s.letter}>
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
            We have completed our review of the claim submitted against policy{" "}
            <Redaction width="7em" />. Based on the treatment dates and the
            schedule of benefits in force on the date of loss, the claim
            qualifies for tier-2 cover with effect from 1 March 2026.
          </p>
          <p>Yours sincerely,</p>
          <p>Claims Triage · Northbridge Mutual</p>
        </div>
      </div>

      <div className={s.holdMeta}>
        <div className={s.holdCard} data-tone="hold">
          <div className={s.holdLabel}>Outbound · run 4c11</div>
          <div className={s.holdRun}>
            run_8f2c7a{" "}
            <span className={s.verdictSwap}>
              <span className={s.vAllowed} data-allowed="">ALLOWED</span>
              <span className={s.vHeld} data-held="">HELD</span>
            </span>
          </div>
          <div className={s.holdNote} data-holdnote="">SSN in outbound draft</div>
        </div>
        <div className={s.holdCard}>
          <div className={s.scoreRows}>
            <div className={s.scoreRow}>
              <span>PII redacted</span>
              <b data-tone="hold">2 spans</b>
            </div>
            <div className={s.scoreRow}>
              <span>Grounding score</span>
              <b>0.96</b>
            </div>
            <div className={s.scoreRow}>
              <span>Unsupported claims</span>
              <b data-tone="hold">1 held</b>
            </div>
            <div className={s.scoreRow}>
              <span>Policy version</span>
              <b>v24</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActAnswer() {
  return (
    <div className={s.answer}>
      <div className={s.answerRow}>
        <span className={s.answerTag}>Without</span>
        <p className={s.answerBefore}>
          &ldquo;Something accessed our CRM at 2pm.&rdquo;
        </p>
      </div>
      <div className={s.answerRule} />
      <div className={s.answerRow}>
        <span className={s.answerTag}>With Lyzr</span>
        <p className={s.answerAfter}>
          dispute-resolver-v2.3 · owned by priya.raman@northbridge.com ·
          accessed northbridge-crm at 14:32:07 UTC · policy v24 ·{" "}
          <em>1 span redacted</em> · immutable
        </p>
      </div>
    </div>
  );
}

const BODIES: Record<ActId, React.ReactNode> = {
  describe: <ActDescribe />,
  register: <ActRegister />,
  gate: <ActGate />,
  hold: <ActHold />,
  answer: <ActAnswer />,
};

/* ---------- shared chrome ---------- */

function Frame({
  act,
  children,
  actIndex,
}: {
  act: Act;
  children: React.ReactNode;
  actIndex: number;
}) {
  return (
    <div className={s.frameWrap}>
      <div className={s.frame}>
        <div className={s.chrome}>
          <span className={s.lights}>
            <i />
            <i />
            <i />
          </span>
          <span className={s.crumb} data-crumb="">
            {act.crumb}
          </span>
          <span className={s.state} data-intercept={act.intercept ? "1" : undefined}>
            <span className={s.statePip} />
            {act.state}
          </span>
        </div>
        <div className={s.acts}>
          <div className={s.act} data-act={actIndex} data-live="1">
            {children}
          </div>
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

/* ---------- main ---------- */

export default function AgentLifecycle() {
  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const animated = !usePrefersReducedMotion();

  useEffect(() => {
    if (!animated) return;

    let ctx: { revert: () => void } | null = null;
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

      ctx = gsap.context(() => {
        const acts = gsap.utils.toArray<HTMLElement>(`.${s.act}`);
        const caps = gsap.utils.toArray<HTMLElement>(`.${s.captionItem}`);

        // every act starts hidden except the first
        gsap.set(acts.slice(1), { autoAlpha: 0, y: 14 });
        gsap.set(caps.slice(1), { autoAlpha: 0 });
        gsap.set(acts[0], { autoAlpha: 1, y: 0 });


        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            /* The rail reads whichever act is actually most opaque rather
               than a guess derived from scroll progress. Acts occupy uneven
               slices of the timeline (act 01 types a sentence, act 04 holds
               on the redaction), so progress-based indexing drifted a whole
               act in both directions. Reading GSAP's own inline opacity is
               exact by construction and forces no layout. */
            onUpdate: () => {
              let best = 0;
              let bestOpacity = -1;
              for (let k = 0; k < acts.length; k++) {
                const o = parseFloat(acts[k].style.opacity || "0");
                if (o > bestOpacity) {
                  bestOpacity = o;
                  best = k;
                }
              }
              setActive(best);
            },
          },
        });

        // ---- act 01: type the prompt, then wire the chips
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
        tl.from(root.querySelectorAll("[data-chip]"), {
          autoAlpha: 0,
          y: 8,
          stagger: 0.18,
          duration: 0.5,
        }, ">-0.2");
        tl.to({}, { duration: 0.9 });

        // ---- transition to act 02
        tl.to(acts[0], { autoAlpha: 0, y: -14, duration: 0.55 });
        tl.to(caps[0], { autoAlpha: 0, duration: 0.35 }, "<");
        tl.to(acts[1], { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.15");
        tl.to(caps[1], { autoAlpha: 1, duration: 0.4 }, "<");
        tl.from(root.querySelectorAll("[data-row]"), {
          autoAlpha: 0,
          y: 10,
          stagger: 0.16,
          duration: 0.5,
        }, "<0.1");
        tl.to({}, { duration: 1 });

        // ---- transition to act 03, stages fill, the gate fails
        tl.to(acts[1], { autoAlpha: 0, y: -14, duration: 0.55 });
        tl.to(caps[1], { autoAlpha: 0, duration: 0.35 }, "<");
        tl.to(acts[2], { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.15");
        tl.to(caps[2], { autoAlpha: 1, duration: 0.4 }, "<");
        tl.fromTo(
          root.querySelectorAll(`.${s.stageBar} i`),
          { width: "0%" },
          { width: "100%", stagger: 0.22, duration: 0.4, ease: "none" },
          "<0.1"
        );
        tl.from(root.querySelectorAll("[data-commit]"), {
          autoAlpha: 0,
          x: -8,
          stagger: 0.12,
          duration: 0.4,
        }, ">-0.3");
        tl.to({}, { duration: 1 });

        // ---- transition to act 04, the redaction lands
        tl.to(acts[2], { autoAlpha: 0, y: -14, duration: 0.55 });
        tl.to(caps[2], { autoAlpha: 0, duration: 0.35 }, "<");
        tl.to(acts[3], { autoAlpha: 1, y: 0, duration: 0.55 }, "<0.15");
        tl.to(caps[3], { autoAlpha: 1, duration: 0.4 }, "<");
        tl.to({}, { duration: 0.5 });
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
        tl.to({}, { duration: 1.2 });
      }, root);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [animated]);

  /* Static path — reduced motion, or JS that never arrived.
     Five acts become five readable blocks. Nothing is hidden behind
     an animation that may never fire. */
  const staticView = (
    <div className={s.staticList}>
      {ACTS.map((act, i) => (
        <div className={s.staticItem} key={act.id}>
          <Frame act={act} actIndex={i}>
            {BODIES[act.id]}
          </Frame>
          <div className={s.caption}>
            <p className={s.captionItem} data-act={i}>
              {act.caption}
            </p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section
      id="platform"
      className={s.root}
      ref={rootRef as React.RefObject<HTMLElement>}
      data-js={animated ? "1" : undefined}
    >
      {!animated ? (
        <>
          <h2 className={s.title} style={{ maxWidth: "24em", marginBottom: "clamp(30px,3.4vw,50px)" }}>
            One control plane for every agent.
            <br />
            <span>Wherever it was built. Whoever built it.</span>
          </h2>
          {staticView}
        </>
      ) : (
        <div
          className={s.track}
          ref={trackRef}
          style={{ minHeight: `${ACTS.length * 95}svh` }}
        >
          <div className={s.stage}>
            <div className={s.head}>
              <h2 className={s.title}>
                One control plane for every agent.
                <br />
                <span>Wherever it was built. Whoever built it.</span>
              </h2>
              <div className={s.rail} role="list" aria-label="Agent lifecycle stages">
                {ACTS.map((a, i) => (
                  <span
                    className={s.railItem}
                    key={a.id}
                    role="listitem"
                    data-on={i === active ? "1" : undefined}
                    data-intercept={a.intercept ? "1" : undefined}
                  >
                    <span className={s.railDot} />
                    {a.rail}
                  </span>
                ))}
              </div>
            </div>

            <div className={s.frameWrap}>
              <div className={s.frame}>
                <div className={s.chrome}>
                  <span className={s.lights}>
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className={s.crumb}>{ACTS[active].crumb}</span>
                  <span
                    className={s.state}
                    data-intercept={ACTS[active].intercept ? "1" : undefined}
                  >
                    <span className={s.statePip} />
                    {ACTS[active].state}
                  </span>
                </div>
                <div className={s.acts}>
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
                </div>
              </div>
            </div>

            <div className={s.caption}>
              {ACTS.map((a, i) => (
                <p className={s.captionItem} key={a.id} data-act={i}>
                  {a.caption}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
