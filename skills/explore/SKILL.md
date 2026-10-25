---
name: explore
description: "Take an idea from first thought to something that has survived real criticism. Starts or resumes IDEA.md in this folder."
disable-model-invocation: true
argument-hint: "Your idea in a sentence (or nothing, to pick up where you left off)"
---

Call the Skill tool with "lexicon", and read its `RECORD.md`. `IDEA.md` in the current folder is the record. If it exists, say in one line where it stands and carry on from the next step. If not, create it with `node <share skill>/scripts/new.mjs "<the idea>"` (the `share` skill's folder).

Each step is a skill in this plugin; call it with the Skill tool. The person makes every decision. You do the legwork.

1. `problem` — until the person agrees the written problem is the one they care about.
2. `conjecture` — until the idea, its alternatives, and what would show it wrong are written down.
3. `criticise` — until at least two criticisms are recorded and the person has answered each one.
4. `test` — when the idea is testable, or has a worked example that would tell it apart from the alternative.
5. Run `node <share skill>/scripts/lint.mjs IDEA.md` and fix what it reports. Then offer the next move and wait: more criticism, `share` it with someone, `learn` something it turned up, or `explore` one of its next questions.

**Reply** at each stop: where the idea stands, in two or three sentences of plain English, and the one decision the person needs to make now.
