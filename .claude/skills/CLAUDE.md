# Skill Writing Rules

## General
Skill code: compact, precise, prefer pseudocode — no content loss. Structure over prose. No redundancy.

## New or edited skills
 **must** follow `superpowers:writing-skills` (TDD for skills):                                                        
1. **RED** — Run baseline scenario without skill, document failure       
2. **GREEN** — Write minimal skill addressing those failures             
3. **REFACTOR** — Re-test, close loopholes, verify compliance

## Skill descriptions
After writing or editing a skill, the `description` field MAY be optimized via `skill-creator:skill-creator` (Description Optimization section) — not automatic, only on explicit ask. `run_loop.py` is quota-heavy: each iteration runs ~60 `claude -p` calls (20 queries × 3 reps), so 5 iterations ≈ 300 calls.

Defaults when invoked:
- `--max-iterations 2` (more rarely helps — recall plateaus fast)
- `--model claude-haiku-4-5-20251001` (trigger-eval is yes/no classification, Haiku is sufficient; Opus burns ~70% of a Max-5x 5h window for one full run)

Use Opus / 5 iterations only on explicit user request.
       