# Skill Writing Rules

## General
Skill code: compact, precise, prefer pseudocode — no content loss. Structure over prose. No redundancy.

Skill **content** is reusable instructions an agent reads cold → **generic + agent-directed**:
- **No run/component specifics, no user-facing framing** (no "in the X run", no report-to-user tone).
- **Minimal why** — a rationale only where it changes what the agent does; one clause, not a paragraph.
- **Abstract the rule wording** — never bind a rule to named DS components, nor enumerate DS token /
  utility-class names (typography · spacing · radius · shadow …); describe by **role/category** (icon,
  leading/trailing adornment, region, typography family, spacing scale, radius vocabulary). Concrete
  names live in the token reference + the code, never duplicated in a skill.
- **Load-bearing non-token pointers stay concrete** — a real file path, command, or package/registry
  field is a pointer, not a rule binding.
- **Self-contained.** Per-run findings + candidate fixes → `<run>/skill-feedback.md`, never the skill;
  never link review-temporary files (skill-feedback / run-notes / handoff) as a durable reference.

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
       