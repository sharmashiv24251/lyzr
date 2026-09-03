# Product

## Register

brand

## Users

Enterprise AI buyers at regulated companies — Head of AI, CIO/CTO, platform and
compliance leads at banks, insurers, telcos, healthcare and government. They
already have agents running, built by different teams on different stacks
(Bedrock, Azure AI, Vertex, LangChain, CrewAI, Agentforce, custom). Their
problem is not building another agent; it is that nobody can say who owns the
ones already in production, what they accessed, or who approved the last change.

They arrive skeptical, mid-evaluation, comparing three vendors. The job to be
done: decide within one scroll whether this is infrastructure serious enough to
put in front of a regulator.

## Product Purpose

A ground-up redesign of the lyzr.ai landing page. Lyzr sells the layer between a
working agent and a governed one — registry, identity, evaluation gate,
observability, guardrails, immutable audit — deployed inside the customer's own
cloud.

The strategic reframe driving this build: **Lyzr is not a dashboard product, it
is a paper-trail product.** What it actually sells is the ability to answer a
regulator. Their own strongest line makes this explicit — "Something accessed
our CRM at 2pm" versus "Agent dispute-resolver-v2.3, owned by X, accessed Y at
14:32." Every design decision serves that thesis.

Success: a visitor believes the product is real before they have read a single
claim, because the page is built out of artifacts they already recognise from
their own working day.

## Brand Personality

Accountable, precise, unbothered.

Speaks the way a good infrastructure engineer speaks in an incident review —
plainly, with exact numbers, without selling. Confidence is expressed through
specificity, never through adjectives: real commit hashes, real timestamps with
timezones, real per-run pricing to the cent. Dry wit is permitted; playfulness
is not. Nothing on the page should feel like it is trying to impress the reader.

Emotional goal: relief. The reader should feel that someone has finally taken
the boring, unglamorous, career-ending part of agent deployment seriously.

## Anti-references

**The current lyzr.ai site.** Concretely: an italic-serif closer on every single
heading; four typefaces fighting; a different background colour per section; a
stock mountain photograph behind a line chart; an unretouched product screenshot
with a nav dropdown hanging open; carousel cards cut mid-word behind opacity
masks; a stray purple badge in a palette containing no purple.

**The modal AI-infra landing page of 2026.** Dark-mode terminal aesthetic, glow
gradients, constellation/node-network hero, "space console" chrome, acid accent
on near-black. Avoiding this must not land in its inverse — a light neutral page
with big two-tone grotesk headings and a grid of grey cards containing invented
dashboards is the same reflex one tier deeper.

**Editorial-magazine costume.** Display serif plus italic plus ruled columns plus
lowercase tracked metadata. Not this brief.

**Any generated or approximated vendor logo.** A plausible-but-wrong AWS or Okta
mark is worse than no mark at all.

## Design Principles

**1. Borrowed reality over invented reality.**
Build the page out of objects the buyer already owns — a Bedrock console, a
GitHub-shaped pipeline, a Jira P1, a redacted claim letter, a real provider logo
grid. Recognition lands before comprehension does. Never invent an artifact
where a real one can be quoted; Lyzr's own site and product screens are the
source, not imagination.

**2. Terracotta means intervention. Nothing else.**
The accent is reserved for the moment a machine decision was intercepted: held,
redacted, rolled back, flagged at gate. Every other use is removed. A colour
that means one thing gives the page a grammar; a colour used decoratively gives
it a mood.

**3. Spend the entire decoration budget on the product.**
Page chrome stays quiet so the artifacts can be loud. Colour enters the page
only through real product surfaces and real vendor marks.

**4. Chain the details.**
One run, one customer, one claim reference, threaded through every artifact on
the page. The run id in the registry is the run id in the waterfall is the run
id in the audit line. Internal consistency is what separates a designed page
from an assembled one.

**5. One orchestrated moment, not motion everywhere.**
Exactly one pinned scroll sequence — the life of a single agent from described to
audited. Everywhere else gets in-view micro-motion at most. Two competing
scroll-jacks is worse than none.

**6. Vary the medium, not the palette.**
Rhythm comes from changing what a section *is* — a pinned sequence, a bare
comparison table, a document, a product photograph — never from changing the
background colour. Repeating one good device twelve times turns voice into tic.

## Accessibility & Inclusion

WCAG 2.1 AA. Body text ≥4.5:1, large text ≥3:1 — including the muted grey half
of every two-tone heading, which is the most likely failure on this page.

`prefers-reduced-motion` is a first-class path, not a fallback: the pinned
sequence resolves to its five states stacked as static sections, all content
present and readable. Content is never gated behind a scroll-triggered or
class-triggered reveal — the default state is visible, and JavaScript opts into
animating, so a no-JS or headless render still ships the full page.

Status is never carried by colour alone. `HELD`, `ALLOWED` and `rolled back`
each carry a text label, so the strike-out and hold beats survive both
monochrome rendering and red-green colour blindness.

The scroll sequence is keyboard-reachable and does not trap focus; it can be
skipped.
