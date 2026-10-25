# conjecture

**Skills that help you explore ideas and learn, by finding what's wrong with them.**

Ask an AI about your idea and it will usually agree with you, explain it back more fluently, and send you off more confident than you arrived. That feels like progress, but it isn't. Ideas get better when their mistakes are found and fixed.

These skills change the AI's default. Whatever your idea is (a business, a design, a plan, an argument, a theory, something you're trying to understand), the AI will:

- **find the real problem** your idea is solving, before anything else
- **make one bold version** of the idea, next to the strongest alternative it has to beat
- **write down what would show it wrong**, before anyone goes looking
- **criticise it properly**: a fresh critic tries to break it, and you answer each point, either by improving the idea or by saying why the criticism misses
- **test it** the cheapest way that would actually settle something
- **share it** as a page anyone can read, so other people can find what you missed

Everything is kept in one plain file, `IDEA.md`, that you own and can read. A small script checks that the idea is in good shape: it has a problem, an alternative, something that would show it wrong, and every criticism answered. It never decides whether your idea is *true*. That's still your call.

There's also `/learn`, for when you want to understand something rather than evaluate it. It asks for your guess first, finds the example where your guess breaks, and builds the explanation from there.

## Install

Pick **one** route for each tool you use. Installing a plugin and also copying the skills gives you every skill twice.

> **This repository is private for now.** Every route below works only for people who have access to it on GitHub, and their machine must be signed in to GitHub (for example `gh auth login`, or git over SSH). Once the repo is public, the same commands work for anyone.

The `share` skill's scripts need [Node.js](https://nodejs.org) 18 or later. Nothing else needs installing.

<details open>
<summary><strong>Claude Code</strong> (terminal, IDE, desktop)</summary>

In Claude Code:

```
/plugin marketplace add Simon-GitHub-Code/conjecture
/plugin install conjecture@simontulett
```

Or from your shell:

```bash
claude plugin marketplace add Simon-GitHub-Code/conjecture
claude plugin install conjecture@simontulett
```

Plugin skills are namespaced, so `/explore` is `/conjecture:explore`. To update later, run `claude plugin update conjecture@simontulett`, or turn on auto-update for the `simontulett` marketplace under `/plugin` → Marketplaces.

</details>

<details>
<summary><strong>Claude app</strong> (claude.ai on web and desktop)</summary>

The app installs one skill at a time from a ZIP.

1. Download this repo (Code → Download ZIP) and unzip it, then run `./scripts/package-skills.sh`. That puts one ZIP per skill in `dist/`.
2. In Claude, open **Settings → Capabilities** and turn on code execution ("Create and edit files"). Skills need it.
3. Go to **Customize → Skills**, click **+**, then **Create skill → Upload a skill**, and upload each ZIP. Always include `lexicon.zip`, because every other skill relies on it.

