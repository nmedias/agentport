// use_figma script (file nQSNLASjuLvgTh3we8Dp4s) — refresh the token-column eyebrow of the doc sections.
// The builder (tools/figma-doc/build-section.snippet.js, phase `meta`) labels the column
// `Tokens · <vars> vars · <styles> styles` from the catalog entry's figma.vars / figma.styles lengths.
// After the token round changed the chips, the labels went stale (Table said "17 VARS" over 7 chips).
// Fill COUNTS from the merged catalog, e.g.
//   python3 - <<'EOF'
//   import re, yaml, json
//   t = open('~/Dev/agentport/design-docs/design-system/components-reference.md'.replace('~', __import__('os').path.expanduser('~'))).read()
//   cat = [b for b in (yaml.safe_load(m.group(1)) for m in re.finditer(r'```yaml\n([\s\S]*?)```', t)) if isinstance(b, list)][-1]
//   print(json.dumps({e['name']: [len(e['figma'].get('vars') or []), len(e['figma'].get('styles') or [])] for e in cat}))
//   EOF
// Only the eyebrow's `label (children)` text property is written; nothing else changes.
const COUNTS = {};
const page = figma.root.children.find(p => p.name === 'Components');
await figma.setCurrentPageAsync(page);
const pv = (props, key) => Object.keys(props || {}).find(k => k === key || k.startsWith(key + '#'));
const done = [], skipped = [];
for (const sec of page.children.filter(n => n.type === 'SECTION')) {
  const c = COUNTS[sec.name];
  if (!c) { skipped.push(sec.name + ' (no count)'); continue; }
  const col = sec.findOne(n => n.type === 'FRAME' && n.name === 'tokens' && n.parent && n.parent.name === 'meta well');
  const eb = col && col.children.find(n => n.type === 'INSTANCE' && n.name === 'eyebrow');
  if (!eb) { skipped.push(sec.name + ' (no eyebrow)'); continue; }
  const key = pv(eb.componentProperties, 'label (children)');
  if (!key) { skipped.push(sec.name + ' (no label prop)'); continue; }
  const label = `Tokens · ${c[0]} vars · ${c[1]} styles`;
  if (eb.componentProperties[key].value !== label) { eb.setProperties({ [key]: label }); done.push([sec.name, eb.id, label]); }
}
return { mutatedNodeIds: done.map(d => d[1]), done, skipped };
