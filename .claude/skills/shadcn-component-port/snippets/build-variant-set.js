// use_figma — parameterized skeleton for a token-bound component set.
// Generalised from the Button pilot, extended for FIELD-type components (Input/Textarea).
// Fill the CFG below from your T3 mapping table (variable IDs from recon.js).
// Split across calls if > ~10 components (atomic, ≤10 ops).
//
// Each VARIANT: { props: {a, b}, fillVar?, strokeVar?, textVar?, underline?, height,
//                 padXVar?, padYVar?, gapVar?, radiusVar, label?, iconSvg?,
//                 width?, align?, fillText?, effect?, opacity?, clip? }
//   - props      → component name "a=…, b=…" (combineAsVariants derives the properties)
//   - fillVar/strokeVar/textVar → DS variable IDs; omit fillVar for transparent (ghost/link)
//   - height     → numeric px (control geometry, NOT a token)
//   - padXVar/padYVar/gapVar/radiusVar → DS variable IDs (GAP-scoped spacing covers padding+gap)
//   - label      → text (text/field variants); iconSvg → 16px svg string (icon variants)
//
//   FIELD extras (Input/Textarea — left-aligned, fixed-width, value/placeholder text + states):
//   - width      → numeric px → FIXED width (a field has a set width). Omit → HUG (button label) / square (icon).
//   - align      → 'MIN' | 'CENTER' | 'MAX' on the primary axis (default 'CENTER'). Fields = 'MIN' (left).
//   - fillText   → true: the text child FILLs the width and truncates (ENDING, 1 line) — for value/placeholder.
//   - effect     → a Figma effect object (e.g. focus ring drop-shadow {type:'DROP_SHADOW',spread:3,…}).
//   - opacity    → node opacity for a state (e.g. 0.5 for disabled).
//   - clip       → clipsContent=true on the member: an effect's SPREAD renders only when the effect-bearing
//                  node clips (the set stays clipsContent=false, below, so the ring is not clipped away).

const CFG = {
  pageId: 'PAGE_ID',          // Components page (recon.js)
  sectionId: 'SECTION_ID',    // target Section (create via /figma-create-section if absent)
  setName: '.Component',
  textStyleId: 'TEXT_STYLE_ID', // e.g. Label (button) / Body (field) format
  font: { family: 'Hanken Grotesk', style: 'Medium' }, // the text style's font (Body → Regular)
  variants: [
    // BUTTON: { props: { variant:'default', size:'default' }, fillVar:'…', textVar:'…',
    //          height:36, padXVar:'…', gapVar:'…', radiusVar:'…', label:'Button' },
    // FIELD:  { props: { state:'default' }, fillVar:'…', strokeVar:'…', textVar:'…',
    //          height:36, width:240, align:'MIN', padXVar:'…', padYVar:'…', radiusVar:'…',
    //          label:'Search…', fillText:true },
    // FIELD focus: …, strokeVar:'<ring>', effect:RING_FX, clip:true   // disabled: …, opacity:0.5
  ],
};

const page = await figma.getNodeByIdAsync(CFG.pageId);
await figma.setCurrentPageAsync(page);
await figma.loadFontAsync(CFG.font);
const section = await figma.getNodeByIdAsync(CFG.sectionId);
const V = async (id) => (id ? await figma.variables.getVariableByIdAsync(id) : null);
const bindPaint = (variable) =>
  figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', variable);

const comps = [];
let x = 2000, y = 2000;
for (const v of CFG.variants) {
  const c = figma.createComponent();
  c.name = Object.entries(v.props).map(([k, val]) => `${k}=${val}`).join(', ');
  c.layoutMode = 'HORIZONTAL';
  c.primaryAxisAlignItems = v.align || 'CENTER';
  c.counterAxisAlignItems = 'CENTER';
  c.x = x; c.y = y; x += 240; if (x > 4000) { x = 2000; y += 200; }

  // content: label (text/field) or icon
  let textNode = null;
  if (v.label != null) {
    const t = figma.createText();
    t.characters = v.label;
    await t.setTextStyleIdAsync(CFG.textStyleId);
    if (v.textVar) t.fills = [bindPaint(await V(v.textVar))];
    if (v.underline) t.textDecoration = 'UNDERLINE';
    c.appendChild(t);
    textNode = t;
  } else if (v.iconSvg) {
    const icon = figma.createNodeFromSvg(v.iconSvg);
    icon.name = 'icon';
    const vec = icon.findOne((n) => n.type === 'VECTOR');
    if (vec && v.textVar) vec.fills = [bindPaint(await V(v.textVar))];
    c.appendChild(icon);
    icon.constraints = { horizontal: 'CENTER', vertical: 'CENTER' };
  }

  // surface / border
  c.fills = v.fillVar ? [bindPaint(await V(v.fillVar))] : [];
  if (v.strokeVar) { c.strokes = [bindPaint(await V(v.strokeVar))]; c.strokeWeight = 1; c.strokeAlign = 'INSIDE'; }

  // radius + padding + gap (bound)
  const rv = await V(v.radiusVar);
  for (const f of ['topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius']) c.setBoundVariable(f, rv);
  if (v.padXVar) { const p = await V(v.padXVar); c.setBoundVariable('paddingLeft', p); c.setBoundVariable('paddingRight', p); }
  if (v.padYVar) { const p = await V(v.padYVar); c.setBoundVariable('paddingTop', p); c.setBoundVariable('paddingBottom', p); }
  if (v.gapVar) c.setBoundVariable('itemSpacing', await V(v.gapVar));

  // sizing: width FIXED (field) / HUG (button label) / square (icon); height numeric
  const fixedW = v.width != null;
  c.resize(fixedW ? v.width : (v.label != null ? 200 : v.height), v.height);
  c.layoutSizingHorizontal = fixedW ? 'FIXED' : (v.label != null ? 'HUG' : 'FIXED');
  c.layoutSizingVertical = 'FIXED';

  // field text: FILL the width + truncate (only valid once the parent width is set, above)
  if (textNode && v.fillText) {
    textNode.layoutSizingHorizontal = 'FILL';
    textNode.layoutSizingVertical = 'HUG';
    textNode.textTruncation = 'ENDING';
    textNode.maxLines = 1;
  }

  // state extras
  if (v.effect) c.effects = [v.effect];
  if (v.opacity != null) c.opacity = v.opacity;
  if (v.clip) c.clipsContent = true; // spread of an effect renders only when the effect-bearing node clips

  comps.push(c);
}

// combine only once all components exist (across calls: combine in the final call)
const set = figma.combineAsVariants(comps, section);
set.name = CFG.setName;
set.layoutMode = 'HORIZONTAL'; set.layoutWrap = 'WRAP';
set.primaryAxisSizingMode = 'AUTO'; set.counterAxisSizingMode = 'AUTO'; // hug content + padding (else HUG members silently drop vertical padding)
set.itemSpacing = 24; set.counterAxisSpacing = 24; set.counterAxisAlignItems = 'CENTER';
set.paddingLeft = set.paddingRight = set.paddingTop = set.paddingBottom = 32;
set.clipsContent = false; // keep false so member focus/invalid rings (clip:true) are not clipped by the set

// place the set in the Section — coords are SECTION-RELATIVE (never section.absoluteBoundingBox.x + …)
set.x = 80; set.y = 120; // below the Section headline
section.resizeWithoutConstraints(set.x + set.width + 80, set.y + set.height + 80); // Sections don't auto-grow → fit W+H

return { setId: set.id, componentIds: comps.map((c) => c.id), props: Object.keys(set.componentPropertyDefinitions || {}) };
