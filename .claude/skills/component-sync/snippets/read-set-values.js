// use_figma (READ-ONLY) — dump the live token bindings of a built component set, for component-sync S2.
// Fill PAGE_ID (config.json figma.pageId) + SET_ID (the .<Component> COMPONENT_SET id, S1) before running.
// Returns one row per member: the current Figma truth to diff against the code (S3). Writes nothing.

const PAGE_ID = 'PAGE_ID';   // config.json figma.pageId — resolve by id, NOT a page-name literal (drifts on rename)
const SET_ID = 'SET_ID';

const page = await figma.getNodeByIdAsync(PAGE_ID);
await figma.setCurrentPageAsync(page);
const set = await figma.getNodeByIdAsync(SET_ID);

const nameOf = async (id) => { try { const v = await figma.variables.getVariableByIdAsync(id); return v ? v.name : null; } catch { return null; } };
const bound = async (node, field) => { const bv = node.boundVariables && node.boundVariables[field]; return bv ? await nameOf(bv.id) : null; };
const paint = async (paints) => {
  if (!paints || !paints.length) return null;
  const p = paints[0];
  const v = p.boundVariables && p.boundVariables.color ? await nameOf(p.boundVariables.color.id) : null;
  return { opacity: p.opacity ?? 1, color: p.color, var: v };
};

const out = [];
for (const m of set.children.filter((n) => n.type === 'COMPONENT')) {
  const t = m.findOne((n) => n.type === 'TEXT');
  let text = null;
  if (t) {
    const seg = t.getStyledTextSegments(['fontName', 'fontSize', 'textStyleId']);
    const styleName = seg[0].textStyleId ? (await figma.getStyleByIdAsync(seg[0].textStyleId))?.name : null;
    text = { chars: t.characters, style: styleName, font: seg[0].fontName, size: seg[0].fontSize, fill: await paint(t.fills) };
  }
  const layout = { mode: m.layoutMode };
  if (m.layoutMode === 'HORIZONTAL' || m.layoutMode === 'VERTICAL') {
    layout.gap = m.itemSpacing; layout.gapVar = await bound(m, 'itemSpacing');
    layout.primary = m.primaryAxisAlignItems; layout.counter = m.counterAxisAlignItems;
  } else if (m.layoutMode === 'GRID') {
    layout.rows = m.gridRowCount; layout.cols = m.gridColumnCount;
    layout.rowGap = m.gridRowGap; layout.rowGapVar = await bound(m, 'gridRowGap');
    layout.colGap = m.gridColumnGap; layout.colGapVar = await bound(m, 'gridColumnGap');
  }
  try { layout.sizeH = m.layoutSizingHorizontal; layout.sizeV = m.layoutSizingVertical; } catch {}
  // slot (swappable content): slot geometry + its default child read GENERICALLY by type
  // (vector → fill var · instance → mainComponent · text → text-style/fill) — not just a vector.
  const slotNode = m.findOne((n) => n.type === 'SLOT');
  let slot = null;
  if (slotNode) {
    slot = { name: slotNode.name, w: slotNode.width, h: slotNode.height, mode: slotNode.layoutMode, fills: (slotNode.fills || []).length };
    try { slot.sizeH = slotNode.layoutSizingHorizontal; slot.sizeV = slotNode.layoutSizingVertical; } catch {}
    const c = slotNode.findOne((n) => n.type === 'VECTOR' || n.type === 'INSTANCE' || n.type === 'TEXT');
    if (c) {
      slot.content = { type: c.type, name: c.name, w: c.width, h: c.height };
      if (c.type === 'VECTOR') { const cp = await paint(c.fills); slot.content.fillVar = cp ? cp.var : null; }
      else if (c.type === 'INSTANCE') { const mc = await c.getMainComponentAsync(); slot.content.mainComponent = mc ? mc.name : null; }
      else if (c.type === 'TEXT') { const sg = c.getStyledTextSegments(['textStyleId']); slot.content.style = sg[0].textStyleId ? (await figma.getStyleByIdAsync(sg[0].textStyleId))?.name : null; slot.content.fill = await paint(c.fills); }
    }
  }
  // non-slot indicator shapes (a moving thumb, a selection dot, …): a direct ELLIPSE/RECT/VECTOR
  // child with a bound fill — invisible at member level, so read each separately.
  const inSlot = (n) => { let p = n.parent; while (p && p !== m) { if (p.type === 'SLOT') return true; p = p.parent; } return false; };
  const indicators = [];
  for (const c of m.findAll((n) => n.type === 'ELLIPSE' || n.type === 'RECTANGLE' || n.type === 'VECTOR')) {
    if (inSlot(c)) continue;
    const cp = await paint(c.fills);
    if (cp && cp.var) indicators.push({ type: c.type, name: c.name, x: c.x, fillVar: cp.var, opacity: cp.opacity });
  }
  out.push({
    name: m.name, w: m.width, h: m.height, minW: m.minWidth, minH: m.minHeight, opacity: m.opacity, clips: m.clipsContent, layout,
    radius: m.cornerRadius, radiusVar: await bound(m, 'topLeftRadius'),
    padL: m.paddingLeft, padR: m.paddingRight, padT: m.paddingTop, padB: m.paddingBottom,
    padXVar: await bound(m, 'paddingLeft'), padYVar: await bound(m, 'paddingTop'),
    fill: await paint(m.fills), stroke: await paint(m.strokes), strokeWeight: m.strokeWeight,
    effects: (m.effects || []).map((e) => ({ type: e.type, spread: e.spread, radius: e.radius, color: e.color, visible: e.visible })),
    text, slot, indicators,
  });
}
return { set: set.name, members: out };
