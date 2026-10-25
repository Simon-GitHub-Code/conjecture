#!/usr/bin/env node
// Turn an IDEA.md into a self-contained page anyone can read, and a handoff any agent can pick up.
// Usage: node render.mjs IDEA.md [--out ./share] [--for "who"] [--ask "what you want from them"]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseRecord, slugify } from "./parse.mjs";
import { lint } from "./lint.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
const paras = (sec) => (sec && !sec.empty ? sec.paras.map((p) => `<p>${inline(p).replace(/\n/g, "<br>")}</p>`).join("") : "");
const bullets = (items) => (items && items.length ? `<ul>${items.map((b) => `<li>${inline(b)}</li>`).join("")}</ul>` : "");

function findUp(name, from) {
  for (let dir = from, i = 0; i < 6; i++) {
    const p = join(dir, name);
    if (existsSync(p)) return p;
    if (dirname(dir) === dir) break;
    dir = dirname(dir);
  }
  return null;
}

function state(n) {
  if (n.depth === 1 && n.response === "revised") return ["revised", "fixed by revising the idea"];
  if (n.depth === 1 && n.response === "conceded") return ["conceded", "accepted"];
  if (n.open) return ["open", n.depth === 1 ? "open" : "stands"];
  return ["answered", "answered"];
}

function renderNode(n) {
  const [cls, word] = state(n);
  return `
    <li class="node s-${cls}">
      <details${n.depth === 1 && n.open ? " open" : ""}>
        <summary><span class="id">C${esc(n.id)}</span><span class="t">${inline(n.title) || (n.depth === 1 ? "Criticism" : "Counter")}</span><span class="state">${esc(word)}</span></summary>
        <p>${n.depth > 1 ? '<span class="lbl">Counter:</span> ' : ""}${inline(n.text)}</p>
        ${n.rulesOut ? `<p class="rules"><span class="lbl">Now rules out:</span> ${inline(n.rulesOut)}</p>` : ""}
      </details>
      ${n.children.length ? `<ol class="tree">${n.children.map(renderNode).join("")}</ol>` : ""}
    </li>`;
}

