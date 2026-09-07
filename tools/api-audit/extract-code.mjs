// Deterministic code-side extraction for the doc-section API audit.
// For every libs/ui/src/components/ui/<name>/<name>.tsx (and choice-card sub-folders) in agentport:
//   - each `interface XProps` / `type XProps`: own declared members (name, type text, optional, jsdoc, @default)
//   - each `cva(...)` call: variant keys + options + defaultVariants
//   - exported identifiers
// Usage: node extract-code.mjs <agentportRoot> > code.json
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';

const root = process.argv[2] || `${process.env.HOME}/Dev/agentport`;
const require = createRequire(join(root, 'package.json'));
const ts = require('typescript');

const uiDir = join(root, 'libs/ui/src/components/ui');
const files = [];
for (const d of readdirSync(uiDir)) {
  const dir = join(uiDir, d);
  if (!statSync(dir).isDirectory()) continue;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) { for (const g of readdirSync(p)) if (/\.tsx$/.test(g) && !/\.(stories|spec)\.tsx$/.test(g)) files.push(join(p, g)); }
    else if (/\.tsx$/.test(f) && !/\.(stories|spec)\.tsx$/.test(f)) files.push(p);
  }
}

// strip `x as const`, `x satisfies T`, `(x)` wrappers
function unwrap(e) { while (e && (ts.isAsExpression(e) || ts.isSatisfiesExpression?.(e) || ts.isParenthesizedExpression(e) || e.kind === ts.SyntaxKind.SatisfiesExpression)) e = e.expression; return e; }
function jsdocOf(node) {
  const docs = ts.getJSDocCommentsAndTags(node);
  let text = '', def;
  for (const d of docs) {
    if (d.kind === ts.SyntaxKind.JSDoc) {
      if (d.comment) text += typeof d.comment === 'string' ? d.comment : d.comment.map(c => c.text).join('');
      for (const t of d.tags || []) if (t.tagName.text === 'default') def = typeof t.comment === 'string' ? t.comment : (t.comment || []).map(c => c.text).join('');
    }
  }
  return { doc: text.trim(), def };
}

const out = {};
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const comp = { file: file.replace(root + '/', ''), props: {}, cva: {}, exports: [] };
  const visit = (n) => {
    if (ts.isInterfaceDeclaration(n) || (ts.isTypeAliasDeclaration(n) && ts.isTypeLiteralNode(n.type))) {
      const name = n.name.text;
      const members = ts.isInterfaceDeclaration(n) ? n.members : n.type.members;
      const list = [];
      for (const m of members) {
        if (!ts.isPropertySignature(m) || !m.name) continue;
        const pname = m.name.text ?? m.name.getText(sf);
        const { doc, def } = jsdocOf(m);
        list.push({ name: pname, type: m.type ? m.type.getText(sf).replace(/\s+/g, ' ') : 'unknown', optional: !!m.questionToken, doc, default: def });
      }
      const ext = ts.isInterfaceDeclaration(n) && n.heritageClauses ? n.heritageClauses.map(h => h.types.map(t => t.getText(sf).replace(/\s+/g, ' ')).join(', ')).join(' ') : undefined;
      comp.props[name] = { extends: ext, members: list };
    }
    if (ts.isTypeAliasDeclaration(n) && ts.isIntersectionTypeNode(n.type)) {
      // e.g. ButtonProps = ButtonBaseProps & (...)
      comp.props[n.name.text] = { alias: n.type.getText(sf).replace(/\s+/g, ' '), members: [] };
    }
    if (ts.isCallExpression(n) && n.expression.getText(sf) === 'cva') {
      let varName = 'cva';
      if (ts.isVariableDeclaration(n.parent)) varName = n.parent.name.getText(sf);
      const cfg = n.arguments[1];
      const entry = { variants: {}, defaultVariants: {} };
      if (cfg && ts.isObjectLiteralExpression(cfg)) {
        for (const p of cfg.properties) {
          if (!ts.isPropertyAssignment(p)) continue;
          const key = p.name.getText(sf);
          const init = unwrap(p.initializer);
          if (key === 'variants' && ts.isObjectLiteralExpression(init)) {
            for (const v of init.properties) { const vi = ts.isPropertyAssignment(v) ? unwrap(v.initializer) : null; if (vi && ts.isObjectLiteralExpression(vi))
              entry.variants[v.name.getText(sf)] = vi.properties.map(o => o.name.getText(sf).replace(/^['"]|['"]$/g, '')); }
          }
          if (key === 'defaultVariants' && ts.isObjectLiteralExpression(init)) {
            for (const v of init.properties) if (ts.isPropertyAssignment(v)) entry.defaultVariants[v.name.getText(sf)] = v.initializer.getText(sf).replace(/^['"]|['"]$/g, '');
          }
        }
      }
      comp.cva[varName] = entry;
    }
    if (ts.isExportDeclaration(n) && n.exportClause && ts.isNamedExports(n.exportClause)) for (const e of n.exportClause.elements) comp.exports.push(e.name.text);
    ts.forEachChild(n, visit);
  };
  visit(sf);
  // function components: name -> props type text
  comp.components = {};
  ts.forEachChild(sf, (n) => {
    if (ts.isFunctionDeclaration(n) && n.name && /^[A-Z]/.test(n.name.text)) {
      const p = n.parameters[0];
      comp.components[n.name.text] = p && p.type ? p.type.getText(sf).replace(/\s+/g, ' ') : null;
    }
  });
  out[comp.file] = comp;
}
process.stdout.write(JSON.stringify(out, null, 1));
