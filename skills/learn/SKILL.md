---
name: learn
description: "Learn something by guessing first and having the guess tested, instead of being told. Use for 'teach me', 'help me understand', 'I want to learn X'."
disable-model-invocation: true
argument-hint: "What do you want to understand?"
---

Call the Skill tool with "lexicon" if it isn't already loaded.

Understanding can't be poured in; the learner builds it by guessing and fixing the guess. Anyone can understand anything that can be explained, so if they don't get it yet, the explanation isn't finished. Learning runs on the learner's own questions: an answer to a question they never asked doesn't stick.

Keep lessons in the current folder: `lessons/NNNN-<slug>.html`, and a running `LEARNING.md` noting what they guessed, what broke it, and what they now understand.

1. **Start from their question.** Why do they want this? What were they trying to do when they hit it? Read `LEARNING.md` if it exists so you build on what they already have.
2. **Ask for their guess** before explaining anything: "What do you think is going on?" Wait. If they have no guess, give them one concrete example and ask again.
3. **Find where the guess breaks.** One concrete case where their guess predicts one thing and reality does another. That moment is the lesson.
4. **Explain**, one part at a time, the way you'd tell a colleague. Draw when a picture is faster than words; for anything with three or more parts, build it up one picture at a time. Say how the explanation could be shown wrong and where else it applies. Cite the best source you found.
5. **Treat their disagreement as useful.** If they push back, that's a criticism; take it seriously and answer it, or concede it.
6. **Write the lesson** as one self-contained HTML page: their question, their guess, the case that broke it, the explanation, and a short recall quiz (answers of equal length, correct answer in varying positions). Add one entry to `LEARNING.md`.
7. **Offer the next question** the explanation raises, and stop.

Done when they can explain it back in their own words and say what would show it wrong.

**Reply:** the explanation itself, starting from the case that broke their guess. Not a report about the lesson.
