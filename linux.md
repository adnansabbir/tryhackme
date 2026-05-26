---
layout: default
title: Linux
nav_order: 2
---

# Linux

**What it is:** The operating system you'll live in during 90% of security work. Fast, scriptable, and built for automation.

**The fun thing:** A single chained command can search an entire system for privilege escalation paths in seconds — no GUI, no clicking.

---

## Navigation basics

```bash
ls              # list files in current directory
ls -la          # include hidden files + permissions
cd Documents    # move into a directory
cd ..           # go up one level
cat file.txt    # print file contents
pwd             # print current directory path
```

---

## Flags & switches

Commands do their default thing unless you add flags. Flags = `-` + a letter (or `--` + a word).

```bash
ls            # default: list files (no hidden)
ls -a         # flag: show hidden files too (anything starting with .)
ls -la        # combine flags: hidden files + permissions + sizes
```

**When you don't know what flags exist:**

```bash
ls --help     # quick list of every option with a one-line description
man ls        # full manual page — scroll with arrows, / to search, q to quit
```

> `--help` = cheat sheet. `man` = full reference. When in doubt, check `man` first — it's always there, always accurate.

---

## Finding files — `find`

```bash
find -name passwords.txt       # find exact filename from current dir
find -name "*.txt"             # find all .txt files (wildcard)
find /etc -name "*.conf"       # search a specific directory
```

<details markdown="1">
<summary>Security-relevant find commands</summary>

```bash
find / -perm -4000 2>/dev/null    # SUID files — run as file owner (often root)
find / -writable 2>/dev/null      # files your user can write to
find / -name "*.log" 2>/dev/null  # every log file on the system
find / -mmin -60 2>/dev/null      # files modified in the last 60 minutes
```

> `2>/dev/null` silences "Permission denied" errors so output stays clean.

**Why SUID matters:** A SUID binary runs as its *owner*, not you. If it's owned by root and can be abused → root. Finding SUID files is one of the first things you do after getting a shell.

</details>

---

## Searching file contents — `grep`

```bash
grep "81.143.211.90" access.log          # find lines matching a value
grep -i "password" config.txt            # case-insensitive search
grep -r "api_key" ./                     # find api_key mentions in all files here
```

<details markdown="1">
<summary>Flag reference</summary>

| Flag | What it does |
|---|---|
| `-i` | Case-insensitive |
| `-n` | Show line numbers |
| `-v` | Invert — show non-matching lines |
| `-R` / `-r` | Recursive — search all files in directory |

</details>

---

## The pipe `|` — chain commands together

Output of one command becomes the input of the next.

```bash
cat access.log | grep "81.143.211.90" | wc -l
```
→ Read log → filter to one IP → count hits.

```bash
cat /etc/passwd | grep "/bin/bash"
```
→ Show only users with a real login shell.

---

## Shell operators

| Operator | What it does |
|---|---|
| `&` | Run in background — terminal stays usable |
| `&&` | Run second command only if first succeeded |
| `>` | Redirect to file — **overwrites** |
| `>>` | Redirect to file — **appends** |
| `\|` | Pipe output into next command |

<details markdown="1">
<summary>Examples</summary>

```bash
cp bigfile.iso /backup/ &             # copy in background, keep working
mkdir logs && cd logs                 # cd only runs if mkdir succeeded
echo "hey" > welcome.txt             # creates file (overwrites)
echo "hello" >> welcome.txt          # adds line (appends)
cat access.log | grep "404"          # filter log for 404 errors
```

</details>

---

## Practical one-liners

<details markdown="1">
<summary>Show one-liners</summary>

```bash
# How many 404 errors in the log?
cat access.log | grep "404" | wc -l

# Find all config files on the system
find / -name "*.conf" 2>/dev/null

# Search all files in current dir for the word "password"
grep -ri "password" ./

# Find recently changed files (last hour) — useful after running an exploit
find / -mmin -60 2>/dev/null | grep -v "/proc"

# List all users with a shell
cat /etc/passwd | grep "/bin/bash"
```

</details>

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

## Key insight

> **Linux efficiency = find + grep + pipe.** These three tools let you search an entire system — files, contents, permissions — in seconds. In a pentest, they're how you go from "I have a shell" to "I have root."