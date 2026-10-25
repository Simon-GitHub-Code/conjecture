// Parser for IDEA.md records. Zero dependencies. See ../../lexicon/RECORD.md for the format.

export const STATUSES = ["draft", "criticised", "standing", "refuted"];
export const TESTABLE = ["yes", "partly", "no"];
export const RESPONSES = ["revised", "conceded"];

// Section key -> heading, in template order.
export const SECTIONS = [
  ["problem", "Problem"],
  ["idea", "Idea"],
  ["why", "Why it has to be this way"],
  ["alternatives", "Alternatives"],
  ["wrong", "What would show it wrong"],
  ["test", "Test"],
  ["criticism", "Criticism"],
  ["unknown", "Still unknown"],
  ["next", "Next questions"],
];
const KEY_BY_HEADING = Object.fromEntries(SECTIONS.map(([k, h]) => [h.toLowerCase(), k]));

const placeholder = (s) => /^<.*>$/s.test(String(s).trim());
const word = (s) => s.toLowerCase().replace(/[*`.]/g, "").trim();

export function parseRecord(text) {
  const src = text.replace(/\r\n/g, "\n");
  const front = {};
  let body = src;
  const fm = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    for (const line of fm[1].split("\n")) {
      const m = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
      if (m) front[m[1].trim()] = m[2].trim();
    }
    body = src.slice(fm[0].length);
  }

  const sections = {};
  let current = null;
  for (const line of body.split("\n")) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const title = h2[1].trim();
      current = { key: KEY_BY_HEADING[title.toLowerCase()] || title.toLowerCase(), title, lines: [] };
      sections[current.key] = current;
      continue;
    }
    if (current) current.lines.push(line);
  }
  for (const s of Object.values(sections)) {
    s.raw = s.lines.join("\n").trim();
    s.bullets = s.lines
      .filter((l) => /^\s*[-*]\s+/.test(l))
      .map((l) => l.replace(/^\s*[-*]\s+/, "").trim())
      .filter((b) => b && !placeholder(b));
    s.paras = s.raw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p && !/^\s*[-*]\s+/.test(p) && !/^###/.test(p) && !placeholder(p));
    s.empty = s.bullets.length === 0 && s.paras.length === 0;
  }

  const list = (k) => (sections[k] ? sections[k].bullets : []);
  return {
    front,
    sections,
    parts: list("why").map((b) => {
      const [name, ...why] = b.split(/\s+[—–-]{1,2}\s+/);
      return { name: name.trim(), why: why.join(" — ").trim() };
    }),
    alternatives: list("alternatives").map((b) => {
      const m = b.match(/^\*\*(.+?)\*\*\s*[—–:-]*\s*(.*)$/);
      return m ? { name: m[1].trim(), text: m[2].trim() } : { name: null, text: b };
    }),
    refuters: list("wrong"),
    test: parseTest(sections.test),
    criticism: parseCriticism(sections.criticism),
  };
}

function field(bullets, name) {
  const re = new RegExp(`^\\**${name}:?\\**:?\\s*(.*)$`, "i");
  for (const b of bullets) {
    const m = b.match(re);
    if (m) return m[1].trim();
  }
  return "";
}

function parseTest(sec) {
  if (!sec) return null;
  const b = sec.bullets;
  const t = {
    setup: field(b, "Setup"),
    ideaPredicts: field(b, "Idea predicts"),
    altPredicts: field(b, "Alternative predicts"),
    result: field(b, "Result"),
  };
  t.present = Boolean(t.setup && !placeholder(t.setup));
  t.pending = !t.result || /^pending\b/i.test(t.result) || placeholder(t.result);
  return t;
}

// The criticism tree. `### C2 title` criticises the idea; `### C2.1` is a counter to C2;
// `### C2.1.1` criticises that counter; and so on.
// A criticism is open unless the idea was revised to meet it, or one of its counters is
// itself open (i.e. stands unanswered). The idea stands when no top-level criticism is open.
// This is Dennis Hackethal's rule, as used by veritula.com.
export function parseCriticism(sec) {
  const nodes = [];
  const errors = [];
  if (sec) {
    let cur = null;
    for (const line of sec.lines) {
      const h3 = line.match(/^###\s+C(\d+(?:\.\d+)*)\b\s*[—–:-]?\s*(.*)$/i);
      if (h3) {
        cur = { id: h3[1], title: h3[2].trim(), lines: [], children: [] };
        nodes.push(cur);
      } else if (/^###\s+/.test(line)) {
        errors.push(`"${line.trim()}" is not a criticism heading (### C1, ### C1.1, ...)`);
        cur = null;
      } else if (cur) cur.lines.push(line);
    }
  }
  const byId = {};
  for (const n of nodes) {
    const b = n.lines.filter((l) => /^\s*[-*]\s+/.test(l)).map((l) => l.replace(/^\s*[-*]\s+/, "").trim());
    n.text = field(b, "Criticism") || field(b, "Counter");
    n.response = word(field(b, "Response"));
    n.rulesOut = field(b, "Now rules out");
    n.depth = n.id.split(".").length;
    n.parentId = n.depth > 1 ? n.id.split(".").slice(0, -1).join(".") : null;
    if (byId[n.id]) errors.push(`C${n.id} appears twice`);
    byId[n.id] = n;
  }
  const roots = [];
  for (const n of nodes) {
    if (!n.parentId) roots.push(n);
    else if (byId[n.parentId]) byId[n.parentId].children.push(n);
    else errors.push(`C${n.id} answers C${n.parentId}, which doesn't exist`);
  }
  const memo = {};
  const isOpen = (n) => {
    if (!(n.id in memo)) memo[n.id] = !(n.depth === 1 && n.response === "revised") && !n.children.some(isOpen);
    return memo[n.id];
  };
  for (const n of nodes) n.open = isOpen(n);
  const open = roots.filter((n) => n.open);
  return { nodes, roots, byId, errors, open, stands: roots.length > 0 && open.length === 0 };
}

export function slugify(s) {
  return String(s || "idea").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "idea";
}