export function renderHtml(rec, opts = {}) {
  const { front, sections: s } = rec;
  const title = front.title || "Untitled idea";
  const ask = opts.ask || "find what's wrong with it";
  const t = rec.criticism;
  const banner = !t.roots.length
    ? ["none", "Not criticised yet. You could be first."]
    : t.stands
      ? ["stands", `Stands for now: all ${t.roots.length} criticism${t.roots.length === 1 ? "" : "s"} answered.`]
      : ["open", `Open: ${t.open.map((n) => "C" + n.id).join(", ")} ${t.open.length === 1 ? "hasn't" : "haven't"} been answered, so the idea doesn't stand yet.`];
  const testableWord = { yes: "testable", partly: "partly testable", no: "not testable by observation" }[(front.testable || "").toLowerCase()] || "";
  const handoff = renderHandoff(rec, opts);
  const critic = `Read the idea below and try to show it wrong. One criticism per point, each as a new "### C" entry after the last one. You can also answer an existing criticism by adding a counter beneath it (C2.1, C2.1.1...). ${front.testable === "no" ? "It isn't testable by observation, so look for counterexamples, contradictions, and ways it fails to solve its own problem." : "For its testable parts, check whether the evidence already exists. For the rest, look for counterexamples, contradictions, and ways it fails to solve its own problem."} Say what would make each of your criticisms miss.\n\n${handoff}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="An idea, written down so it can be criticised.">
<style>
  :root{--bg:#f7f5f0;--ink:#1d1b17;--muted:#6b665c;--line:#d9d4c8;--card:#fffdf8;--accent:#8a3b12;--accent-ink:#fff;--good:#2e6b3a;--warn:#9a6b00;--bad:#a32d2d;--soft:#ede8dd;
    --serif:"Iowan Old Style","Palatino Linotype","Book Antiqua",Georgia,serif;--sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;--mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace}
  @media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#15140f;--ink:#ece7da;--muted:#a39d8f;--line:#2e2b23;--card:#1d1b15;--accent:#e0824a;--accent-ink:#15140f;--good:#7fcf8e;--warn:#e2b84a;--bad:#ef7b7b;--soft:#23201a}}
  :root[data-theme="dark"]{--bg:#15140f;--ink:#ece7da;--muted:#a39d8f;--line:#2e2b23;--card:#1d1b15;--accent:#e0824a;--accent-ink:#15140f;--good:#7fcf8e;--warn:#e2b84a;--bad:#ef7b7b;--soft:#23201a}
  *{box-sizing:border-box} html,body{background:var(--bg)}
  body{margin:0;color:var(--ink);font:17px/1.55 var(--sans);-webkit-font-smoothing:antialiased}
  main{max-width:740px;margin:0 auto;padding:40px 16px 96px}
  header{border-bottom:1px solid var(--line);padding-bottom:20px;margin-bottom:28px}
  .meta{font:12px/1.4 var(--mono);color:var(--muted);text-transform:uppercase;letter-spacing:.03em;display:flex;gap:14px;flex-wrap:wrap}
  h1{font:600 34px/1.15 var(--serif);margin:10px 0 8px;letter-spacing:-.01em}
  .lede{color:var(--muted);margin:0}
  .banner{margin:16px 0 0;padding:10px 14px;border-radius:8px;border:1px solid var(--line);background:var(--card);font-size:15px}
  .banner.stands{border-color:var(--good);color:var(--good)} .banner.open{border-color:var(--warn);color:var(--warn)}
  h2{font:600 14px/1.3 var(--sans);text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:40px 0 12px}
  h4{font:600 12px/1.3 var(--sans);text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin:0 0 6px}
  p{margin:0 0 12px} ul{padding-left:20px;margin:0 0 12px} li{margin:0 0 6px}
  .idea{font:400 21px/1.5 var(--serif);border-left:3px solid var(--accent);padding:2px 0 2px 18px}
  .hint{font-size:14px;color:var(--muted)}
  .card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}
  table{width:100%;border-collapse:collapse;font-size:15px} th,td{text-align:left;vertical-align:top;padding:8px 10px;border-top:1px solid var(--line)} th{width:34%}
  ul.checks{list-style:none;padding:0}
  .checks label{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:var(--card);cursor:pointer}
  .checks input{margin-top:5px;accent-color:var(--bad)} .checks .on label{border-color:var(--bad)}
  #found{display:none;margin-top:10px;padding:10px 14px;border-radius:8px;border:1px solid var(--bad);color:var(--bad);background:var(--card)} #found.on{display:block}
  .result{padding:10px 14px;border-radius:8px;background:var(--soft)}
  ol.tree{list-style:none;padding:0 0 0 18px;margin:8px 0 0;border-left:2px solid var(--line)}
  #criticism>ol.tree{padding:0;border:0}
  .node{margin:0 0 10px}
  details{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px}
  details>p{margin:10px 0 0;font-size:15px}
  summary{cursor:pointer;display:flex;flex-wrap:wrap;gap:10px;align-items:baseline;font-weight:600}
  .id{font:600 12px var(--mono);color:var(--muted)} .t{flex:1 1 200px}
  .state{font:11px/1.8 var(--mono);text-transform:uppercase;font-weight:400;padding:0 8px;border-radius:999px;border:1px solid var(--line);color:var(--muted)}
  .s-open>details{border-color:var(--warn)} .s-open>details .state{color:var(--warn);border-color:var(--warn)}
  .s-answered>details .state{color:var(--good);border-color:var(--good)}
  .s-revised>details .state{color:var(--accent);border-color:var(--accent)}
  .s-conceded>details{border-color:var(--bad)} .s-conceded>details .state{color:var(--bad);border-color:var(--bad)}
  .lbl{font:600 12px var(--sans);text-transform:uppercase;letter-spacing:.05em;color:var(--muted)}
  .take{background:var(--soft);border-radius:12px;padding:18px;margin-top:40px} .take h2{margin-top:0;color:var(--ink)}
  .btns{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0}
  button{font:600 14px/1 var(--sans);padding:11px 14px;border-radius:8px;border:1px solid var(--line);background:var(--card);color:var(--ink);cursor:pointer}
  button.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent)}
  textarea{width:100%;min-height:160px;font:13px/1.5 var(--mono);padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--card);color:var(--ink)}
  footer{margin-top:48px;font:12px var(--mono);color:var(--muted)}
  @media (max-width:520px){h1{font-size:28px}.idea{font-size:19px}}
</style>
</head>
<body>
<main>
  <header>
    <div class="meta">${[front.author, front.created, testableWord].filter(Boolean).map((x) => `<span>${esc(x)}</span>`).join("")}</div>
    <h1>${esc(title)}</h1>
    <p class="lede">${opts.for ? `For ${esc(opts.for)}. ` : ""}An idea, written down so it can be criticised. The ask: ${esc(ask)}.</p>
    <p class="banner ${banner[0]}">${esc(banner[1])}</p>
  </header>

  <section><h2>The problem</h2>${paras(s.problem) || '<p class="hint">No problem recorded.</p>'}</section>
  <section><h2>The idea</h2><div class="idea">${paras(s.idea) || '<p class="hint">No idea recorded yet.</p>'}</div></section>

  ${rec.parts.length ? `<section><h2>Why it has to be this way</h2><p class="hint">Swap any of these for something generic and the idea should break. If one swaps out with nothing else changing, that's a criticism.</p>
  <table>${rec.parts.map((p) => `<tr><th>${inline(p.name)}</th><td>${inline(p.why)}</td></tr>`).join("")}</table></section>` : ""}

  ${rec.alternatives.length ? `<section><h2>Alternatives it has to beat</h2><div class="grid">${rec.alternatives.map((a) => `<div class="card">${a.name ? `<h4>${inline(a.name)}</h4>` : ""}<p>${inline(a.text)}</p></div>`).join("")}</div></section>` : ""}

  ${rec.refuters.length ? `<section><h2>What would show it wrong</h2><p class="hint">Written before anyone went looking. Tick anything you know to be true, or a case you can construct.</p>
  <ul class="checks">${rec.refuters.map((x, i) => `<li><label><input type="checkbox" data-i="${i}"><span>${inline(x)}</span></label></li>`).join("")}</ul><div id="found" role="status"></div></section>` : ""}

  ${rec.test && rec.test.present ? `<section><h2>The test</h2><div class="grid">
    <div class="card"><h4>Setup</h4><p>${inline(rec.test.setup)}</p></div>
    <div class="card"><h4>The idea predicts</h4><p>${inline(rec.test.ideaPredicts)}</p></div>
    <div class="card"><h4>The alternative predicts</h4><p>${inline(rec.test.altPredicts)}</p></div></div>
    <p class="result" style="margin-top:12px"><strong>Result:</strong> ${rec.test.pending ? "not run yet." : inline(rec.test.result)}</p></section>` : ""}

  ${t.roots.length ? `<section id="criticism"><h2>Criticism so far</h2><p class="hint">A criticism stays open until the idea is revised to meet it, or someone answers it with a counter that nobody has answered in turn. The idea stands when nothing is open.</p>
  <ol class="tree">${t.roots.map(renderNode).join("")}</ol></section>` : ""}

  ${s.unknown && !s.unknown.empty ? `<section><h2>Still unknown</h2>${bullets(s.unknown.bullets)}${paras(s.unknown)}</section>` : ""}
  ${s.next && !s.next.empty ? `<section><h2>Next questions</h2>${bullets(s.next.bullets)}${paras(s.next)}</section>` : ""}

  <section class="take"><h2>Take it further</h2>
    <p>The criticism an idea needs most is the kind its author can't give. Paste this into any AI assistant to continue, or send the page to someone who'll disagree.</p>
    <div class="btns"><button class="primary" data-copy="critic">Copy: ask an AI to criticise it</button><button data-copy="handoff">Copy the full record</button></div>
    <textarea id="critic" readonly hidden>${esc(critic)}</textarea><textarea id="handoff" readonly hidden>${esc(handoff)}</textarea>
    <p class="hint" id="copied" aria-live="polite"></p>
  </section>
  <footer>Made with the conjecture plugin. Any of this may be wrong.</footer>
</main>
<script>
(function(){
  var boxes=[].slice.call(document.querySelectorAll('.checks input')),found=document.getElementById('found');
  function upd(){var n=0;boxes.forEach(function(b){b.closest('li').classList.toggle('on',b.checked);if(b.checked)n++;});
    if(found){found.className=n?'on':'';found.textContent=n?'If that\\'s true, the idea is wrong as stated. That is the most useful thing you can tell its author: say what you saw and where.':'';}}
  boxes.forEach(function(b,i){try{if(localStorage.getItem('w'+i)==='1')b.checked=true;}catch(e){}b.addEventListener('change',function(){try{localStorage.setItem('w'+i,b.checked?'1':'0')}catch(e){}upd();});});
  upd();
  var msg=document.getElementById('copied');
  [].slice.call(document.querySelectorAll('[data-copy]')).forEach(function(btn){btn.addEventListener('click',function(){
    var ta=document.getElementById(btn.getAttribute('data-copy'));
    function ok(){msg.textContent='Copied.';}
    function fb(){ta.hidden=false;ta.select();try{document.execCommand('copy');ok();}catch(e){msg.textContent='Select the text and copy it.';}}
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(ta.value).then(ok,fb);else fb();
  });});
})();
</script>
</body>
</html>`;
}

