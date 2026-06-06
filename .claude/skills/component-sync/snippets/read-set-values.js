// use_figma (READ-ONLY) — dump the live token bindings of a built component set, for component-sync S2.
// Fill SET_ID with the .<Component> COMPONENT_SET node id (resolved by name in S1).
// Returns one row per member: the current Figma truth to diff against the code (S3). Writes nothing.

const SET_ID = 'SET_ID';

const page = figma.root.children.find((p) => p.name === 'Components');
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
  out.push({
    name: m.name, w: m.width, h: m.height, opacity: m.opacity, clips: m.clipsContent,
    radius: m.cornerRadius, radiusVar: await bound(m, 'topLeftRadius'),
    padL: m.paddingLeft, padR: m.paddingRight, padT: m.paddingTop, padB: m.paddingBottom,
    padXVar: await bound(m, 'paddingLeft'), padYVar: await bound(m, 'paddingTop'),
    fill: await paint(m.fills), stroke: await paint(m.strokes), strokeWeight: m.strokeWeight,
    effects: (m.effects || []).map((e) => ({ type: e.type, spread: e.spread, radius: e.radius, color: e.color, visible: e.visible })),
    text,
  });
}
return { set: set.name, members: out };
