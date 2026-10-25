# Handoff: A skill library can make AI help you find what's wrong with your idea, not just agree with it

You're picking up an idea someone wants criticised. The ask: find the criticism that settles C5, or one nobody has thought of.

Open criticism: C5. The idea doesn't stand until these are answered. New criticisms start at C6, one point each. To answer an existing criticism, add a counter beneath it (C2.1, C2.1.1...). A criticism stays open until the idea is revised to meet it (and the revision says what it now rules out) or a counter answers it. Only testable parts of the idea (testable: partly) can be shown wrong by observation; everything else by counterexample, contradiction, or failing to solve its own problem. The idea's owner makes every call. Add to the record; don't rewrite what's there.

---

---
title: A skill library can make AI help you find what's wrong with your idea, not just agree with it
status: criticised
testable: partly
author: Simon Tulett
created: 2026-10-25
---

## Problem

More and more people explore ideas and learn by talking to an AI, and the AI's default is to agree and explain fluently. People expect the conversation to improve their idea; what they usually get back is a more confident version of the same idea. Coding skill libraries (pstack, Matt Pocock's skills) fixed the equivalent problem for code by leaning on checks that already existed, like tests and types. Idea work has no such check, so "be critical" is just a request the model forgets as the conversation grows.

## Idea

A small set of skills can make criticism the normal outcome of exploring an idea with an AI, if it does four things. It steers the model with a few well-chosen words the model already understands (problem, conjecture, alternative, swap, refuter), rather than long instructions. It keeps the idea in one plain file the person can read. It runs a script that checks the file's shape: is there a problem, an alternative, something that would show it wrong, and is every criticism answered? It never asks whether the idea is true. And it turns that file into a page and a handoff, so other people and other AIs can find what the author can't. Everything the person reads is plain English.

## Why it has to be this way

- Words the model already knows — an invented term has to be defined in every skill and drifts; "alternative" or "swap" pulls in the right behaviour in one word.
- One plain file — notes in a chat can't be checked or handed on; a fixed shape can be.
- A check on shape, never on truth — an AI judging quality is the agreeable judge we're trying to get away from; a script checking shape is the one check that can't be talked round.
- A criticism stays open until answered — without this, "I disagree" closes a criticism for free, and the idea survives without improving.
- A fresh critic who hasn't seen the reasoning — a critic who has heard the case for the idea tends to argue inside it.
- A shareable page — the criticism an idea needs most is the kind its author can't give.

## Alternatives

- **Custom instructions** — tell the AI to be critical and play devil's advocate. Falls short because it fades as the conversation grows, keeps nothing between sessions, and nothing checks whether it happened.
- **Matt Pocock's `grilling`** — a relentless interview that works through every decision. Gets the interview right (this plugin borrows it). Falls short because it has no standard for a good answer, so a bad idea can be grilled into a detailed bad idea.
- **A fully automated critique pipeline** — the AI conjectures and criticises itself in rounds with no human in between. Falls short because the critic softens when nobody is watching, and an idea you didn't make the calls on isn't yours.
- **Veritula** — a site where people post ideas and criticisms and the site shows which ideas have unanswered criticism. The strongest alternative, and the source of this plugin's open-criticism rule. Falls short for one person exploring an idea alone with an AI: it needs other people to show up.

## What would show it wrong

- Records from real use where almost no criticism leads to a revision or a concession: then the check isn't catching anything.
- Records that pass the check with entries under "What would show it wrong" that nobody could actually check or construct ("if it doesn't work").
- A preference or a matter of taste ("I want the app to feel calm") forced into a fake problem to fit the shape.
- People trying it once and not coming back, because nobody wants their idea taken apart: then it misses the real problem.

## Test

- Setup: take five of the author's past idea conversations (ideas he still holds) and re-run each through `/explore`, alongside a plain chat with the instruction "be critical".
- Idea predicts: at least two of the five change in a way that matters (an alternative is adopted, or a part of the idea is dropped), against none or one in the plain chat.
- Alternative predicts: "be critical" produces as many real changes, so the skills add nothing.
- Result: pending

## Criticism

### C1 The check becomes a ritual

- **Criticism:** The script checks shape, not substance, so the model will learn to fill the slots with plausible filler ("if users don't adopt it") and the check will pass empty records. Once the shape is the target, it stops measuring anything.
- **Response:** revised
- **Now rules out:** an entry under "What would show it wrong" surviving the `criticise` step without someone actually trying to check or construct it; the critic's first job is to go and look for each one.

### C2 Falsifiability only applies to scientific ideas

