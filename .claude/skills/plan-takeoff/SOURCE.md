# Source

- Upstream: https://github.com/lefteartm/takeoff-plugin
  (`plugins/plan-takeoff/skills/plan-takeoff`, commit 7917301)
- Author: lefteartm
- Licence: Apache-2.0, as declared in the upstream `plugin.json`
  (the upstream repository ships no LICENSE file)

## Changes from upstream

`SKILL.md` only; `references/` is unchanged.

- `compatibility` front-matter now names opentakeoff-mcp 0.9.98 (53 tools),
  the version pinned in this project's `.mcp.json`.
- Added the section "Notes for opentakeoff-mcp 0.9.98 (this project)":
  `one_click` / `detect_rooms` are gated off in that release, `export_report`
  returns JSON rather than Excel, and `propose_takeoff` batches shapes.

The upstream plugin's own `.mcp.json` (unpinned `npx -y opentakeoff-mcp`) was
not installed; the project-level `.mcp.json` already provides the server.
