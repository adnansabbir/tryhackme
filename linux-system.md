---
layout: default
title: Linux System
nav_order: 5
---

# Linux System

**What it is:** How Linux controls who owns what, who can do what, and where everything lives.

**The fun thing:** Read `/etc/shadow` as root and you have every user's password hash. Crack one and you own the box.

---

## File permissions

Every file has 10 characters at the start of `ls -l`:

```
-rw-r--r--
^\_/\_/\_/
|  |  |  └─ others
|  |  └──── group
|  └──────── owner
└─────────── file type (- = file, d = dir, l = symlink)
```

Each group is 3 letters: `r` (read), `w` (write), `x` (execute), `-` (none).

<details markdown="1">
<summary>Numeric permission values (chmod)</summary>

| Permission | Value |
|---|---|
| `r` read | 4 |
| `w` write | 2 |
| `x` execute | 1 |
| `-` none | 0 |

Add them per group → one digit each:

| Symbolic | Numeric | Who can do what |
|---|---|---|
| `rwx------` | `700` | Only owner, full access |
| `rw-r--r--` | `644` | Owner read/write; everyone else read-only |
| `rwxr-xr-x` | `755` | Owner full; everyone else read + execute |
| `rwxrwxrwx` | `777` | Everyone full access (dangerous) |

```bash
chmod 755 file.sh     # set permissions numerically
chmod 644 config.txt
```

</details>

---

## Switching users — `su`

```bash
su user2           # switch to user2 (stays in current directory)
su -l user2        # switch + load user2's full environment (drops into their home)
sudo su            # become root (if you have sudo rights)
```

> `su -l` is what you want most of the time — it behaves like that user actually logged in, not just a partial switch.

---

## Important directories

| Directory | What's in it | Why it matters in pentesting |
|---|---|---|
| `/etc` | System config files | `passwd`, `shadow` (hashed passwords), `sudoers` (who can run as root) |
| `/var` | Variable/runtime data | `/var/log` — logs from every service; databases |
| `/root` | Root user's home | Not `/home/root` — it's just `/root`. Contains root's personal files |
| `/tmp` | Temporary files | Cleared on reboot. **Any user can write here** — drop enumeration scripts here after getting a shell |

```bash
cat /etc/passwd          # list of all users
cat /etc/shadow          # hashed passwords (need root to read)
cat /etc/sudoers         # who has sudo access
ls /var/log              # all log files
ls /tmp                  # writable by everyone
```

> `/tmp` is your staging ground once you're on a machine. World-writable, no questions asked.

---

## Key insight

> **Permissions + directories = the map of a system.** Know who owns what, where secrets live, and where you can write — and you know exactly where to look after getting a shell.