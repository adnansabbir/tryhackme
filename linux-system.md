---
layout: default
title: System
parent: Linux
nav_order: 2
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

## Processes

Every running program has a **PID** (Process ID) — assigned in the order it started.

```bash
ps                          # processes in your current session
ps aux                      # ALL processes from ALL users
ps aux | grep "^root"       # only processes owned by root
top                         # live view, refreshes every 10 seconds
```

**Kill a process:**

```bash
kill 1337        # send SIGTERM — clean shutdown (process can tidy up)
kill -9 1337     # send SIGKILL — force kill immediately, no cleanup
kill -19 1337    # send SIGSTOP — pause/suspend the process
```

| Signal | What it does |
|---|---|
| `SIGTERM` | Polite kill — process can clean up first |
| `SIGKILL` | Force kill — no cleanup, instant |
| `SIGSTOP` | Suspend — pause without killing |

**Manage services at boot:**

```bash
systemctl start apache2      # start a service now
systemctl stop apache2       # stop it
systemctl enable apache2     # start automatically on boot
systemctl disable apache2    # don't start on boot
systemctl status apache2     # check if it's running
```

**Background & foreground:**

```bash
command &       # run in background from the start
Ctrl + Z        # suspend current process, send it to background
fg              # bring most recent background process back to foreground
```

> `systemd` (PID 1) is the parent of everything — it's the first process on boot and manages all others.

---

## Crontabs — scheduled tasks

**The fun thing:** Find a writable crontab on a target and you can schedule your own commands to run as that user — or as root.

```bash
crontab -e     # edit your crontab
crontab -l     # list your current cron jobs
```

**Format — 6 fields:**

```
MIN  HOUR  DOM  MON  DOW  CMD
 *    *     *    *    *   command
```

| Field | Meaning |
|---|---|
| `MIN` | Minute (0–59) |
| `HOUR` | Hour (0–23) |
| `DOM` | Day of month (1–31) |
| `MON` | Month (1–12) |
| `DOW` | Day of week (0–6, 0 = Sunday) |
| `CMD` | Command to run |

`*` = wildcard — "every" for that field.

**Examples:**

```bash
0 */12 * * * cp -R /home/user/Documents /var/backups/   # backup every 12 hours
0 9 * * 1 /scripts/weekly.sh                            # every Monday at 9am
* * * * * /scripts/every-minute.sh                      # every single minute
```

> Not sure about the format? [crontab.guru](https://crontab.guru) — test expressions. [crontab-generator.org](https://crontab-generator.org) — build them with a UI.

**`@reboot` shortcut:**

```bash
@reboot /var/opt/processes.sh    # run this script once every time the system boots
```

> No 6-field format needed. Runs as the user who owns the crontab entry. If you can write to that script — you own persistence on the box.

---

## Package management — `apt`

```bash
apt install sublime-text      # install a package
apt remove sublime-text       # remove a package
apt update                    # refresh package lists (run before install)
apt upgrade                   # upgrade all installed packages
```

**Add a third-party repository (manual method):**

```bash
# 1. Download and trust the GPG key
wget -qO - https://example.com/key.gpg | sudo apt-key add -

# 2. Add the repo to sources
echo "deb https://example.com/apt stable main" | sudo tee /etc/apt/sources.list.d/example.list

# 3. Update so apt sees the new repo
sudo apt update

# 4. Install
sudo apt install package-name
```

**Remove a repository:**

```bash
add-apt-repository --remove ppa:PPA_Name/ppa    # PPA method
# or just delete the file:
rm /etc/apt/sources.list.d/example.list
sudo apt update
```

> GPG keys = trust verification. If the key doesn't match, apt refuses to install. This is why you add the key before the repo.

---

## Log files

Everything lives in `/var/log` — the OS rotates these automatically so they don't fill the disk.

```bash
ls /var/log                          # see what's being logged
cat /var/log/apache2/access.log      # every HTTP request to the web server
cat /var/log/apache2/error.log       # web server errors
cat /var/log/auth.log                # login attempts, sudo usage, SSH
cat /var/log/fail2ban.log            # brute force attempts that got blocked
cat /var/log/ufw.log                 # firewall activity
```

**Most useful for pentesting:**

| Log | What to look for |
|---|---|
| `auth.log` | Failed logins, who used sudo, SSH sessions |
| `apache2/access.log` | Every request — IPs, paths, user agents |
| `apache2/error.log` | Misconfigurations, crashes |
| `fail2ban.log` | Which IPs got banned and why |

```bash
grep "Failed password" /var/log/auth.log    # brute force attempts
grep "192.168.1.100" /var/log/apache2/access.log   # all requests from one IP
tail -f /var/log/apache2/access.log         # watch live traffic
```

> `tail -f` = live feed of a log. Useful for watching what's happening on a server in real time.

---

## Key insight

> **Permissions + directories = the map of a system.** Know who owns what, where secrets live, and where you can write — and you know exactly where to look after getting a shell.