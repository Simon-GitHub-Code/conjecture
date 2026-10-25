// node --test
import { test } from "node:test";
import assert from "node:assert/strict";
import { lint } from "./lint.mjs";
import { parseRecord } from "./parse.mjs";

const base = ({ status = "criticised", testable = "no" } = {}) => `---
title: T
status: ${status}
testable: ${testable}
---

## Problem

Expected A, got B.

## Idea

Because C.

## Why it has to be this way

- C — without it B is unexplained

## Alternatives

- **D** — the usual answer. Falls short because it predicts A.

## What would show it wrong

- a case where C holds and B doesn't
`;
const c = (id, extra = "") => `\n### C${id} t\n\n- **Criticism:** about ${id}\n${extra}`;
const crit = (...nodes) => `\n## Criticism\n${nodes.join("")}`;
const tree = (text) => parseRecord(text).criticism;
const fails = (r) => r.fails.join(" | ");

test("a well-shaped record passes", () => {
  const r = lint(base() + crit(c("1")));
  assert.equal(r.ok, true, fails(r));
});

test("a draft needs only a problem and a testable flag", () => {
  const r = lint("---\ntitle: T\nstatus: draft\ntestable: partly\n---\n\n## Problem\n\nExpected A, got B.\n");
  assert.equal(r.ok, true, fails(r));
});

test("testable must be declared", () => {
  assert.match(fails(lint(base().replace("testable: no\n", ""))), /testable/);
});

test("no alternative fails", () => {
  const r = lint(base().replace(/- \*\*D\*\*.*\n/, ""));
  assert.match(fails(r), /alternative/);
});

test("nothing that would show it wrong fails", () => {
  const r = lint(base().replace("- a case where C holds and B doesn't\n", ""));
  assert.match(fails(r), /show it wrong/);
});

test("a testable idea with no test warns but passes", () => {
  const r = lint(base({ testable: "yes" }) + crit(c("1")));
  assert.equal(r.ok, true, fails(r));
  assert.match(r.warns.join(" "), /no ## Test/);
});

test("an untestable idea needs no test", () => {
  const r = lint(base({ testable: "no" }) + crit(c("1")));
  assert.doesNotMatch(r.warns.join(" "), /Test/);
});

test("an unanswered criticism is open", () => {
  assert.deepEqual(tree(base() + crit(c("1"))).open.map((n) => n.id), ["1"]);
});

test("a counter answers its parent", () => {
  assert.equal(tree(base() + crit(c("1"), c("1.1"))).stands, true);
});

test("criticising the counter reopens the original", () => {
  const t = tree(base() + crit(c("1"), c("1.1"), c("1.1.1")));
  assert.equal(t.byId["1"].open, true);
});

test("one standing counter is enough", () => {
  assert.equal(tree(base() + crit(c("1"), c("1.1"), c("1.1.1"), c("1.2"))).byId["1"].open, false);
});

test("a revision answers the criticism", () => {
  assert.equal(tree(base() + crit(c("1", "- **Response:** revised\n- **Now rules out:** z\n"))).stands, true);
});

test("a revision that rules nothing new out fails", () => {
  assert.match(fails(lint(base() + crit(c("1", "- **Response:** revised\n")))), /excuse/);
});

test("there is no withstood: rejecting needs a counter", () => {
  assert.match(fails(lint(base() + crit(c("1", "- **Response:** withstood\n")))), /write a counter/);
});

test("a counter can't be revised", () => {
  assert.match(fails(lint(base() + crit(c("1"), c("1.1", "- **Response:** revised\n- **Now rules out:** z\n")))), /only the idea gets revised/);
});

test("a counter to nothing fails", () => {
  assert.match(fails(lint(base() + crit(c("2.1")))), /doesn't exist/);
});

const standing = (...nodes) => base({ status: "standing" }) + crit(...nodes) + "\n## Still unknown\n\n- whether E\n";

test("standing with an open criticism fails", () => {
  assert.match(fails(lint(standing(c("1"), c("2"), c("2.1")))), /C1 is open/);
});

test("standing with everything answered passes", () => {
  const r = lint(standing(c("1"), c("1.1"), c("2", "- **Response:** revised\n- **Now rules out:** z\n")));
  assert.equal(r.ok, true, fails(r));
  assert.equal(r.stands, true);
});

test("standing with no criticism fails", () => {
  assert.match(fails(lint(base({ status: "standing" }))), /nothing has criticised it/);
});

test("refuted needs a conceded criticism", () => {
  assert.match(fails(lint(base({ status: "refuted" }) + crit(c("1"), c("1.1")))), /conceded/);
  const r = lint(base({ status: "refuted" }) + crit(c("1", "- **Response:** conceded\n")));
  assert.equal(r.ok, true, fails(r));
});
