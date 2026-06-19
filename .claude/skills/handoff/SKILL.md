---
name: handoff
description: Use this skill to write `handoff.md` — a session-end doc that lets another Claude instance, or the user returning cold tomorrow or next week, resume work without reading any chat scrollback. Captures goal, current state, uncommitted/changed files, what failed, and next steps. Trigger on "handoff", "handoff.md", "session writeup", "session summary", or any request to freeze the current session into a markdown someone resumes from. Do NOT trigger for PR descriptions, commit messages, release notes, postmortems, or cleanup tasks.
argument-hint: [slug] [lang]
arguments: slug lang
disable-model-invocation: true
---

# Handoff

Writes `handoff.md` at project root for another instance / future-self to resume cold.

**Skip:** trivial chat, single-shot task, artefact already covers it (PR description, runlog).

## Workflow

```
0.  named args (declared in `arguments:` frontmatter; both optional — defaults handled here):
      slug = $slug if passed → slugify (lowercase, kebab, strip filename-unsafe chars)
             else → derive from the session topic (the one-line {topic} heading the doc) → slugify
      lang = $lang if passed, else detect session-dominant
0a. target = handoff-{slug}.md
0b. COLLISION GATE (never auto-decide, even under "no clarifying questions"):
      if {target} exists → AskUserQuestion:
        a) overwrite  b) consolidate and append dated section  c) rename → handoff-{slug}-{YYYY-MM-DD}.md, fresh
1.  scan conversation + recent tool history → what got done
2.  git status; git log -10
3.  ls project root → run-logs / new files this session
4.  draft sections in fixed order (below), in chosen lang
      translate headings (table) + body; leave paths/hashes/commands/code untouched
      empty section → "none" (locale equiv), never omit
5.  write {target} at project root; confirm path
```

## Heading translations

| EN            | DE                | FR          |
|---------------|-------------------|-------------|
| Goal          | Ziel              | Objectif    |
| Current state | Aktueller Stand   | État actuel |
| Result        | Ergebnis          | Résultat    |
| Files         | Dateien           | Fichiers    |
| Fails         | Probleme          | Échecs      |
| Next          | Nächste Schritte  | Suite       |

## Structure (mandatory, this order)

```
# Handoff — {one-line topic}

## Goal           what was treated, what problem, what should happen. 3–5 sentences. Lead with the ask, not the workflow.
## Current state  where things sit. Done / in-flight / blocked. Commit IDs, paths, run IDs, dates.
## Result         what was fixed this session. Verifiable only. Table for verify/fix cycles: problem→fix-location→verified?
                  One quantitative line if possible (X → Y).
## Files          grouped: Committed (hash) / Modified (uncommitted) / New (untracked) / Deleted. Full paths. Load-bearing only.
## Fails          what went wrong, surprises, dead-ends, regressions. One line each; expand if system-level. Note if later resolved.
## Next           priority order, distinguish: Immediate (blockers) / Roadmap (numbered + rationale) / Optional / Specific commands.
```

## Rules

1. Synthesize, don't quote transcript.
2. Concrete > abstract. `src/lib/auth.ts:42`, not "the auth helper".
3. Self-contained. No "as discussed", no "the issue from earlier".
4. Mark uncertainty ("likely", "not verified").
5. Length matches work; 1h debug ≠ 6h refactor.
6. Lang arg ($lang) wins over auto-detect. Headings+body translate; code/paths/hashes/commands stay.
7. Result ≠ Current state. Stand = where we sit, Result = what got done. Both exist, don't fully overlap.
8. Next needs real items or skip. No "review the work".

## Anti-patterns

- Only committed files, forgetting uncommitted.
- Vague fails ("build failed") vs specific (`vite build` exits ENOENT on `dist/assets/logo.png`).
- Generic Next ("continue refactor").
- No quantitative measure in Result.
- System-level findings buried in per-event entries.
- Victory-lap framing — fails matter as much as wins.
- Re-stating run-log content instead of linking.
- Auto-deciding the collision gate. Prior `handoff.md` may be load-bearing — only the user knows.
