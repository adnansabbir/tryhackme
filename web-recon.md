---
layout: default
title: Web Recon
nav_order: 7
---

# Web Recon

**What it is:** Brute-force URL paths to discover pages that exist but aren't linked anywhere.

**The fun thing:** Found `/bank-transfer` on `fakebank.thm` in 8 seconds — a money-transfer form with no auth, hidden only by not being linked. That's OWASP #1.

---

## Command

```bash
dirb http://target.thm
```

dirb loads a default wordlist (`/usr/share/dirb/wordlists/common.txt`, ~4600 entries: `admin`, `login`, `backup`, `.git`, `api`, …) and tries each as a URL path.

---

## Response codes to care about

| Code | Meaning | Worth investigating? |
|---|---|---|
| `200` | Page exists and served | Yes |
| `301` / `302` | Exists, redirects | Yes |
| `401` | Auth required | **Yes — something's there** |
| `403` | Forbidden | **Yes — something's there** |
| `404` | Not found | No (dirb hides these) |

---

## Sample output decoded

```
+ http://fakebank.thm/bank-transfer  (CODE:200|SIZE:4663)
+ http://fakebank.thm/images         (CODE:301|SIZE:179)
```

→ `/images` is just an asset directory. `/bank-transfer` is a real page — 4.6KB of HTML — that shouldn't be publicly accessible.

---

## Mental model

> `dirb` is `nmap` for URL paths. `nmap` enumerates open ports; `dirb` enumerates existing paths. Same idea: map the surface before you go deeper.

---

## Better tools (same idea, faster)

| Tool | Notes |
|---|---|
| `dirb` | Classic, simple — good for learning |
| `gobuster` | Faster, parallel, more control |
| `ffuf` | Most flexible — fuzz anything, not just paths |
| `feroxbuster` | Recursive by default, very fast |

---

## Broken Access Control — OWASP A01

The `fakebank.thm` lesson in one sentence:

> **Unlinked ≠ private.** If a path exists on a public server, brute-force finds it. Auth must be enforced **on the page itself**, not on the link to it.

This is the #1 most common web security failure. A dev "hides" an admin panel by not linking it — anyone with `dirb` finds it in seconds.

---

## Key insight

> **Security through obscurity isn't security.** The only thing between an attacker and a hidden page is whether they know the URL. Wordlists + `dirb` solve that in seconds.
