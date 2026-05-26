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

## Pages so far (nav_order)

| Order | File | Topic |
|---|---|---|
| 2 | linux.md | find, grep, pipe, SUID |
| 3 | networking.md | ip addr/route/neigh, ARP |
| 4 | mac-addresses.md | OUI, randomized MACs |
| 5 | nmap.md | ping sweep, SYN scan, -sV/-O |
| 6 | search-skills.md | Shodan, VirusTotal, CVE, ExploitDB |
| 7 | web-recon.md | dirb, response codes, OWASP A01 |
| 8 | defenses.md | NAC, EDR, NDR, honeytokens |