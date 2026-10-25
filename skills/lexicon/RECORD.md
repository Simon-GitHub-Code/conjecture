# The idea record

An idea lives in one file, `IDEA.md`, in the folder you are working in. Every skill reads it and writes to it; `share` checks it and turns it into a page. The agent writes the file. You read it, and you make the calls.

## Template

```md
---
title: <the idea in one line>
status: draft | criticised | standing | refuted
testable: yes | partly | no
author: <name>
created: YYYY-MM-DD
---

## Problem

<What was expected, what happened instead, and why that matters. Two or three sentences.>

## Idea

<The idea as it stands now. Kept up to date as criticism changes it.>

## Why it has to be this way

- <part> — <what breaks if you swap it for something generic>

## Alternatives

- **<name>** — <the alternative at its strongest>. Falls short because <...>.

## What would show it wrong

- <something you could check or construct that would show the idea wrong>

## Test

- Setup: <the cheapest situation where the idea and the alternative disagree>
- Idea predicts: <...>
- Alternative predicts: <...>
- Result: pending

## Criticism

### C1 <short title>

- **Criticism:** <one claim, with its evidence>
- **Response:** revised | conceded
- **Now rules out:** <required when revised: what the revised idea forbids that it didn't before>

### C1.1 <short title>

- **Criticism:** <a counter: why C1 misses>

## Still unknown

- <what we still don't know even if the idea is right>

## Next questions

- <the problems this idea raises>
```

## How a criticism is answered

A criticism is **open** until either the idea is revised to meet it (`Response: revised`) or a counter is written beneath it (`### C1.1`). A counter can be criticised too (`### C1.1.1`), which reopens the original. The idea **stands** when nothing is open. `Response: conceded` means the criticism is accepted and the idea, as stated, is refuted.

There is no "withstood" button. Rejecting a criticism means writing down why.

## What the check enforces

`node skills/share/scripts/lint.mjs IDEA.md` fails the record when:

- `title` or `testable` is missing, or `## Problem` or `## Idea` is empty.
- (past draft) there is no alternative, or nothing under "What would show it wrong".
- a criticism has no text, a counter claims a Response, or a counter's parent doesn't exist.
- a revision doesn't say what it now rules out.
- `status: standing` while any criticism is open, or with no criticism at all.
- `status: refuted` with no conceded criticism.

It warns (and passes) when a testable idea has no test, when a test is missing either prediction, or when "Why it has to be this way" or "Still unknown" is empty. The check looks at the shape of the idea, never at whether it is true.
