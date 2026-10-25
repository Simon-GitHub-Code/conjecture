#!/usr/bin/env node
// Start a new IDEA.md. Usage: node new.mjs "the idea in one line" [--author "name"] [--out IDEA.md] [--force]
import { writeFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const title = args.find((a, i) => !a.startsWith("--") && (i === 0 || !args[i - 1].startsWith("--"))) || "Untitled idea";
const out = opt("--out") || "IDEA.md";
if (existsSync(out) && !args.includes("--force")) { console.error(`${out} exists; pass --force to overwrite`); process.exit(1); }

writeFileSync(out, `---
title: ${title}
status: draft
testable: partly
author: ${opt("--author") || ""}
created: ${new Date().toISOString().slice(0, 10)}
---

## Problem

<What was expected, what happened instead, and why that matters.>

## Idea

## Why it has to be this way

## Alternatives

## What would show it wrong

## Criticism

## Still unknown

## Next questions
`);
console.log(out);
