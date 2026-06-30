# Contributing to getregdata

Thanks for your interest in extending the European Regulatory Research Skills suite. This guide explains how to add new actors, workflow skills, and country coverage.

## Adding a new country

1. **Research the registry landscape** - Does the country have an official public business registry? Is it accessible programmatically, or does it require a scraper? Are there competing APIs?

2. **Create the Apify Actor** - Build and deploy the scraper on [Apify](https://console.apify.com/sign-up?ref=getregdata). Follow the portfolio conventions: structured JSON output, clear pay-per-result pricing, comprehensive README.

3. **Add to the Actor Catalog** - In `README.md`, add a row under the relevant country with the actor name, registry, what you get, and cost per result.

4. **Create a workflow skill (optional)** - If the actor enables a repeatable compliance workflow, add it to the relevant `skills/<skill-name>/SKILL.md` recipe (or create a new one).

## Adding a new workflow skill

Workflow skills are self-contained recipes that turn one or more actors into a repeatable process (a KYC check, an insolvency watchlist, a lead feed), not a one-off lookup.

### Skill structure

Each skill lives in `skills/<skill-name>/SKILL.md` and follows this format:

```markdown
---
name: skill-name
description: One-line summary used to decide when the skill applies
metadata:
  version: 1.0.0
  author: regdata
  tags:
    - registry
    - country
    - use-case
---

# Skill Title

**Workflow:** What the combined actors accomplish, end to end.

**Actors used:**
- `actor-id` - description of what this actor contributes

## Prerequisites
- Dependencies, tokens, plan requirements

## Usage
```python
# Working Python example using apify-client
```

## Output format
```json
{ "example": "output" }
```

## Pricing
Cost breakdown per run.

## Notes
Pitfalls, rate limits, proxy requirements.
```

### Workflow design principles

- **Repeatable** - The skill should solve a task that gets done regularly (onboarding checks, weekly monitoring, daily feeds).
- **End-to-end** - Include what the user does with the output. The skill is the agent prompt + actor call + result handling.
- **Pricing-transparent** - Show per-run cost so users can budget.
- **Multi-actor where it adds value** - Combining 2-3 actors for cross-registry coverage is where a workflow beats a single lookup.

## Code conventions

- Python examples use `apify-client` for actor execution; JavaScript examples use `apify-client` (the npm package).
- Use actual actor IDs from the Apify Store (e.g., `regdata/crbr-beneficial-owners-scraper`).
- Apify links use the `?ref=getregdata` referral parameter, matching the rest of the repo.
- Keep agent prompts short and instructional.
- Use a plain hyphen `-` for dashes, not an em-dash.

## Pull request process

1. Fork the repo
2. Create a feature branch
3. Add your actor or skill following the conventions above
4. Open a PR describing what you're adding and why
5. Tag it with `new-actor`, `new-skill`, or `new-country` as appropriate

## Questions?

Open an issue with the `question` label.

## Current coverage

| Country | Actors | Gaps |
|---------|--------|------|
| Poland | 9 | None |
| Spain | 2 | Provincial-level registry depth |
| Austria | 2 | Firmenbuch (commercial register) |
| France | 1 | INPI direct access, BODACC parsing |
| Germany | expanding | Handelsregister, Bundesanzeiger |
| Italy | expanding | Registro Imprese, INI-PEC |
| Netherlands | 0 | KVK Handelsregister |
| Belgium | 0 | BCE/KBO, BNB |
| Portugal | 0 | RACIUS, Portal da Empresa |

Priority expansion targets: deepening Germany and Italy coverage, then Netherlands (KVK) and Belgium (KBO).
