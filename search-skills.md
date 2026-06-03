---
layout: default
title: Search Skills
parent: Recon
nav_order: 3
---

# Search Skills

**What it is:** Knowing *where* to search is just as important as knowing *what* to search for. These are the key resources used in both offensive and defensive security.

**The fun thing:** Before touching a single target, you can already know what software it's running, whether it's vulnerable, and whether there's working exploit code — all from public sources.

---

## Shodan

A search engine for internet-connected devices — servers, cameras, routers, industrial control systems. Shodan scans the internet continuously and records what's running on every open port.

```
apache 2.4.1               # every server advertising this version
port:22 country:GB         # SSH servers in the UK
org:"British Airways"      # everything BA has publicly exposed
hostname:tryscanme.thm     # THM's practice target
```

**Useful filters:**

| Filter | What it does | Example |
|---|---|---|
| `country:` | Restrict to a country code | `country:IE` |
| `port:` | Filter by port number | `port:22` |
| `org:` | Scope to a company or ASN | `org:"Amazon"` |
| `hostname:` | Match a domain or hostname | `hostname:fakebank.thm` |

**Reading a Shodan result:**

```
185.243.115.47 — Amsterdam, DigitalOcean
Apache/2.4.58 (Ubuntu)
PHP/8.2.10
Open ports: 22, 80, 443, 8080
```

→ Before sending a single packet: you know the OS, web server version, backend language, and every open port. Search `CVE apache 2.4.58` and you have your attack candidates.

> **Key insight:** Shodan shows what the server already advertises to the whole internet. Reading it isn't scanning — it's reading public information.

---

## VirusTotal

Submits a file, URL, domain, or hash to 70+ antivirus engines simultaneously and returns a consensus verdict.

**What you can submit:**

| Input | Use case |
|---|---|
| File | Suspicious email attachment |
| URL | Sketchy link someone sent you |
| Domain | Is this domain known for malware? |
| Hash (MD5 / SHA256) | Check a file without uploading it |

**Reading results:**

- `0 / 72` flagged → probably clean
- `45 / 72` flagged → malware

**The hash trick:** every file has a unique fingerprint. If the malware is known, its hash is already in the database — no need to upload the file. Faster, and safe if the file contains sensitive data.

> **Key insight:** Blue team uses it to triage suspicious files. Red team uses it to check whether a payload will get caught before deploying it.

---

## CVE — Common Vulnerabilities and Exposures

A universal dictionary of known vulnerabilities. Every confirmed vulnerability gets a unique ID:

```
CVE-2025-55182
    ↑     ↑
  Year   Unique number
```

Some high-impact ones get nicknames: **Heartbleed**, **Log4Shell**, **EternalBlue**.

**CVSS score** — rates each CVE on three factors:

| Factor | Question it answers |
|---|---|
| Impact | What damage can this cause? |
| Complexity | Is it easy to exploit? |
| Availability | How likely is exploitation? |

Score is 0–10. Organisations patch highest scores first.

**ExploitDB** (`exploit-db.com`) compiles CVEs alongside **Proof of Concept (PoC)** scripts — working code that demonstrates the vulnerability.

> **Key insight:** When nmap gives you `Apache/2.4.58`, your next move is `CVE apache 2.4.58` → ExploitDB → is there a PoC? That's your attack chain in three steps.

---

## Documentation & Man Pages

Official documentation is always more reliable than third-party tutorials. First stop, not last.

For any command-line tool on Linux:

```bash
man nmap        # full nmap manual
man nc          # netcat reference
man curl        # curl options
```

Scroll with arrow keys, `q` to quit, `/` to search within the page.

---

## GitHub

Researchers publish PoC code, exploit tools, and vulnerability analyses on GitHub — often faster than official channels.

**Search pattern:**
```
CVE-2026-1337 site:github.com
```
→ Repositories with PoC code, scanner scripts, or detailed breakdowns.

**Caveat — not all PoCs are trustworthy:**

| Type | Risk |
|---|---|
| Incomplete PoC | Won't work, wastes time |
| Intentionally flawed | Misleads defenders / researchers |
| Malicious "PoC" | The repo itself is the malware |

> **Always read the code before you run it.** A PoC that calls home or drops a backdoor is a classic attack vector against researchers.
