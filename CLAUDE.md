# CLAUDE.md — TryHackMe Notes

## What this project is

Adnan's personal cybersecurity learning journal. Notes taken while working through TryHackMe's *Cyber Security 101* path. The site is his portfolio artifact — proof of the learning journey.

Deployed to GitHub Pages at `/tryhackme/`. Readable on phone. Works offline (PWA).

## Who Adnan is

- Software engineer, 7+ years. Pivoting into cybersecurity (AppSec / DevSecOps / Security Engineering).
- Has ADHD — notes must be **short, punchy, and action-first**.
- Practical learner: run the command, then explain what it means. Never pre-dump theory.

## Workflow — how to handle pasted lesson content

When Adnan pastes TryHackMe lesson content:

1. **Add it to the notes immediately** — extract the key commands, tables, and concepts; write them in the established format
2. **Do not commit** — just update the file and confirm it's added
3. **Keep accumulating** — each paste adds to the current section; don't reset between pastes
4. **Commit only when:** Adnan explicitly asks to commit, OR he signals a new topic/section is starting

---

## Note-writing rules

Every page follows this pattern — don't deviate:

1. **One-liner hook** — what it is in plain English
2. **"The fun thing"** — one concrete, exciting thing you can *do* with it immediately
3. **Commands first** — runnable bash blocks before any explanation
4. **Tables over prose** — flag references, comparisons, quick lookups
5. **Key insight** — one blockquote at the bottom that ties it together

Keep pages short enough to read on a phone in one scroll. No walls of text.

## When a page gets too long

If a page is growing and starts to feel like too much to scroll through, use one of these two approaches — Adnan's call which:

1. **Split into sub-pages** — e.g. `linux.md` → `linux-basics.md` + `linux-files.md`. Best when sections are genuinely independent topics.
2. **Collapsible sections** — wrap sections in a `<details>` block so they're hidden until tapped. Best when the page is one topic but has a lot of reference material.

```html
<details markdown="1">
<summary>Flag reference</summary>

| Flag | What it does |
|---|---|
| `-a` | Show hidden files |

</details>
```

> Default: ask Adnan which approach he wants before changing page structure.

## Adding a new page

1. Create `<topic>.md` with frontmatter:
   ```yaml
   ---
   layout: default
   title: Topic Name
   nav_order: <next number>
   ---
   ```
2. Add the card to `index.md` card grid (emoji + title + one-line desc)
3. Add the path to `PRECACHE` array in `sw.js` (for offline support)
4. Bump the cache key in `sw.js` (`thm-notes-v4` → `v5`, etc.)

## Tech stack

- Jekyll + `just-the-docs` remote theme, dark mode
- Service worker: stale-while-revalidate, offline fallback
- PWA: `manifest.json` + `icon.svg` + `_includes/head_custom.html`
- `claude-handoff.md` is excluded from Jekyll build — context bridge between sessions, not a note page

## Reading time (auto)

Every content page automatically shows a "⏱️ N min read" estimate under the H1. Implemented as JS in `_includes/head_custom.html`. Calculation:

- Prose words read at 200 wpm
- Code (inside `<pre>` blocks) read at 100 wpm — scanning, but absorbing
- Pages under 40 words total (parent stubs) are skipped — they don't get a reading time

**For new pages:** Do nothing. The reading time auto-updates whenever the page content changes. Just write notes normally.

## Force refresh button

A floating ↻ button (bottom-right) lives on every page. One tap = unregister service worker + clear all caches + hard reload. Use case: PWA on iPhone showing stale content after a deploy.

Implementation: same JS file (`_includes/head_custom.html`). Safe-area aware for iOS home indicator. Don't need to do anything when adding new pages.

## Site structure (parent → children)

Pages are organized with `just-the-docs` parent/child nav. Top-level parents listed first; their children sit underneath with `parent: <Parent Title>` in frontmatter.

```
Home (index.md, nav 1)
├── Linux (linux.md, nav 2, has_children)
│   ├── Basics  (linux-basics.md)
│   ├── System  (linux-system.md)
│   └── Vim     (vim.md)
├── Windows (windows.md, nav 3, has_children)
│   └── Basics  (windows-basics.md)
├── Networking (networking.md, nav 4, has_children)
│   ├── Basics  (networking-basics.md)
│   └── MAC Addresses (mac-addresses.md)
├── Recon (recon.md, nav 5, has_children)
│   ├── Nmap          (nmap.md)
│   ├── Web Recon     (web-recon.md)
│   └── Search Skills (search-skills.md)
└── Defenses (defenses.md, nav 6)
```

**Adding a child page to an existing section:**
- Add frontmatter `parent: Linux` (or whichever parent title)
- Set `nav_order` to position within that parent
- Add path to `PRECACHE` in `sw.js`, bump cache key
- Don't add it to `index.md` card grid — that's category-level only

**Adding a new top-level section:**
- Create `<section>.md` parent stub with `has_children: true` and `permalink: /<section>`
- Add a card to `index.md`
- Children get `parent: <Section Title>`