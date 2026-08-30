---
name: role-architect
description: Use when creating, changing, or reviewing agent roles, multi-agent collaboration, task handoffs, model routing, reasoning effort, or Maestri execution structure.
---

# Role Architect

Use this skill before proposing a team, changing collaboration policy, or materializing agents.

1. Read project instructions, the current task, relevant specification, and repository state.
2. Read [the operational contract](references/contrato-operacional.md), [the team blueprint](references/blueprint-de-equipe.md), and [the routing policy](references/politica-de-roteamento.md).
3. Select the smallest useful role set and produce the blueprint before recruiting, creating floors, changing roles, or editing implementation files.
4. Stop for explicit human approval of the blueprint. Do not recruit, create a floor, change roles, or start structural implementation before it.
5. Only after that approval designates an execution surface and a matching adapter exists, read exactly one adapter in `references/adapters/`. If no matching adapter exists, stop and report the blocker.

## Operating rules

- Assign one writer per repository surface at a time.
- The Maestro coordinates and triages; it does not implement by default.
- Give each reviewer only the original requirement and the relevant `git diff`.
- Do not increase reasoning effort without a recorded trigger. `xhigh` and `max` require explicit human approval.
- Maestri is optional: the same blueprint works in Codex, Claude Code, or a manual workflow.
