---
name: criticise
description: "Try to show an idea wrong, one criticism at a time, and record how each is answered. Use for 'criticise this', 'poke holes', 'stress test', 'what's wrong with this', 'devil's advocate', or when IDEA.md has an idea and no criticism."
---

Call the Skill tool with "lexicon" if it isn't already loaded. Read `IDEA.md`.

This step finds where the idea is wrong. Improving it comes after, and only if the person chooses to. The harder you try to break it, the more it's worth if it survives.

**Use a fresh critic.** Hand a subagent `## Problem`, `## Idea`, `## Why it has to be this way`, `## Alternatives`, `## What would show it wrong`, the lexicon, and the brief below, and nothing of how the idea was arrived at. A critic who has heard the reasoning tends to argue inside it. If you can, run two: one that goes looking at the world, one that works through cases.

The brief:

- Check each item under "What would show it wrong". For testable parts, look for whether the evidence already exists. For the rest, build the case and work it through to the end.
- Run the **swap** on each part. A part that swaps out with nothing else changing is a criticism.
- Argue for the strongest alternative. If the recorded one is weak, find a stronger one.
- Ask whether the idea solves the problem as written, or an easier one nearby.
- Picture it having failed for real, and say how.
- Write each criticism as one point, with its evidence, and say what would make it miss.

**Record and decide.** Add each criticism to `## Criticism` as its own `### C<n> <title>` with `- **Criticism:**`. Put them to the person, best first, and wait. For each one they choose:

- **Revise** the idea: update `## Idea`, set `- **Response:** revised` and `- **Now rules out:**` with what the revised idea forbids that it didn't before. If it rules nothing new out, it isn't a fix; say so and ask again.
- **Answer it**: write their reason as a counter, `### C<n>.1`, with `- **Criticism:**` saying why the original misses. You may criticise their counter in turn (`C<n>.1.1`) if it doesn't hold up.
- **Accept it**: `- **Response:** conceded`. The idea as stated is wrong; offer to restate it or mark it `refuted`.
- **Leave it open** for now.

Set `status: criticised`. When nothing is open, set `status: standing` and fill `## Still unknown` and `## Next questions`. Run the lint and fix what it reports.

Done when every criticism has been put to the person and recorded with their answer, or left open by their choice.

**Reply:** the strongest criticism first, then the rest, each with its evidence. Then where the idea stands: what's open, what's been answered.