export function renderHandoff(rec, opts = {}) {
  const { front } = rec;
  const t = rec.criticism;
  const next = t.roots.reduce((m, n) => Math.max(m, Number(n.id)), 0) + 1;
  const lexPath = opts.lexicon || [join(here, "..", "..", "lexicon", "SKILL.md")].find(existsSync) || findUp("LEXICON.md", here);
  const lexicon = lexPath ? readFileSync(lexPath, "utf8").replace(/^---[\s\S]*?---\s*/, "").replace(/^# Lexicon\s*/m, "").replace(/\n## The record[\s\S]*$/, "").trim() : "";
  const status = !t.roots.length ? "No criticism yet." : t.stands ? "Every criticism is answered, so the idea stands for now." : `Open criticism: ${t.open.map((n) => "C" + n.id).join(", ")}. The idea doesn't stand until these are answered.`;
  return `# Handoff: ${front.title || "Untitled idea"}

You're picking up an idea someone wants criticised.${opts.for ? ` It was sent to ${opts.for}.` : ""} The ask: ${opts.ask || "find what's wrong with it"}.

${status} New criticisms start at C${next}, one point each. To answer an existing criticism, add a counter beneath it (C2.1, C2.1.1...). A criticism stays open until the idea is revised to meet it (and the revision says what it now rules out) or a counter answers it. Only testable parts of the idea (testable: ${front.testable || "?"}) can be shown wrong by observation; everything else by counterexample, contradiction, or failing to solve its own problem. The idea's owner makes every call. Add to the record; don't rewrite what's there.

---

${readRaw(rec)}
${lexicon ? `\n---\n\n## Words used above\n\n${lexicon}\n` : ""}`;
}

function readRaw(rec) {
  const fm = Object.entries(rec.front).map(([k, v]) => `${k}: ${v}`).join("\n");
  const body = Object.values(rec.sections).filter((s) => !s.empty).map((s) => `## ${s.title}\n\n${s.raw}`).join("\n\n");
  return `---\n${fm}\n---\n\n${body}\n`;
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) {
  const args = process.argv.slice(2);
  const opt = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const file = args.find((a, i) => !a.startsWith("--") && (i === 0 || !args[i - 1].startsWith("--"))) || "IDEA.md";
  const out = opt("--out") || "./share";
  let text;
  try { text = readFileSync(file, "utf8"); } catch { console.error(`can't read ${file}`); process.exit(2); }
  const res = lint(text);
  if (!res.ok && !args.includes("--force")) {
    console.error("fix the record first (or pass --force):");
    for (const f of res.fails) console.error(`  FAIL  ${f}`);
    process.exit(1);
  }
  const rec = parseRecord(text);
  const slug = slugify(rec.front.title);
  mkdirSync(out, { recursive: true });
  const opts = { for: opt("--for"), ask: opt("--ask") };
  writeFileSync(join(out, `${slug}.html`), renderHtml(rec, opts));
  writeFileSync(join(out, `${slug}.HANDOFF.md`), renderHandoff(rec, opts));
  console.log(resolve(join(out, `${slug}.html`)));
  console.log(resolve(join(out, `${slug}.HANDOFF.md`)));
  for (const w of res.warns) console.log(`  warn  ${w}`);
}
