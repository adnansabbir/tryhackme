---
layout: default
title: Nmap
nav_order: 6
---

# Nmap

**What it is:** Network scanner — finds open ports, identifies services, guesses the OS.

**The fun thing:** One command on any IP → know exactly what software is running and what version. That version number is your attack surface.

---

## Commands

```bash
sudo nmap -sn 10.100.0.0/24          # who's alive on the subnet
sudo nmap -sS -sV -O 10.100.0.42     # scan a host: ports + services + OS
sudo nmap -sS -sV -O -p- 10.100.0.42 # same, but all 65535 ports
```

---

## Flag reference

| Flag | What it does |
|---|---|
| `-sn` | Ping sweep only — no port scan, just "is this host alive?" |
| `-sS` | SYN scan — sends SYN, never completes the handshake (stealthier) |
| `-sV` | Probe open ports to detect service + version |
| `-O` | Guess OS from TCP/IP fingerprint |
| `-p-` | Scan all 65,535 ports (default = top 1000) |
| `-T4` | Speed up scan (T0=paranoid → T5=insane) |

---

## Port states

| State | Meaning |
|---|---|
| `open` | A service is listening here |
| `closed` | Port reachable, nothing listening |
| `filtered` | Firewall is blocking the probe — can't tell |

---

## Sample output decoded

```
PORT     STATE  SERVICE   VERSION
22/tcp   open   ssh       OpenSSH 8.9p1
80/tcp   open   http      nginx 1.24.0
443/tcp  open   ssl/https nginx 1.24.0
8080/tcp closed http
```

→ OpenSSH 8.9p1 + nginx 1.24.0 are your starting points. Look up CVEs for those exact versions.

---

## Why `sudo` matters on LAN

Without `sudo`, nmap uses TCP/ICMP probes.  
With `sudo` **on the same LAN**, nmap switches to **ARP probes** — faster, and ARP can't be firewalled at Layer 3.

---

## Key insight

> **The version number is what matters.** Open port = opportunity. Version number = whether there's a known exploit. `nmap -sV` turns a list of ports into a list of attack candidates.
