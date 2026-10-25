#!/usr/bin/env node
// Checks the shape of an IDEA.md record and works out whether the idea stands.
// It never judges whether the idea is true or good. Exit 1 on any failure.
// Usage: node lint.mjs IDEA.md [--json]
import { readFileSync } from "node:fs";
import { parseRecord, STATUSES, TESTABLE, RESPONSES } from "./parse.mjs";

const ids = (ns) => ns.map((n) => `C${n.id}`).join(", ");

export function lint(text) {
  const r = parseRecord(text);
  const fails = [];
  const warns = [];
  const notes = [];
  const has = (k) => r.sections[k] && !r.sections[k].empty;
  const st = r.front.status;
  const testable = (r.front.testable || "").toLowerCase();
  const tree = r.criticism;

  if (!r.front.title) fails.push("no `title`");
  if (!STATUSES.includes(st)) fails.push(`status must be one of ${STATUSES.join(", ")}`);
  if (!TESTABLE.includes(testable))
    fails.push("`testable` must be yes, partly or no: can any part of this idea be checked against what actually happens?");
  if (!has("problem")) fails.push("## Problem is empty: what clash does this idea resolve?");

  if (st && st !== "draft") {
    if (!has("idea")) fails.push("## Idea is empty");
    if (!r.alternatives.length) fails.push("no alternatives: an idea is only as good as the alternative it beats");
    if (!r.refuters.length) fails.push("nothing under \"What would show it wrong\": an idea nothing could show wrong isn't saying anything");
    if (!r.parts.length) warns.push("\"Why it has to be this way\" is empty: which parts are doing the work?");
  }

  if (r.test && r.test.present) {
    if (!r.test.ideaPredicts || !r.test.altPredicts)
      warns.push("the test should say what the idea predicts and what the alternative predicts, before it's run");
  } else if ((testable === "yes" || testable === "partly") && st !== "draft") {
    warns.push("this idea is testable but has no ## Test: what's the cheapest check that would tell it from the alternative?");
  }

  // Criticism
  for (const e of tree.errors) fails.push(e);
  for (const n of tree.nodes) {
    const tag = `C${n.id}`;
    if (!n.text) fails.push(`${tag} has no **Criticism:** text`);
    if (n.depth > 1 && n.response)
      fails.push(`${tag} is a counter, so it can't have a Response; only the idea gets revised`);
    if (n.depth === 1 && n.response && !RESPONSES.includes(n.response))
      fails.push(`${tag}: Response "${n.response}" isn't revised or conceded. To reject a criticism, write a counter as C${n.id}.1 saying why it misses`);
    if (n.response === "revised" && !n.rulesOut)
      fails.push(`${tag} was revised but doesn't say what the idea now rules out: a fix that rules nothing new out is an excuse`);
  }
  const roots = tree.roots;
  if (roots.length) {
    notes.push(tree.open.length
      ? `open: ${ids(tree.open)}`
      : `stands: all ${roots.length} criticism${roots.length === 1 ? "" : "s"} answered`);
  }

  const conceded = roots.filter((n) => n.response === "conceded" && n.open);
  if (st === "criticised" && !roots.length) fails.push("status criticised, but no criticism is recorded");
  if (st === "standing") {
    if (!roots.length) fails.push("status standing, but nothing has criticised it yet");
    else if (tree.open.length) fails.push(`status standing, but ${ids(tree.open)} ${tree.open.length === 1 ? "is" : "are"} open: answer ${tree.open.length === 1 ? "it" : "them"} or set status: criticised`);
    if (!has("unknown")) warns.push("\"Still unknown\" is empty: something always is");
  }
  if (st === "refuted" && !conceded.length) fails.push("status refuted, but no criticism is conceded");
  if (conceded.length && st !== "refuted") warns.push(`${ids(conceded)} conceded: the idea as stated is refuted; restate it or set status: refuted`);
  if (st === "criticised" && roots.length && !tree.open.length) warns.push("nothing is open: this could be status: standing");

  return { ok: fails.length === 0, fails, warns, notes, front: r.front, stands: tree.stands, open: tree.open.map((n) => `C${n.id}`) };
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith("--")) || "IDEA.md";
  let text;
  try { text = readFileSync(file, "utf8"); } catch { console.error(`can't read ${file}`); process.exit(2); }
  const res = lint(text);
  if (args.includes("--json")) { console.log(JSON.stringify(res, null, 2)); process.exit(res.ok ? 0 : 1); }
  console.log(`${res.front.title || file} [${res.front.status || "?"}, testable: ${res.front.testable || "?"}]`);
  for (const n of res.notes) console.log(`  ${n}`);
  for (const w of res.warns) console.log(`  warn  ${w}`);
  for (const f of res.fails) console.log(`  FAIL  ${f}`);
  console.log(res.ok ? `pass${res.warns.length ? ` (${res.warns.length} warning${res.warns.length === 1 ? "" : "s"})` : ""}` : `fail (${res.fails.length})`);
  process.exit(res.ok ? 0 : 1);
}
