---
layout: default
title: MAC Addresses
nav_order: 5
---

# MAC Addresses

**What it is:** A hardware identifier burned into every network adapter at manufacture time.

**The fun thing:** The first 3 bytes (OUI) identify the vendor — so a MAC tells you if a device is Apple, Cisco, a cheap IoT camera, etc. Before you scan, you already know the device type.

---

## Structure

```
A4 : 91 : B1 : 00 : 12 : FE
└────┬────┘   └──────┬──────┘
    OUI             Device ID
  (vendor)       (unique per device)
```

Look up any OUI → [maclookup.app](https://maclookup.app)

---

## The randomized MAC flag

**Bit 1 of the first byte** = locally-administered flag.

| First byte (binary) | Meaning |
|---|---|
| `xxxxxxx0` | Real hardware MAC (globally unique) |
| `xxxxxxx1` | Locally administered = **randomized / spoofed** |

MACs starting with `5E`, `6E`, `AE`, `BE`, `CE`, `DE`, `FE` are almost always randomized. Modern phones (iOS, Android) rotate MACs per-SSID for privacy.

---

## Common vendor OUIs

| OUI prefix | Vendor |
|---|---|
| `A4:91:B1` | Apple |
| `00:50:56` | VMware VM |
| `08:00:27` | VirtualBox VM |
| `00:0C:29` | VMware (another range) |
| `B8:27:EB` | Raspberry Pi |
| `DC:A6:32` | Raspberry Pi 4 |

---

## What a MAC leaks even when rotated

MAC rotation doesn't make you invisible:

| Leak | Why |
|---|---|
| DHCP fingerprint | Options ordering + vendor class identify your OS |
| TCP stack fingerprint | TTL, window size, TCP options reveal OS + version |
| RSSI / AoA | APs triangulate your physical location by radio signal |
| Timing patterns | Connect/disconnect cadence links sessions |

---

## Key insight

> **Randomized MAC = privacy hygiene, not invisibility.** Your TCP stack, DHCP behavior, and RF signature still identify you. MAC rotation protects against passive logging, not active detection.
