---
description: Check Figma Desktop + Figma Plugin MCP connection status
allowed-tools:
  - mcp__figma-console__figma_get_status
  - mcp__plugin_figma_figma__whoami
---

Check both Figma MCP connections in parallel:

1. **Figma Console MCP (Desktop Bridge)** — `mcp__figma-console__figma_get_status` with `probe: true`. Reports whether Desktop Bridge plugin is running, which file is open, how many workers/plugins are active, and an active roundtrip latency.

2. **Figma Plugin MCP (auth-required)** — `mcp__plugin_figma_figma__whoami`. Reports whether the plugin MCP is authenticated. If this fails, the user must run `/mcp` to authenticate before any agent can write to Figma.

Report a single combined status:

- ✅ Both connected — ready for team-run / hi-fi work
- ⚠ Console only — read tools work, but writes from spawned agents will fail until plugin MCP is authenticated (`/mcp`)
- ⚠ Plugin only — agents can write, but `figma-console` tooling (audits, snapshots) unavailable
- ❌ Neither — start Figma Desktop and run `/mcp`

Always report:
- Current file name + URL / fileKey
- Current page
- Plugin MCP identity (whoami output) if authenticated