On Team and Enterprise plans, an owner may need to allow custom skills first. See [Use skills in Claude](https://support.claude.com/en/articles/12512180-use-skills-in-claude).

</details>

<details>
<summary><strong>OpenAI Codex</strong></summary>

```bash
codex plugin marketplace add Simon-GitHub-Code/conjecture
codex plugin add conjecture@simontulett
```

Codex reads this repo's plugin manifest and updates the plugin when it starts.

</details>

<details>
<summary><strong>GitHub Copilot</strong> (CLI and VS Code)</summary>

Copilot CLI:

```bash
copilot plugin marketplace add Simon-GitHub-Code/conjecture
copilot plugin install conjecture@simontulett
```

VS Code: run **Chat: Install Plugin From Source** from the command palette and enter `https://github.com/Simon-GitHub-Code/conjecture`.

</details>

<details>
<summary><strong>Gemini CLI</strong></summary>

```bash
gemini skills install https://github.com/Simon-GitHub-Code/conjecture.git --path skills
```

Run the same command again to update.

</details>

<details>
<summary><strong>Cursor, Windsurf, OpenCode, Amp and other agents</strong></summary>

[skills.sh](https://skills.sh) copies the skills into your project as editable files:

```bash
npx skills@latest add Simon-GitHub-Code/conjecture -a cursor   # or windsurf, opencode, amp, ... ; leave out -a to choose
```

Install all the skills, or at least `lexicon` plus the ones you want. To update, run `npx skills@latest update`.

</details>

<details>
<summary><strong>ChatGPT and other chat apps without skills</strong></summary>

Chat apps that can't install skills can still follow them. Create a project (or custom GPT) and paste in the contents of [`skills/lexicon/SKILL.md`](skills/lexicon/SKILL.md) and of the skill you want, for example [`skills/criticise/SKILL.md`](skills/criticise/SKILL.md), as its instructions. The page the `share` skill produces also has a button that copies a ready-made prompt any AI can work from.

</details>

## Use

Start with an idea in a sentence:

```
/explore people would pay for an inbox that receives and pays their household bills
```

`explore` walks you through each step and asks you to decide at each one:

| step | skill | what you get |
|---|---|---|
| 1 | `problem` | the real problem your idea solves, agreed by you |
| 2 | `conjecture` | one bold version of the idea, its strongest alternative, and what would show it wrong |
| 3 | `criticise` | a fresh critic tries to break it; you answer each point |
| 4 | `test` | the cheapest check that tells your idea apart from the alternative |
| 5 | `share` | a page anyone can read, and a handoff any AI can continue from |

Every skill also works on its own. Say "poke holes in this" and `criticise` runs; "how would we know?" runs `test`; "what's the real problem here?" runs `problem`. `/learn` is separate:

```
/learn why interest rates affect house prices
```

## The one rule

A criticism stays **open** until you either improve the idea to meet it, or write down why it misses. Your reply can be criticised too, which reopens the original criticism. An idea **stands** only when nothing is open. There are no votes, no scores, and no "I disagree" button. This rule comes from Dennis Hackethal's work and [Veritula](https://veritula.com).

Two further checks keep this honest:

- **A fix has to rule something out.** If a revision doesn't rule out anything new, it's an excuse rather than a fix, and the check says so.
- **Not every idea can be tested.** A business plan, a design, a moral view or an argument can't be proved wrong by an experiment, but each can still be shown wrong by a counterexample, a contradiction, or failing to solve its own problem. Each record says whether its idea is `testable: yes | partly | no`, and the skills criticise it in the right way.

## Example

[`examples/skill-library/`](examples/skill-library/) is this project's own idea, put through its own skills. Four criticisms were met by revising the idea. One is still open (do people actually *want* their ideas criticised?), so the check won't let the idea be called "standing" until that test has run. Open the [rendered page](examples/skill-library/share/) to see what `share` produces.

## What's in the repo

```
.claude-plugin/       plugin + marketplace manifests (read by Claude Code, Codex and Copilot)
skills/
  explore/            the guided route through all the steps
  problem/  conjecture/  criticise/  test/
  learn/              learning by guessing first
  share/              share skill, plus scripts: new, lint (the check), render (page + handoff)
  lexicon/            the shared vocabulary and the IDEA.md format
  */agents/openai.yaml  Codex display metadata
scripts/package-skills.sh   builds per-skill ZIPs for the Claude app
examples/             a worked example
```

To run the check's tests: `node --test skills/share/scripts/`.

## Background

The approach comes from Karl Popper and David Deutsch, as taught by Brett Hall: knowledge grows by guessing boldly and then hunting for your own mistakes. You don't need to have read any of them to use these skills.

The writing style follows [Matt Pocock's skills](https://github.com/mattpocock/skills): short skills steered by a few words the model already understands, instructions stated positively, and a clear "done when" on each step. The structure borrows from [pstack](https://github.com/cursor/plugins/tree/main/pstack): one entry point, a defined reply for each skill, and real scripts with tests beside the skill that uses them.

## Licence

MIT. See [LICENSE](LICENSE).
