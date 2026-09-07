// READ-ONLY use_figma script (file nQSNLASjuLvgTh3we8Dp4s). Paste verbatim into use_figma.
// Returns, per doc Section on page "Components":
//   a) the TOKEN COLUMN of the meta well — `token row` instances (token + role) and the bare `chip`
//      instances inside the `unroled` frame;
//   b) the LIVE BOUND variables + styles of the section's component definitions.
//
// (b) traverses every COMPONENT_SET / COMPONENT in the section (including private `.`-prefixed base
// sets) and follows INSTANCE children into their main components — a Button binds most of its colours
// on the nested `.Button/Base`, a Command palette on the nested `.Kbd`. Without that hop the bound set
// would be a fraction of what the component actually paints. Doc chrome (`Doc/…`, `.Doc…`) is skipped.
// Nothing is written.
//
// BATCHING: the use_figma response is capped at 20 kB — a full 25-section dump does not fit. Set ONLY
// to a batch of at most ~6 section names (families.json is a good split) and merge the returned
// objects into dumps/figma.json. The output is deliberately compact (arrays, not objects) for this
// reason; check.py reads that shape.
//   roled: [id, token, role, showRole, parentName]
//   bare:  [id, token, showRole, parentName]
//   other: [name, type, parentName]      — unexpected nodes in the column
//   vars:  leaf names of bound `semantic` / `semantic-dimension` variables the section's OWN
//          components bind (roots + anything nested that still lives inside the section)
//   mvars / mstyles: tokens that reach the set ONLY through a nested instance of a DS component that
//          lives OUTSIDE the section (the Buttons inside Dialog). Per the `unroled` criterion
//          (doc-overrides `_fields.unroled`, rule 3) those are not chips at all — they are documented
//          in the member's own section.
//          BOUNDARY (user decision 2026-09-04, second round — supersedes the earlier "own binding
//          wins" tie-break): the walk STOPS at a nested instance of a foreign component. Everything
//          under that instance — including the variant as placed — is the member's, not the
//          section's. Before, `findAll` descended into the placed instance and credited its bindings
//          to the section, which gave Tooltip the trigger Button's primary-fill as an "own" token
//          and let ChoiceCard look as if its own nodes bound the control colours (they do not).
//          Own-vs-member is therefore purely structural now; the editorial exception lives in
//          doc-overrides `<Section>.ownMembers` (see `mby`) and is applied by check.py, not here.
//   mby:   { token: ["First>Deeper", …] } — for every member-only token, the chain of foreign owner
//          names it was reached through (first hop first). check.py treats a token as OWN when any
//          name in one of its chains is listed in the section's `ownMembers` (ChoiceCard lists its
//          controls Checkbox / Switch / RadioGroupItem, so their tokens keep the "nested control"
//          roles while the Field label text stays with Field).
//   msrc:  names of the first-hop foreign main components, so a reviewer can see where a member token came from
//   off:   "name|collection" of bound variables from any OTHER collection (raw primitive bindings —
//          `semantic-typo` is excluded: those are the parts behind a text style, not a chip)
const ONLY = null;
const page = figma.root.children.find(p => p.name === 'Components');
await figma.setCurrentPageAsync(page);

const pv = (props, key) => { const e = Object.entries(props || {}).find(([k]) => k === key || k.startsWith(key + '#')); return e ? e[1].value : undefined; };
const isDoc = n => n.name.startsWith('Doc/') || n.name.startsWith('.Doc');

// --- variable / style name caches (ids are opaque; names are what the chips show) -------------------
const varCache = new Map();
const styleCache = new Map();
async function varInfo(id) {
  if (varCache.has(id)) return varCache.get(id);
  let info = null;
  try {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v) {
      let collection = null;
      try { const c = await figma.variables.getVariableCollectionByIdAsync(v.variableCollectionId); collection = c ? c.name : null; } catch (e) { /* deleted collection */ }
      info = { name: v.name, leaf: v.name.split('/').pop(), collection, type: v.resolvedType };
    }
  } catch (e) { info = { name: null, leaf: null, collection: null, error: String(e) }; }
  varCache.set(id, info);
  return info;
}
async function styleInfo(id) {
  if (styleCache.has(id)) return styleCache.get(id);
  let info = null;
  try { const s = await figma.getStyleByIdAsync(id); if (s) info = { name: s.name, type: s.type }; } catch (e) { info = { name: null, error: String(e) }; }
  styleCache.set(id, info);
  return info;
}

/** every {type:'VARIABLE_ALIAS', id} anywhere inside a boundVariables object */
function aliasIds(obj, acc) {
  if (!obj || typeof obj !== 'object') return acc;
  if (obj.type === 'VARIABLE_ALIAS' && obj.id) { acc.add(obj.id); return acc; }
  for (const v of Object.values(obj)) aliasIds(v, acc);
  return acc;
}

