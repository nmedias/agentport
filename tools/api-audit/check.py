#!/usr/bin/env python3
"""Deterministic audit of doc-section API blocks: catalog (components-reference.md) vs Figma dump vs code extract.

usage: check.py --catalog <components-reference.md> --code <code.json> --figma <figma.json> [--only A,B,C] [--stories-root <agentport/>]
exit 0 = all PASS, 1 = at least one FAIL. Prints one line per check: PASS|FAIL <Component> <check-id> <detail>.

MAIN COMPONENT ONLY (user decision 2026-09-03): no `of` rows. Figma side = the component named like the section
(override figma.api_component only when that one has zero controls); code side = the export named like the entry
(override code.api_export).
  figma.api rows:  {name, kind: variant|text|boolean|slot, values?, id?, code: <prop> | <Export>.<prop> | children | live-state | none, triggers?, note?}
  code.props rows: {name, type?, default?, figma: <api name> | 'name=value' | 'a + b' | none, curated?, note?}
  Figma doc rows:  property label = api name; merged rows join names with ' + '; code-only rows: label = prop name.
"""
import argparse, json, re, sys, yaml

ap = argparse.ArgumentParser()
ap.add_argument('--catalog', required=True); ap.add_argument('--code', required=True); ap.add_argument('--figma', required=True)
ap.add_argument('--only', default=None); ap.add_argument('--stories-root', default=None)
a = ap.parse_args()

cat_text = open(a.catalog).read()
code = json.load(open(a.code)); figma = json.load(open(a.figma))
only = set(a.only.split(',')) if a.only else None
fails = 0
def out(ok, comp, cid, detail=''):
    global fails
    if not ok: fails += 1
    print(('PASS' if ok else 'FAIL'), comp, cid, detail)

# ---- parse catalog entries (stop at next entry, a closing code fence, or EOF) ----------------------------
entries = {}
for m in re.finditer(r'^- name: (\w+)\n(.*?)(?=^- name: |^```|\Z)', cat_text, re.S | re.M):
    name = m.group(1)
    try: entries[name] = yaml.safe_load('- name: %s\n%s' % (name, m.group(2)))[0]
    except Exception as e: entries[name] = {'__error': str(e)}

# ---- code index: component name -> {props, cva, cva_defaults, file} ---------------------------------------
code_idx = {}
for f, c in code.items():
    props_by_iface = c['props']; comps = c.get('components', {})
    for cname, ptype in comps.items():
        members = {}
        if ptype and ptype in props_by_iface:
            for mem in props_by_iface[ptype]['members']: members[mem['name']] = mem
        if ptype and ptype in props_by_iface and not props_by_iface[ptype]['members']:
            for iname, idef in props_by_iface.items():
                if iname != ptype and iname.startswith(cname) and idef['members']:
                    for mem in idef['members']: members[mem['name']] = mem
        code_idx[cname] = {'props': members, 'cva': {}, 'cva_defaults': {}, 'file': f}
    for vname, v in c['cva'].items():
        base = re.sub(r'Variants$', '', vname); base = base[0].upper() + base[1:]
        if base in code_idx: code_idx[base]['cva'] = v['variants']; code_idx[base]['cva_defaults'] = v['defaultVariants']

def split_names(s): return [t.strip() for t in re.split(r'\s\+\s', s)]

