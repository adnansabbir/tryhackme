---
layout: default
title: Basics
parent: Networking
nav_order: 1
---

# Networking Basics

**What it is:** Linux commands that reveal your network layout — your IP, your gateway, and every device your machine has talked to.

**The fun thing:** `ip neigh` shows the ARP cache — a free list of live devices nearby, no scanning needed.

---

## Commands

```bash
ip addr        # your interfaces + IPs
ip route       # routing table — find the gateway
ip neigh       # ARP cache — devices seen recently
```

---

## What the output means

### `ip addr`
```
2: eth0: <BROADCAST,MULTICAST,UP>
    inet 10.100.4.22/16 brd 10.100.255.255
```

| Field | Meaning |
|---|---|
| `eth0` / `wlan0` | Interface name (wired / wireless) |
| `10.100.4.22` | Your IP |
| `/16` | Netmask — `/16` = 65,534 hosts on this segment |

### `ip route`
```
default via 10.100.0.1 dev wlan0
```
→ Everything unknown goes to `10.100.0.1` (your router).

### `ip neigh`
```
10.100.0.1  dev wlan0  lladdr a4:91:b1:00:12:fe  REACHABLE
10.100.4.55 dev wlan0  lladdr 5e:1a:9f:8c:42:b0  STALE
```
→ Every device your machine has recently communicated with. MAC addresses included — cross-reference with nmap.

---

## CIDR quick reference

| Notation | Hosts | Typical use |
|---|---|---|
| `/24` | 254 | Home network |
| `/16` | 65,534 | Large corp / coworking |
| `/22` | 1,022 | Mid-size office segment |

---

## Key insight

> **`ip neigh` = free recon.** Before you scan anything, check the ARP cache — it shows devices that are definitely live and recently active, with no packets sent.