const out = {};
for (const sec of page.children.filter(n => n.type === 'SECTION')) {
  if (ONLY && !ONLY.includes(sec.name)) continue;
  const entry = { id: sec.id, col: 0, unroled: 0, roled: [], bare: [], other: [], vars: [], mvars: [], off: [], styles: [], mstyles: [], sources: [], msrc: [], mby: {} };

  // ---- a) the token column -------------------------------------------------------------------------
  // The column is `meta well > tokens`. Its rows are NOT necessarily direct children: the 2026-09-03
  // re-pack wrapped the roled rows in a nested `Token List` frame, and `unroled` can sit at either
  // level. So search the whole `tokens` subtree by instance name and record each row's parent.
  const col = sec.findOne(n => n.type === 'FRAME' && n.name === 'tokens' && n.parent && n.parent.name === 'meta well');
  if (col) {
    entry.col = 1;
    const inCol = col.findAll(() => true);
    const unroled = inCol.find(n => n.type === 'FRAME' && n.name === 'unroled');
    entry.unroled = unroled ? 1 : 0;
    const underUnroled = n => { let p = n.parent; while (p && p !== col.parent) { if (p === unroled) return true; p = p.parent; } return false; };
    for (const n of inCol) {
      if (n.type !== 'INSTANCE') continue;
      const par = n.parent ? n.parent.name : null;
      if (n.name === 'token row') entry.roled.push([n.id, pv(n.componentProperties, 'token'), pv(n.componentProperties, 'role'), pv(n.componentProperties, 'showRole'), par]);
      else if (n.name === 'chip') entry.bare.push([n.id, pv(n.componentProperties, 'token'), pv(n.componentProperties, 'showRole'), unroled && underUnroled(n) ? 'unroled' : par]);
      else if (n.parent === col || (unroled && n.parent === unroled)) entry.other.push([n.name, n.type, par]);
    }
    if (unroled) for (const ch of unroled.children) if (ch.type !== 'INSTANCE') entry.other.push([ch.name, ch.type, 'unroled']);
  }

  // ---- b) live bound variables + styles of the section's components ---------------------------------
  /* Provenance: every id is collected under a flag saying whether it was reached inside the section
   * (own) or only through a hop into a component that lives elsewhere (member). `visited` is keyed by
   * id + flag so a component reached both ways is walked once per flag. */
  const varIds = new Map(), styleIds = new Map(), visited = new Set();
  /* `chains`: for a member mark, the foreign-owner chain it came through ("Field>Checkbox") */
  const mark = (map, id, member, chain) => {
    const e = map.get(id) || { own: false, member: false, chains: new Set() };
    if (member) { e.member = true; if (chain) e.chains.add(chain); } else e.own = true;
    map.set(id, e);
  };
  const inSection = (n) => { let p = n; while (p) { if (p === sec) return true; p = p.parent; } return false; };
  const ownerOf = async (inst) => {
    let main = null;
    try { main = await inst.getMainComponentAsync(); } catch (e) { /* detached / missing */ }
    if (!main || isDoc(main)) return null;
    return main.parent && main.parent.type === 'COMPONENT_SET' && !isDoc(main.parent) ? main.parent : main;
  };
  const roots = sec.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })
    .filter(c => !(c.type === 'COMPONENT' && c.parent && c.parent.type === 'COMPONENT_SET') && !isDoc(c));
  const queue = roots.map(r => ({ node: r, member: false, chain: '' }));
  for (const r of roots) entry.sources.push(r.name + ' ' + r.id);
  while (queue.length) {
    const { node, member, chain } = queue.shift();
    if (!node || visited.has(node.id + '|' + member)) continue;
    visited.add(node.id + '|' + member);
    /* BOUNDARY walk (see header): under the own flag, do not descend into a nested instance of a
     * foreign component — the instance node itself is still visited (instance-level overrides), and
     * its owner is queued as member; its subtree is credited to the member only. Under the member
     * flag the whole subtree is walked (it is all the member's anyway). */
    const all = [node];
    const stack = node.children ? [...node.children] : [];
    while (stack.length) {
      const c = stack.pop();
      let foreignInst = false;
      if (c.type === 'INSTANCE' && !member) {
        const ow = await ownerOf(c);
        foreignInst = !!ow && !inSection(ow);
        if (foreignInst) {
          /* Slot content: what the section PLACED inside the foreign instance (ChoiceCard drops a
           * Checkbox into its Field's slot) is invisible from the foreign main component, so scan
           * the placed subtree for nested instances and queue their owners as members with the
           * chain "Field>Checkbox". Bindings are still not counted here — the nested instance's
           * own main component is walked under the member flag instead. */
          const inners = c.findAllWithCriteria({ types: ['INSTANCE'] });
          for (const inner of inners) {
            const io = await ownerOf(inner);
            if (io && io !== ow) queue.push({ node: io, member: true, chain: (chain ? chain + '>' : '') + ow.name + '>' + io.name });
          }
          /* Overrides at placement: a paint / style the SECTION overrode on a node inside the
           * placed foreign instance (ChoiceCard binds the label inside its Field to accent-ink for
           * the checked card title) is the section's own design decision, not the member's. The
           * member walk never sees it (it reads Field's template), so harvest exactly the
           * overridden fields here, under the own flag. Non-overridden bindings of that node stay
           * the member's. Figma records an override on the NEAREST enclosing instance (the Label
           * inside the Field, not the Field), so read `overrides` of the boundary instance and of
           * every instance nested in it. */
          let ovs = [];
          for (const holder of [c, ...inners]) { try { ovs = ovs.concat(holder.overrides || []); } catch (e) { /* no overrides */ } }
          for (const o of ovs) {
            const f = o.overriddenFields || [];
            let n = null; try { n = await figma.getNodeByIdAsync(o.id); } catch (e) { n = null; }
            if (!n || isDoc(n)) continue;
            const acc = new Set();
            if (f.includes('boundVariables')) { try { aliasIds(n.boundVariables, acc); } catch (e) { /* no boundVariables */ } }
            for (const k of ['fills', 'strokes', 'effects']) {
              if (!f.includes(k)) continue;
              let arr; try { arr = n[k]; } catch (e) { arr = null; }
              if (Array.isArray(arr)) for (const p of arr) aliasIds(p && p.boundVariables, acc);
            }
            for (const id of acc) mark(varIds, id, false, '');
            for (const k of ['textStyleId', 'effectStyleId', 'fillStyleId', 'strokeStyleId']) {
              if (!f.includes(k)) continue;
              let sid; try { sid = n[k]; } catch (e) { sid = null; }
              if (typeof sid === 'string' && sid) mark(styleIds, sid, false, '');
            }
          }
        }
      }
      all.push(c);
      if (!foreignInst && c.children) stack.push(...c.children);
    }
    for (const n of all) {
      if (visited.has(n.id + '|' + member) && n !== node) continue;
      visited.add(n.id + '|' + member);
      if (isDoc(n)) continue;
      const acc = new Set();
      try { aliasIds(n.boundVariables, acc); } catch (e) { /* node type without boundVariables */ }
      for (const k of ['fills', 'strokes', 'effects']) {
        let arr; try { arr = n[k]; } catch (e) { arr = null; }
        if (Array.isArray(arr)) for (const p of arr) aliasIds(p && p.boundVariables, acc);
      }
      for (const id of acc) mark(varIds, id, member, chain);
      for (const k of ['textStyleId', 'effectStyleId', 'fillStyleId', 'strokeStyleId', 'gridStyleId']) {
        let sid; try { sid = n[k]; } catch (e) { sid = null; }
        if (typeof sid === 'string' && sid) mark(styleIds, sid, member, chain);
      }
      if (n.type === 'INSTANCE') {
        const owner = await ownerOf(n);
        if (owner) {
          const foreign = member || !inSection(owner);
          if (foreign && !member) entry.msrc.push(owner.name);
          const next = foreign ? (chain ? chain + '>' + owner.name : owner.name) : chain;
          queue.push({ node: owner, member: foreign, chain: next });
        }
      }
    }
  }
  const by = (tok, o) => { if (!o.own) entry.mby[tok] = [...new Set([...(entry.mby[tok] || []), ...o.chains])].sort(); };
  for (const [id, o] of varIds) {
    const i = await varInfo(id);
    if (!i || !i.name) continue;
    if (i.collection === 'semantic' || i.collection === 'semantic-dimension') { (o.own ? entry.vars : entry.mvars).push(i.leaf); by(i.leaf, o); }
    else if (i.collection !== 'semantic-typo' && o.own) entry.off.push(i.name + '|' + i.collection);
  }
  for (const [id, o] of styleIds) {
    const i = await styleInfo(id);
    if (!i || !i.name) continue;
    const pre = i.type === 'TEXT' ? 'text:' : i.type === 'EFFECT' ? 'effect:' : String(i.type).toLowerCase() + ':';
    (o.own ? entry.styles : entry.mstyles).push(pre + i.name); by(pre + i.name, o);
  }
  entry.vars = [...new Set(entry.vars)].sort();
  entry.styles = [...new Set(entry.styles)].sort();
  entry.off = [...new Set(entry.off)].sort();
  entry.msrc = [...new Set(entry.msrc)].sort();
  /* member-only = reached exclusively through a foreign component */
  entry.mvars = [...new Set(entry.mvars)].filter(t => entry.vars.indexOf(t) < 0).sort();
  entry.mstyles = [...new Set(entry.mstyles)].filter(t => entry.styles.indexOf(t) < 0).sort();
  for (const t of Object.keys(entry.mby)) if (entry.vars.indexOf(t) >= 0 || entry.styles.indexOf(t) >= 0) delete entry.mby[t];
  out[sec.name] = entry;
}
return out;