- **Criticism:** The first version demanded "falsifiers" for every idea, which is the popular misreading of Popper. Testability separates science from other knowledge; it doesn't separate good ideas from bad. Most ideas people bring (a business plan, a design, a moral question) can't be refuted by an observation, yet they can still be criticised.
- **Response:** revised
- **Now rules out:** an untestable idea failing the check for having no observation that would refute it. The record says whether the idea is testable; for the parts that aren't, it is shown wrong by a counterexample, a contradiction, or failing to solve its own problem.

### C3 "Withstood" was a free vote

- **Criticism:** The person could mark any criticism "withstood" with no reason, and the idea moved on. That is a vote, and votes let ideas survive without improving (raised via Dennis Hackethal's work and Veritula).
- **Response:** revised
- **Now rules out:** an idea being marked as standing while any criticism of it is unanswered. Rejecting a criticism now means writing a counter, which can itself be criticised.

### C4 Too philosophical for most people

- **Criticism:** The library has to be useful to anyone. The early version had a 25-term glossary, strict prefixes and verdict types, and a record full of jargon. Most people will bounce off it.
- **Response:** revised
- **Now rules out:** a person needing to learn any special vocabulary to read the record, the page, or the check's messages. The vocabulary is for steering the model and stays inside the skills.

### C5 People don't want their ideas taken apart

- **Criticism:** A tool whose normal result is "your idea has a problem" will be tried once and dropped. The records left behind will be the ideas that survived, so it will look like it works while quietly failing.

### C5.1 You stay in charge

- **Criticism:** It's opt-in, the person makes every call, and the criticism is answered in their own words. Being shown a flaw and choosing your own fix feels very different from being told you're wrong.

### C5.1.1 That's a guess about feelings

- **Criticism:** C5.1 is an argument about how it will feel. Whether people keep using it is a question about behaviour, and only real use can answer it. Until the test has run, C5.1 doesn't settle anything.

## Still unknown

- Whether people come back to a tool that criticises their ideas (C5 stays open until the test runs).
- Whether the steering words work as well on other models.
- Whether the shape check catches empty rigour in practice, or only in principle.

## Next questions

- The person's answer is still the weak point: they can write a lazy counter. How do you make counters criticisable without taking the decision away from them?
- Most people who explore ideas don't install plugins. Can the record travel into ordinary chat apps?
- Can a record be posted to Veritula, so the people there criticise it?


---

## Words used above

The handful of words every skill in this collection thinks with. They come from Karl Popper and David Deutsch; the model already knows them, so skills use the word and never re-explain it. Read this once per session. Talk to the person in plain words; these are for your thinking.

**problem** — a clash between what someone expected and what they found, or between two things they believe. Every good idea answers one. An idea with no problem behind it is a preference, and there is nothing to criticise.

**conjecture** — a bold guess that answers the problem. Bold means it says a lot and rules a lot out, so it can be wrong in interesting ways. A menu of options is not a conjecture.

**alternative** — the strongest competing answer to the same problem, put the way its best supporter would put it. An idea is only as good as the alternative it beats.

**hard to vary** — every part of the idea is doing work. Test it with the **swap**: replace a part with something generic. If nothing else has to change, that part was decoration. An easy-to-vary part is a criticism, not a score.

**refuter** — what would show the idea wrong, written down before anyone looks. Only the **testable** parts of an idea (claims about what will happen in the world) can be shown wrong by an observation. Everything else (a plan, a design, a moral or philosophical view, a proof) is shown wrong by a counterexample, by a contradiction, or by failing to solve its own problem. Untestable is not the same as unimportant or uncriticisable.

**criticism** — an attempt to find where the idea is wrong, one claim at a time. A criticism is answered in one of two ways: the idea is **revised** so the criticism no longer applies, or someone writes a **counter** (a criticism of the criticism) that explains why it misses. A revision only counts if the revised idea now rules out something new; otherwise it is an excuse.

**open** — a criticism nobody has answered yet. A counter only answers a criticism while the counter itself has no open criticism. The idea **stands** when no criticism of it is open. There are no votes and no scores; one open criticism blocks it.

**test** — the cheapest situation where the idea and its alternative say different things, worked out or run. For testable ideas, an experiment or a look at real data. For the rest, a worked example carried all the way through.

**reach** — when an idea turns out to solve problems it was never built for. The best sign it is onto something.

**stance** — anything here may be wrong, including the criticism. Ideas are judged by their reasons, never by who holds them. The person owns their idea and makes every decision about it; your job is to make it easy to find its errors. Problems are soluble: "impossible" usually means some knowledge is missing.