for comp in sorted(entries):
    if only and comp not in only: continue
    e = entries[comp]
    if '__error' in e: out(False, comp, 'C1-yaml', e['__error']); continue
    fg = e.get('figma', {}) or {}; cd = e.get('code', {}) or {}
    api = fg.get('api'); cprops = cd.get('props')
    out(isinstance(api, list), comp, 'C1-api-present', 'figma.api must be a list')
    out(isinstance(cprops, list), comp, 'C1-props-present', 'code.props must be a list')
    out('axis' not in fg and 'properties' not in fg and not isinstance(fg.get('props'), str), comp, 'C1-legacy-removed', 'figma.axis / figma.properties / string figma.props must be gone')
    if not isinstance(api, list) or not isinstance(cprops, list): continue
    fdump = figma.get(comp)
    if not fdump: out(False, comp, 'C2-figma-dump', 'section missing in figma dump'); continue
    defs = {}
    for key, d in fdump['defs'].items():
        cname = key.rsplit(' ', 1)[0]
        if cname.startswith('.'): continue
        defs[cname] = d
    # ---- C1 scope: main component / main export only -------------------------------------------------------
    main_fig = fg.get('api_component', comp); main_exp = cd.get('api_export', comp)
    out(all('of' not in r for r in api), comp, 'C1-main-only', 'figma.api rows must not carry `of` (main component only)')
    out(all('of' not in p for p in cprops), comp, 'C1-main-only', 'code.props rows must not carry `of` (main export only)')
    if fg.get('api_component'):
        mc = defs.get(comp, {})
        out(len([k for k in mc if k != '__error']) == 0, comp, 'C1-override', f'api_component override only allowed when "{comp}" has no controls; it has {list(mc)}')
        out(main_fig in defs, comp, 'C1-override', f'api_component "{main_fig}" not in section defs {list(defs)}')
    if cd.get('api_export'):
        ci0 = code_idx.get(comp)
        out(ci0 is None or (not ci0['props'] and not ci0['cva']), comp, 'C1-override', f'api_export override only allowed when export "{comp}" has no documented props')
    # ---- C2: each api row ↔ a live definition on the main component --------------------------------------
    covered = set(); api_names = {}
    for r in api:
        nm = r.get('name'); kind = r.get('kind'); label = nm
        api_names[label] = r
        d = defs.get(main_fig)
        if d is None: out(False, comp, 'C2-main', f'{label}: Figma component "{main_fig}" not in section defs {list(defs)}'); continue
        match = None
        for k, dd in d.items():
            base, _, pid = k.partition('#')
            if base == nm and dd['kind'] == kind: match = (k, dd, pid); break
        if not match: out(False, comp, 'C2-row', f'{label}: no {kind} property "{nm}" on {main_fig}; live keys {list(d)}'); continue
        k, dd, pid = match; covered.add(k)
        if kind == 'variant':
            out(sorted(r.get('values', [])) == sorted(dd['values']), comp, 'C2-values', f'{label}: catalog {r.get("values")} vs Figma {dd["values"]}')
            out('id' not in r, comp, 'C2-variant-no-id', f'{label}: variants carry no id')
        else:
            out(str(r.get('id')) == pid, comp, 'C2-id', f'{label}: catalog id {r.get("id")} vs Figma {pid}')
        cv = r.get('code')
        out(cv is not None, comp, 'C4-code-field', f'{label}: code missing')
        if cv == 'live-state': out(bool(r.get('triggers')), comp, 'C4-triggers', f'{label}: live-state needs triggers')
    for k in defs.get(main_fig, {}):
        if k == '__error': continue
        out(k in covered, comp, 'C2-complete', f'Figma {main_fig} property "{k}" has no figma.api row')
    # ---- C3: code.props ↔ code extract (main export) -------------------------------------------------------
    cnames = {}
    ci = code_idx.get(main_exp)
    out(ci is not None, comp, 'C3-main-export', f'no code component "{main_exp}"')
    for p in cprops:
        nm = p.get('name'); label = nm; cnames[label] = p
        if ci is None: continue
        in_iface = nm in ci['props']; in_cva = nm in ci['cva']
        if p.get('curated'):
            st = ci['file'].replace('.tsx', '.stories.tsx')
            try: stxt = open((a.stories_root or '') + st).read()
            except Exception: stxt = ''
            out(f"'{nm}'" in stxt or f'"{nm}"' in stxt or f'{nm}:' in stxt, comp, 'C3-curated', f'{label}: curated prop not found in story argTypes {st}')
        else:
            out(in_iface or in_cva, comp, 'C3-prop', f'{label}: not a JSDoc member of {main_exp}\'s props interface nor a cva axis; members {list(ci["props"])} cva {list(ci["cva"])}')
        if in_iface and ci['props'][nm].get('default') is not None and 'default' in p:
            out(str(p['default']).strip('"\'').lower() == str(ci['props'][nm]['default']).strip('"\'').lower(), comp, 'C3-default', f'{label}: catalog default {p.get("default")} vs JSDoc {ci["props"][nm]["default"]}')
        if in_cva and 'default' in p and ci.get('cva_defaults', {}).get(nm) is not None:
            out(str(p['default']) == str(ci['cva_defaults'][nm]), comp, 'C3-cva-default', f'{label}: catalog default {p.get("default")} vs cva {ci["cva_defaults"][nm]}')
        fgv = p.get('figma')
        out(fgv is not None, comp, 'C4-figma-field', f'{label}: figma missing')
        if fgv and fgv != 'none':
            for tok in re.split(r'\s\+\s', str(fgv)):
                base = tok.split('=')[0].strip()
                out(base in api_names, comp, 'C4-figma-ref', f'{label}: figma "{tok}" does not name a figma.api row')
    if ci:
        for nm in list(ci['props']) + list(ci['cva']):
            out(nm in cnames, comp, 'C3-complete', f'code {main_exp}.{nm} has no code.props row')
    # ---- C4: api.code targets exist ----------------------------------------------------------------------
    for label, r in api_names.items():
        cv = r.get('code')
        if cv in (None, 'live-state', 'none', 'children'): continue
        for tok in re.split(r'\s/\s', str(cv)):
            t = tok.strip()
            if t == 'children': continue
            if '.' in t:
                ex, _, pn = t.partition('.'); ci2 = code_idx.get(ex)
                out(bool(ci2) and (pn in ci2['props'] or pn in ci2['cva']), comp, 'C4-code-ext', f'{label}: external prop "{t}" not found in code'); continue
            out(t in cnames, comp, 'C4-code-ref', f'{label}: code "{t}" is not a code.props row')
    # ---- C5: Figma doc rows --------------------------------------------------------------------------------
    rows = fdump['rows']
    out(not fdump.get('no_api_frame'), comp, 'C5-api-frame', 'section has no api frame in the meta well')
    seen_api = set(); seen_code_only = set()
    for r in rows:
        prop = r['property'] or ''; parts = split_names(prop); txt = (r['code'] or '')
        out('FIGMA-ONLY' not in txt and 'CODE-ONLY' not in txt, comp, 'C5-no-suffix', f'row "{prop}": chip text in code column')
        out(not txt.startswith('pseudo-state ('), comp, 'C5-no-template', f'row "{prop}": generic pseudo-state template')
        out(txt.strip() not in ('', '—', '-'), comp, 'C5-code-text', f'row "{prop}": empty code column')
        if all(p in api_names for p in parts):
            seen_api.update(parts)
            codes = [api_names[p].get('code') for p in parts]
            should_fo = all(c in ('live-state', 'none') for c in codes)
            out(bool(r['figmaOnly']) == should_fo, comp, 'C5-chip-figma', f'row "{prop}": figmaOnly={r["figmaOnly"]} but api.code={codes}')
            out(not r['codeOnly'], comp, 'C5-chip-code', f'row "{prop}": codeOnly must be off for a Figma control')
            if len(parts) == 1 and api_names[prop].get('kind') == 'variant':
                exp = ' · '.join(api_names[prop].get('values', []))
                out((r['values'] or '').strip() == exp, comp, 'C5-values-text', f'row "{prop}": "{r["values"]}" ≠ "{exp}"')
        elif prop in cnames and cnames[prop].get('figma') == 'none':
            seen_code_only.add(prop)
            out(bool(r['codeOnly']) and not r['figmaOnly'], comp, 'C5-chip-code-only', f'row "{prop}": needs codeOnly on, figmaOnly off')
        else:
            out(False, comp, 'C5-row-unknown', f'row "{prop}" matches neither figma.api nor a code-only code.props row')
    for label in api_names: out(label in seen_api, comp, 'C5-row-missing', f'figma.api "{label}" has no doc row')
    for label, p in cnames.items():
        if p.get('figma') == 'none': out(label in seen_code_only, comp, 'C5-row-missing-code-only', f'code-only "{label}" has no doc row')
    n_api = len(api_names); n_co = sum(1 for p in cnames.values() if p.get('figma') == 'none')
    exp_eb = f'API · {n_api} Figma control{"s" if n_api != 1 else ""} · {n_co} code-only prop{"s" if n_co != 1 else ""}'
    out(fdump.get('eyebrow') == exp_eb, comp, 'C5-eyebrow', f'"{fdump.get("eyebrow")}" ≠ "{exp_eb}"')
    # ---- C6: hygiene ---------------------------------------------------------------------------------------
    blob = json.dumps(api) + json.dumps(cprops) + json.dumps(rows)
    out(not re.search(r'[äöüßÄÖÜ]', blob), comp, 'C6-english', 'non-English characters')

print(f'\n{"ALL PASS" if fails == 0 else str(fails) + " FAIL"}')
sys.exit(1 if fails else 0)
