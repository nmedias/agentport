#!/usr/bin/env python3
"""Merge one or more worker role deltas into doc-overrides.json (token round, 2026-09-04).

usage: merge-overrides.py <delta.json> [<delta.json> …] [--base <doc-overrides.json>] [-o <out.json>]

A delta is `{ "<Section>": { "roles": { token: role, … } }, … }` — the FULL replacement of that
section's `roles` block, keys in display order (chipPlan() shows roled rows in key order). Every
other field of the section block is kept untouched. Without `-o` the merged JSON goes to stdout, so a
worker can feed it to `check.py --overrides` without touching the shared file:

    python3 merge-overrides.py <pkg>/roles-delta.json -o /tmp/overrides-<pkg>.json
    python3 check.py --only A,B --overrides /tmp/overrides-<pkg>.json --figma dumps/figma-<pkg>.json

The controller runs the same script with `-o tools/figma-doc/doc-overrides.json` once per package
after review. Formatting follows the existing file (2-space indent, non-ASCII kept).
"""
import argparse
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_BASE = os.path.join(HERE, '..', 'figma-doc', 'doc-overrides.json')

ap = argparse.ArgumentParser()
ap.add_argument('deltas', nargs='+')
ap.add_argument('--base', default=DEFAULT_BASE)
ap.add_argument('-o', '--out', default=None)
a = ap.parse_args()

base = json.load(open(a.base))
for path in a.deltas:
    delta = json.load(open(path))
    for sec, block in delta.items():
        if sec.startswith('_'):
            raise SystemExit(f'{path}: a delta never touches {sec}')
        if sec not in base:
            raise SystemExit(f'{path}: unknown section {sec}')
        if set(block) != {'roles'}:
            raise SystemExit(f'{path}: {sec} may only carry "roles", got {sorted(block)}')
        base[sec]['roles'] = block['roles']

text = json.dumps(base, indent=2, ensure_ascii=False) + '\n'
if a.out:
    open(a.out, 'w').write(text)
else:
    print(text, end='')
