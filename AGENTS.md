# Orchestrator + SDD — Skill Index

## 29 Skills Available

### SDD Workflow (8)

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `sdd-init` | `/sdd-init` | Bootstrap project, initialize SDD context |
| `sdd-explore` | `/sdd-explore <topic>` | Investigation, codebase analysis, clarify requirements |
| `sdd-propose` | After explore | Change proposal (intent, scope, approach) |
| `sdd-spec` | After propose | Technical specification (requirements, scenarios) |
| `sdd-design` | After propose | Technical design (architecture, decisions) |
| `sdd-tasks` | After spec+design | Breakdown into tasks |
| `sdd-apply` | `/sdd-apply [batch]` | Code implementation |
| `sdd-verify` | After apply | Validation against specs and design |
| `sdd-archive` | After verify | Archive and persist change |

### Design & UI (5)

| Skill | Purpose |
|-------|---------|
| `frontend-design` | Design methodology, anti-AI-slop, typography, color, layout, motion |
| `ui-ux-pro-max` | 161 color palettes, 57 Google Font pairings, 67+ UI styles |
| `web-design-guidelines` | Validation against Vercel Web Interface Guidelines |
| `building-components` | Modern and accessible component patterns |
| `shadcn-ui` | React + Tailwind library with accessibility |

### Performance & QA (3)

| Skill | Purpose |
|-------|---------|
| `vercel-react-best-practices` | 62 optimization rules Next.js/React, Core Web Vitals |
| `playwright-cli` | Browser automation, screenshots, visual testing |
| `chrome-bridge-automation` | Vision-driven QA (requires Midscene + Gemini API) |

### Deploy (1)

| Skill | Purpose |
|-------|---------|
| `vercel-deploy` | Deploy to Vercel sandbox (no account) |

### Research & Copy (3)

| Skill | Purpose |
|-------|---------|
| `web-reader` | Analysis of reference URLs |
| `deep-research` | Systematic web research |
| `humanizer` | Elimination of AI patterns in copy |

### SEO (1)

| Skill | Purpose |
|-------|---------|
| `seo-audit` | Meta tags, headings, alt text, structured data |

### Reverse Engineering (1)

| Skill | Purpose |
|-------|---------|
| `clone-website` | Reverse-engineering and rebuild of websites |

### Debugging & Observability (2)

| Skill | Purpose |
|-------|---------|
| `systematic-debugging` | Debugging methodology: reproduce → root cause → fix |
| `last30days-skill` | Activity tracking last 30 days |

### Design Engineering (1)

| Skill | Purpose |
|-------|---------|
| `emil-design-eng` | Advanced design architecture |

### Workflow (4)

| Skill | Purpose |
|-------|---------|
| `skill-registry` | Skill registry administration |
| `branch-pr` | GitHub workflow (branches, PRs) |
| `issue-creation` | GitHub issue creation |

---

## Standard SDD Flows

### Landing Page
```
/sdd-new "landing-page-{name}"
  → explore: industry, competition
  → propose: design system + architecture
  → /sdd-ff: spec → design → tasks
  → /sdd-apply: construction + QA
  → /sdd-verify: validation
  → deploy
```

### Feature Implementation
```
/sdd-new "feature-name"
  → explore: codebase, dependencies, constraints
  → propose: architecture, tradeoffs
  → /sdd-ff: spec → design → tasks
  → /sdd-apply [batch-1, batch-2, ...]: parallelism
  → /sdd-verify: testing, validation
  → /sdd-archive: persistence
```

### Debugging
```
/sdd-explore "issue-description"
  → systematic-debugging: reproduce, root cause, proposal
  → /sdd-apply: fix implementation
  → /sdd-verify: validation
  → /sdd-archive: documentation
```

---

## Configuration

### Required (None)
Orchestrator + SDD works without external dependencies.

### Optional: Midscene (Chrome-Bridge Automation)

**Requirements:**
- Chrome Extension: https://chromewebstore.google.com/detail/midscene/fnkhekmgjgnnempgbjahhhknalpepbed
- Gemini API key

**Configuration (.env):**
```
MIDSCENE_MODEL_API_KEY="<your-gemini-api-key>"
MIDSCENE_MODEL_NAME="gemini-3-flash"
MIDSCENE_MODEL_BASE_URL="https://generativelanguage.googleapis.com/v1beta/openai/"
MIDSCENE_MODEL_FAMILY="gemini"
```

**Fallback:** `playwright-cli` (no config, free).

### Optional: GitHub CLI (branch-pr)

```bash
# Install
brew install gh

# Authenticate
gh auth login
```

---

## Architecture

```
User
    ↓
Orchestrator (coordinator)
    ↓
Sub-agents (parallel execution)
    ├─ sdd-explore / sdd-propose
    ├─ sdd-spec / sdd-design
    ├─ sdd-tasks / sdd-apply
    ├─ frontend-design / ui-ux-pro-max
    ├─ playwright-cli / chrome-bridge
    └─ ... (more skills as needed)
    ↓
Result
```

---

## Engram Memory

All changes, decisions, bugs persist automatically via engram.

Recovery in next sessions:
- `mem_search` by keywords
- `mem_context` by session
- `mem_session_summary` at end