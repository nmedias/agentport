// READ-ONLY use_figma script (file nQSNLASjuLvgTh3we8Dp4s). Paste verbatim into use_figma.
// Returns, per doc Section on page "Components": the API block rows + the property definitions of every
// COMPONENT_SET / standalone COMPONENT inside the section. Save the returned JSON to a file for check.mjs.
// Optional: set ONLY to an array of section names to restrict the dump.
const ONLY = null;
const page = figma.root.children.find(p => p.name === 'Components');
await figma.setCurrentPageAsync(page);
const pv = (props, key) => { const e = Object.entries(props).find(([k]) => k === key || k.startsWith(key + '#')); return e ? e[1].value : undefined; };
const out = {};
for (const sec of page.children.filter(n => n.type === 'SECTION')) {
  if (ONLY && !ONLY.includes(sec.name)) continue;
  const entry = { id: sec.id, eyebrow: null, rows: [], defs: {}, template_hits: [] };
  const apiFrame = sec.findOne(n => n.type === 'FRAME' && n.name === 'api' && n.parent && n.parent.name === 'meta well');
  if (apiFrame) {
    const eb = apiFrame.children.find(c => c.type === 'INSTANCE' && c.name === 'eyebrow');
    if (eb) entry.eyebrow = pv(eb.componentProperties, 'label (children)');
    for (const r of apiFrame.children.filter(c => c.type === 'INSTANCE' && c.name === 'api row')) {
      const p = r.componentProperties;
      entry.rows.push({ id: r.id, property: pv(p, 'property'), values: pv(p, 'values'), code: pv(p, 'code'), figmaOnly: pv(p, 'figmaOnly'), codeOnly: pv(p, 'codeOnly') });
    }
  } else entry.no_api_frame = true;
  const comps = sec.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] });
  for (const c of comps) {
    if (c.type === 'COMPONENT' && c.parent && c.parent.type === 'COMPONENT_SET') continue;
    if (c.name.startsWith('Doc/') || c.name.startsWith('.Doc')) continue;
    const defs = {};
    try {
      for (const [k, d] of Object.entries(c.componentPropertyDefinitions)) defs[k] = d.type === 'VARIANT' ? { kind: 'variant', values: d.variantOptions, def: d.defaultValue } : { kind: d.type.toLowerCase().replace('instance_swap', 'slot'), def: d.defaultValue };
    } catch (e) { defs.__error = String(e); }
    entry.defs[c.name + ' ' + c.id] = defs;
  }
  out[sec.name] = entry;
}
return out;
