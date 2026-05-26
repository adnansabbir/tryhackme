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

## Finding files — `find`

```bash
find -name passwords.txt       # find exact filename from current dir
find -name "*.txt"             # find all .txt files (wildcard)
find /etc -name "*.conf"       # search a specific directory
```

**Security-relevant find commands:**

```bash
find / -perm -4000 2>/dev/null    # SUID files — run as file owner (often root)
find / -writable 2>/dev/null      # files your user can write to
find / -name "*.log" 2>/dev/null  # every log file on the system
find / -mmin -60 2>/dev/null      # files modified in the last 60 minutes
```

> `2>/dev/null` silences "Permission denied" errors so output stays clean.

**Why SUID matters in pentesting:** A SUID binary runs as its *owner*, not you. If a SUID binary is owned by root and can be abused, you can escalate to root. Finding SUID files is one of the first things you do after getting a shell.

---

## Searching file contents — `grep`

```bash
grep "81.143.211.90" access.log          # find lines matching a value
grep -i "password" config.txt            # case-insensitive search
grep -n "error" app.log                  # show line numbers
grep -v "200" access.log                 # show everything EXCEPT matches (invert)
grep -R "PRETTY_NAME" /etc/              # search recursively through all files
grep -r "api_key" ./                     # find api_key mentions in all files here
```

**Flag reference:**

| Flag | What it does |
|---|---|
| `-i` | Case-insensitive |
| `-n` | Show line numbers |
| `-v` | Invert — show non-matching lines |
| `-R` / `-r` | Recursive — search all files in directory |

---

## The pipe `|` — chain commands together

Output of one command becomes the input of the next. The most powerful operator in Linux.

```bash
cat access.log | grep "81.143.211.90" | wc -l
```
→ Read the log → filter to one IP → count how many lines = how many times that IP hit the server.

```bash
find / -perm -4000 2>/dev/null | sort
```
→ Find all SUID files → sort them alphabetically.

```bash
cat /etc/passwd | grep "/bin/bash"
```
→ Show only users with a real login shell (not service accounts).

---

## Shell operators

| Operator | What it does |
|---|---|
| `&` | Run command in the background — terminal stays usable |
| `&&` | Run second command only if first succeeded |
| `>` | Redirect output to a file — **overwrites** existing content |
| `>>` | Redirect output to a file — **appends** to existing content |
| `\|` | Pipe — pass output of one command as input to the next |

**Examples:**

```bash
cp bigfile.iso /backup/ &             # copy in background, keep working

mkdir logs && cd logs                 # cd only runs if mkdir succeeded

echo "hey" > welcome.txt             # creates file with "hey" (overwrites)
echo "hello" >> welcome.txt          # adds "hello" on a new line

cat access.log | grep "404"          # pipe: filter log for 404 errors
```

---

## Practical one-liners

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

---

## Key insight

> **Linux efficiency = find + grep + pipe.** These three tools let you search an entire system — files, contents, permissions — in seconds. In a pentest, they're how you go from "I have a shell" to "I have root."
