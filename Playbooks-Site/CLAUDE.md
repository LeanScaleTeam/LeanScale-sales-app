# Playbooks-Site Project Instructions

## Context Handoff Protocol

When the user says "handoff", "do a handoff", "trigger handoff", or "save context" — follow this protocol immediately.

### Handoff Document Location
Save to: `handoffs/[YY_MM_DD]-[topic]-handoff.md`

### Handoff Format

```markdown
# Handoff — [DATE]

## Now (when I stopped)
[Single sentence: exactly what you were working on when you stopped]

## Completed
- [Task 1 with file reference: `path/to/file.ts:line`]
- [Task 2]
- [Task 3]

## In Progress
- [Partial task — what's done, what remains]
- [Another partial task]

## Decisions Made
- [Decision 1] — Reasoning: [why]
- [Decision 2] — Reasoning: [why]

## Next Steps (Priority Order)
1. [First thing to do]
2. [Second thing]
3. [Third thing]

## Files That Matter
- `path/to/file1` — [purpose]
- `path/to/file2` — [purpose]

## Watch Out For
- [Gotcha 1]
- [Gotcha 2]

## Open Questions
- [Unresolved question 1]
- [Unresolved question 2]
```

### Handoff Rules
1. **Be specific, not summary** — Include exact file paths, line numbers, function names
2. **Capture the "why"** — Decisions without reasoning are useless next session
3. **Include blockers** — What stopped you? API issue? Unclear requirement?
4. **Don't over-summarize** — Details > brevity for handoffs

### Session Start Protocol
At the beginning of each new session on an ongoing project:
1. Check for existing handoff document in `handoffs/`
2. If exists, read it and summarize current state before proceeding
3. Confirm understanding of where we left off

---

## Available MCP Tools

- **Playwright** — Browser automation: navigate URLs, click buttons, fill forms, take screenshots. Say "use playwright to go to [url]" to trigger.
