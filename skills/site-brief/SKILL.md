---
name: site-brief
description: Step 1 of building a brand website with site-kit. Turns whatever the client supplied (an existing site, a brand digest, a product list, contact details, photos) into docs/BRAND.md — essence, naming, message hierarchy, offer, audiences, claims rules, personality, imagery rules. Use when starting a new site, when the user pastes a brand digest or a URL "to make better", or when brand facts are missing or contradictory.
---

# Brand intake → `docs/BRAND.md`

The brief is the source of every word on the site. A weak brief produces generic copy, so spend the time here.

## Locate the kit

```bash
KIT="${CLAUDE_PLUGIN_ROOT:-}"; [ -d "$KIT/templates" ] || KIT="$(dirname "$(dirname "$(find ~/.claude/plugins -path '*site-kit*' -name plugin.json -print -quit 2>/dev/null)")")"
```

The template is `$KIT/templates/BRAND.md`.

## 1. Gather

Collect everything the client already has before you ask for anything:

- **An existing site.** Read every page. Note the claims, products, contact details, and legal name. Also note what is wrong with it: vague headlines, stock-photo tropes, walls of badges. If the network blocks the site, ask for screenshots rather than guessing.
- **A brand digest or pitch.** Pull out the positioning, audiences, and any "we are not…" statements.
- **Products and services.** Split them into what can be bought or booked online and what needs a person. This split drives the whole site structure.
- **Imagery** the client supplies. Inventory it, and note which images are usable and what is wrong with the rest (garbled labels, full-body people, off-brand settings).

## 2. Ask only for gaps

Ask at most five questions, and only for facts the site can't ship without:

- legal name
- contact details
- the one thing a visitor must do
- claims the brand can't make
- the people rule for imagery

Everything else is a proposal the client can correct.

## 3. Write `docs/BRAND.md`

Fill the template. The rules for writing it:

- **Essence:** one sentence a competitor could not also say.
- **Message hierarchy:** exactly what the first viewport says, in order. The promise headline is specific. The rejected versions of it go in the log.
- **Business model in one line** (for example "Buy the common stuff immediately. Talk to us when the job gets complicated.").
- **Claims rules:** always include rules against inventing metrics, certifications, testimonials, or partner logos.
- **Is / is not:** "is not" matters most. Name the adjacent categories the brand gets confused with.
- **Imagery:** the settings, the people rule, and the product treatment.

Also create `lib/brand.ts` with the name, tagline, promise, contact details, and nav labels, so UI copy has one home.

## 4. Confirm

Show the user the essence, the promise headline, the two CTAs, and the online-versus-person split, in about five lines. Don't paste the whole document. Then go on to `site-direction`.
