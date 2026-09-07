// Deterministic code-side extraction for the doc-section TOKEN audit.
// For every libs/ui/src/components/ui/**/<name>.tsx in agentport: which utility CLASS NAMES does each
// top-level declaration use? Classes only — the utility->token mapping lives in check.py, fed by
// tokens-reference.md (single source, per the three-sources rule).
//
// Why per declaration and not per file: four catalog entries share libs/ui/src/components/ui/field/
// (Field, FieldLegend, FieldSet, FieldGroup). A file-level extract would hand FieldLegend the whole
// file's tokens. Declarations are keyed by name; check.py unions the entry's `code.exports`.
// Identifier references are resolved transitively (a component pulls in its module-level cva const).
//
// Usage: node extract-code.mjs [<agentportRoot>] > dumps/code.json
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2] || `${process.env.HOME}/Dev/agentport`;
const require = createRequire(join(root, 'package.json'));
const ts = require('typescript');

const uiDir = join(root, 'libs/ui/src/components/ui');
const files = [];
const walk = (dir) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx$/.test(f) && !/\.(stories|spec)\.tsx$/.test(f)) files.push(p);
  }
};
walk(uiDir);

/** A class-name candidate: no whitespace, no JSX/quote noise, looks like a utility. */
const CLASSISH = /^-?[a-zA-Z][a-zA-Z0-9_@:./[\]&>*%,()#+~=?!-]*$/;

/** Split a string literal into class-name candidates. */
function classesOf(text) {
  return String(text).split(/\s+/).filter((t) => t.length > 1 && CLASSISH.test(t));
}

/** Collect every string-ish literal inside a node's subtree, plus the identifiers it references. */
function harvest(node, sf) {
  const strings = [];
  const refs = new Set();
  const visit = (n) => {
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) strings.push(n.text);
    else if (ts.isTemplateExpression(n)) {
      strings.push(n.head.text);
      for (const sp of n.templateSpans) strings.push(sp.literal.text);
    } else if (ts.isIdentifier(n) && !(n.parent && ts.isPropertyAccessExpression(n.parent) && n.parent.name === n)) {
      refs.add(n.text);
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return { strings, refs };
}

const out = {};      // declName -> { file, classes:[], refs:[] }
const byFile = {};   // file -> [declName]

for (const file of files) {
  const rel = file.replace(root + '/', '');
  const sf = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  byFile[rel] = [];
  const record = (name, node) => {
    const { strings, refs } = harvest(node, sf);
    const classes = new Set();
    for (const s of strings) for (const c of classesOf(s)) classes.add(c);
    const prev = out[name];
    const entry = prev && prev.file === rel ? prev : { file: rel, classes: [], refs: [] };
    entry.classes = [...new Set([...entry.classes, ...classes])].sort();
    entry.refs = [...new Set([...entry.refs, ...refs])].filter((r) => r !== name).sort();
    out[name] = entry;
    byFile[rel].push(name);
  };
  ts.forEachChild(sf, (n) => {
    if (ts.isFunctionDeclaration(n) && n.name) record(n.name.text, n);
    else if (ts.isVariableStatement(n)) {
      for (const d of n.declarationList.declarations) if (ts.isIdentifier(d.name) && d.initializer) record(d.name.text, d);
    }
  });
}

// --- resolve identifier references transitively (component -> cva const -> shared base string) ------
const resolved = {};
for (const name of Object.keys(out)) {
  const seen = new Set([name]);
  const stack = [...out[name].refs];
  const classes = new Set(out[name].classes);
  while (stack.length) {
    const r = stack.pop();
    if (seen.has(r) || !out[r]) continue;
    seen.add(r);
    // only follow refs declared in the SAME file — cross-file identifiers are imports (own entry)
    if (out[r].file !== out[name].file) continue;
    for (const c of out[r].classes) classes.add(c);
    stack.push(...out[r].refs);
  }
  resolved[name] = { file: out[name].file, classes: [...classes].sort() };
}

process.stdout.write(JSON.stringify({ decls: resolved, byFile }, null, 1));
