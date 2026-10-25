---
name: share
description: "Turn IDEA.md into a page anyone can read and a handoff any AI assistant can continue, so other people can criticise the idea."
disable-model-invocation: true
argument-hint: "Who's it for, and what do you want from them? (optional)"
---

An idea written down stands apart from its author, so other people can find the errors the author can't. This sends it out. The scripts are in `scripts/` beside this file and need only Node 18+.

1. **Check it.** `node <this skill>/scripts/lint.mjs IDEA.md`. Fix any failure with the right skill (`conjecture`, `criticise`) and run it again. Read the warnings to the person and let them decide.
2. **Render it.** `node <this skill>/scripts/render.mjs IDEA.md --out ./share`, adding `--for "<who>"` and `--ask "<what you want from them>"` if the person said. It writes:
   - `share/<slug>.html`: one page with the problem, the idea, the alternatives, a tick-list of what would show it wrong, the criticism so far, and buttons that copy a ready-made prompt for any AI assistant.
   - `share/<slug>.HANDOFF.md`: the full record with instructions, for an agent to pick up.
3. **Hand it over.** Give the person both files and open the page if you can.

Done when the check passes and both files exist.

**Reply:** whether it passed, where the two files are, and what the page asks the reader to do.
