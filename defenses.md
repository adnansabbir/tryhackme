---
layout: default
title: Defenses
nav_order: 6
---

# Network Defenses

**What it is:** The tools and techniques corporations use to detect, block, and investigate attackers on their networks.

**The fun thing:** Understanding defenses tells you exactly *why* certain attacks fail — and what a real attacker would have to bypass first.

---

## Defense stack at a glance

| Layer | Tool | What it catches |
|---|---|---|
| **Network access** | NAC (802.1X) | Blocks unknown devices before they get an IP |
| **Network traffic** | NDR | Detects anomalous traffic patterns (port sweeps, fan-out, beaconing) |
| **Endpoint** | EDR | Watches processes, file writes, and network calls on each laptop |
| **Architecture** | Microsegmentation | Hosts can't reach each other — only specific services |
| **Identity** | ZTNA / BeyondCorp | No "inside" network — every request is auth'd regardless of source |
| **Wireless** | WIPS | Detects rogue APs, deauth attacks, unauthorized clients |
| **Deception** | Honeytokens | Fake creds/files/hosts — touching them triggers an alert instantly |

---

## Why "low and slow" scans still get caught

Slowing down a scan (`-T1`, `--scan-delay`) feels stealthy. But:

- **Volume thresholds** — 200 hosts touched is anomalous at any rate
- **Behavioral baselines** — one host talking to hundreds of others is rare in normal traffic
- **NetFlow / sFlow** — flow records aggregate over hours/days and reveal fan-out patterns
- **RF fingerprinting** — on WiFi, your radio chip leaks identity below the IP layer

---

## NAC (802.1X) — the gatekeeper

The hardest control to bypass. Works at the switch port level:

1. Device connects physically / wirelessly
2. Switch demands a certificate or credential before passing *any* traffic
3. No cert → no IP → no network

> If you plug in on a corp LAN and nothing works, it's probably NAC.

---

## Honeytokens — the quiet tripwire

Fake assets placed in realistic locations:
- A set of credentials in a "dev" config file
- A fake S3 bucket URL in an internal doc
- A hostname that resolves but shouldn't be accessed

**Any access triggers an alert.** No false positives — there's no legitimate reason to touch them. First thing an attacker touches after grabbing credentials → instant detection.

---

## Key insight

> **If you can scan a corp network freely, their security is weak — not a sign you're stealthy.** A properly defended network should alert within minutes of a port sweep, regardless of scan speed.
