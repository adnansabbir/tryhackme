# TryHackMe — Learning Notes

> Personal cybersecurity learning journal. Practical-first: command → output → insight.
> Built while working through the **TryHackMe Cyber Security 101** path alongside hands-on lab work.

---

## Contents

- [1. Linux Networking Basics](#1-linux-networking-basics)
- [2. MAC Addresses](#2-mac-addresses)
- [3. Nmap — Host & Port Discovery](#3-nmap--host--port-discovery)
- [4. Verifying Open Ports with `nc`](#4-verifying-open-ports-with-nc)
- [5. iPhone Fingerprinting on the LAN](#5-iphone-fingerprinting-on-the-lan)
- [6. Why "Stealth" Scans Still Get Caught](#6-why-stealth-scans-still-get-caught)
- [7. Why MAC Rotation Isn't Anonymity](#7-why-mac-rotation-isnt-anonymity)
- [8. How Big Corps Defend Their Networks](#8-how-big-corps-defend-their-networks)
- [9. Web — `dirb` / Directory Brute-Forcing](#9-web--dirb--directory-brute-forcing)
- [10. Broken Access Control (OWASP A01)](#10-broken-access-control-owasp-a01)

---

## 1. Linux Networking Basics

```bash
ip addr           # interfaces + their IPs / CIDR
ip route          # routing table — find the default gateway
ip neigh          # ARP cache — devices recently talked to
```

**What you learn from each:**

| Command | Tells you |
|---|---|
| `ip addr` | Your interface name (`en0`, `wlan0`), your IP, the netmask (`/24`, `/16`, …) |
| `ip route` | Your default gateway (router), per-route interface |
| `ip neigh` | MAC + IP of every device your machine has seen on the LAN — **free recon** |

**CIDR quick reference:**

| Notation | Hosts | Typical use |
|---|---|---|
| `/24` | 254 | Home network |
| `/16` | 65,534 | Large corp / coworking |
| `/22` | 1,022 | Mid-size office segment |

> My office network is a flat `10.100.0.0/16` — corp/coworking-style, sparse DHCP across 65k addresses.

---

## 2. MAC Addresses

A MAC looks like `5E:1A:9F:8C:42:B0`. Structure:

```
5E : 1A : 9F : 8C : 42 : B0
└────┬────┘   └─────┬─────┘
    OUI         Device ID
  (vendor)
```

- **OUI** (first 3 bytes) = vendor (Apple, Cisco, Samsung…). Look up at [maclookup.app](https://maclookup.app).
- **Bit 1 of the first byte = locally-administered flag**. If set → the MAC is randomized / spoofed, not a real hardware address.
- A real Apple MAC starts with a registered Apple OUI. A MAC starting with `5E`, `6E`, `AE`, `BE`, etc. with that bit set = randomized.

**Why it matters:** modern phones randomize MACs per-SSID for privacy. Seeing `5E:…` on the LAN doesn't tell you what device — but seeing a real Apple OUI does.

---

## 3. Nmap — Host & Port Discovery

```bash
sudo nmap -sn 10.100.0.0/24            # ping sweep — who's alive
sudo nmap -sS -sV -O 10.100.0.42       # SYN scan + service + OS fingerprint
```

| Flag | Meaning |
|---|---|
| `-sn` | Ping sweep — no port scan, just "is this host up?" |
| `-sS` | SYN (half-open) scan — sends SYN, never completes handshake |
| `-sV` | Probe services to identify version (e.g. `OpenSSH 8.9p1`) |
| `-O` | Guess the OS from TCP/IP stack fingerprint |
| `-p-` | Scan all 65,535 ports (default is top 1000) |

**Important nuance:**

- Without `sudo`, nmap falls back to ICMP/TCP probes.
- With `sudo` **on the same LAN**, nmap uses **ARP probes** — faster and more reliable, because ARP can't be firewalled at L3.

---

## 4. Verifying Open Ports with `nc`

Nmap says a port is "open." That doesn't mean the service is actually usable.

```bash
nc -v 10.100.0.42 22       # connect to SSH
nc -v 10.100.0.42 8080     # connect to a random HTTP-ish port
```

If you get a banner → real service.
If it connects but hangs silent → port is open but the service may be filtered, half-broken, or waiting for a specific protocol.

> **Principle: TCP open ≠ service usable.**

---

## 5. iPhone Fingerprinting on the LAN

Scanning my own phone over WiFi showed:

```
62078/tcp open  iphone-sync
```

Port **62078** = `lockdownd` (iOS sync service). It's the **characteristic iOS signature** — if you see it open on a host, that host is almost certainly an iPhone or iPad.

Same idea applies broadly: services leak device type.

| Port | Likely device / service |
|---|---|
| 62078 | iOS device (`lockdownd`) |
| 5353 | mDNS / Bonjour — Apple devices, printers |
| 1900 | UPnP — IoT, smart TVs |
| 9100 | RAW print — network printer |
| 8009 | Chromecast |

---

## 6. Why "Stealth" Scans Still Get Caught

Slowing down a scan (`-T1`, `--scan-delay`) feels stealthy but **modern detection doesn't only look at rate**:

- **Volume thresholds** — even slow scans eventually hit anomaly counters.
- **Behavioral baselines** — one host suddenly talking to 200 others is suspicious at any rate.
- **RF fingerprinting** — on WiFi, your radio chip leaks identity below the IP layer.
- **NetFlow / sFlow** — aggregated flow records spot fan-out patterns over hours/days.

Stealth on a monitored network is hard. On the LAN it's nearly impossible against a competent defender.

---

## 7. Why MAC Rotation Isn't Anonymity

Changing your MAC doesn't anonymize you. The leaks:

- **DHCP fingerprint** — your DHCP options ordering and vendor class identify the OS.
- **TCP stack fingerprint** — TTL, window size, options leak OS + version.
- **RSSI / Angle-of-Arrival** — APs triangulate your physical location.
- **Timing patterns** — when you connect, how long, which APs you roam between.
- **Higher-layer cookies / tokens** — once you log into anything, MAC is moot.

> MAC rotation is a privacy hygiene measure, not invisibility.

---

## 8. How Big Corps Defend Their Networks

| Defense | What it does |
|---|---|
| **NAC (802.1X)** | Won't let your device on the network at all without cert/credential auth |
| **Microsegmentation** | Hosts can't talk to each other — only to specific services |
| **ZTNA / BeyondCorp** | No "inside" network — every request is auth'd regardless of source |
| **EDR** | Endpoint Detection & Response — agent on each laptop watching processes |
| **NDR** | Network Detection & Response — watches all traffic for behavioral anomalies |
| **Honeytokens** | Fake credentials/files/hosts that scream when touched |
| **WIPS** | Wireless Intrusion Prevention — detects rogue APs, deauth attacks, scans |

If you can scan a corp LAN freely, **it's a sign their security is weak**, not a sign you're stealthy.

---

## 9. Web — `dirb` / Directory Brute-Forcing

```bash
dirb http://fakebank.thm
```

**What it does:**

1. Loads a wordlist (`/usr/share/dirb/wordlists/common.txt`, ~4600 entries: `admin`, `login`, `backup`, `.git`, `robots.txt`, …).
2. Sends `GET http://target/<word>` for each entry.
3. Reports any response that isn't a 404 — i.e. the page exists.

**Mental model:** `nmap` for URL paths instead of TCP ports.

**Response codes to care about:**

| Code | Meaning | Interesting? |
|---|---|---|
| 200 | Page exists, here it is | Yes |
| 301 / 302 | Exists, redirects | Yes |
| 401 | Auth required | **Yes — something's there** |
| 403 | Forbidden | **Yes — something's there** |
| 404 | Not there | No (dirb hides these) |

**Same-family modern tools:** `gobuster`, `ffuf`, `feroxbuster` — faster, parallel, more flexible. `dirb` is the teaching tool; `ffuf` is the practical pick.

---

## 10. Broken Access Control (OWASP A01)

Live example from **fakebank.thm**:

```
+ http://fakebank.thm/bank-transfer (CODE:200|SIZE:4663)
```

A bank app had a money-transfer form on an **unlinked URL with no auth check**. Once dirb found it, anyone could transfer money out of any account.

**The principle:**

> **Unlinked ≠ private.** If a path exists on a public server, brute-force will find it. Auth must be enforced **on the page itself**, not on the link to it.

This bug pattern is **#1 on the OWASP Top 10**. The most common security failure in real-world web apps.

---

## Reference Links

- [TryHackMe](https://tryhackme.com)
- [OWASP Top 10 (2021)](https://owasp.org/Top10/)
- [Nmap reference](https://nmap.org/book/man.html)
- [MAC vendor lookup](https://maclookup.app)
