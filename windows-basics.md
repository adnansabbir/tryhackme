---
layout: default
title: Basics
parent: Windows
nav_order: 1
---

# Windows Basics

**What it is:** The dominant OS in both home and corporate networks — which is exactly why it's the #1 target for hackers and malware.

**The fun thing:** Understanding Windows from the inside is what separates a junior from a senior in security. Most corporate networks run Windows.

---

## Version history (why it matters)

| Version | Status | Notes |
|---|---|---|
| Windows XP | End of life | Still found in legacy corp environments — no patches = easy target |
| Windows Vista | Dead | Widely rejected, short-lived |
| Windows 7 | End of life (2020) | Still lurking in hospitals, factories |
| Windows 8.x | Dead | Short-lived like Vista |
| Windows 10 | End of life Oct 2025 | Still dominant in corp networks |
| Windows 11 | Current (desktop) | Home and Pro editions |
| Windows Server 2025 | Current (server) | What you'll find on corporate servers |

> End-of-life = no more security patches. Finding an EOL Windows box on a network is like finding an unlocked door.

---

## File system — NTFS

Modern Windows uses **NTFS** (New Technology File System). Before it: FAT16/FAT32 and HPFS.

| File System | Still used? | Notes |
|---|---|---|
| FAT32 | Yes | USB drives, SD cards — max 4GB file size |
| NTFS | Yes | Windows installs, servers — no file size limit |

**NTFS advantages over FAT:**

- Files larger than 4GB
- Per-file/folder permissions
- Journaling — auto-repairs on crash
- Compression and encryption (EFS)

---

### NTFS permissions

Right-click file/folder → Properties → Security tab to view.

| Permission | What it allows |
|---|---|
| Full Control | Read, write, modify, delete, change permissions |
| Modify | Read, write, modify, delete — but not change permissions |
| Read & Execute | View contents and run executables |
| List Folder Contents | See what's inside a folder |
| Read | View only |
| Write | Create/modify files, not delete |

---

### Alternate Data Streams (ADS)

Every NTFS file has one main data stream. ADS lets a file have **additional hidden streams** — invisible in Windows Explorer, not counted in the displayed file size.

```
readme.txt          ← visible, shows 0 bytes
readme.txt:payload  ← hidden ADS stream, can be any size
```

**Why Windows has it:** Originally for Mac/Windows interop (macOS had the same concept). Windows still uses it legitimately — browsers write a `Zone.Identifier` stream to every downloaded file. That's what triggers the "file downloaded from internet" warning.

**Why it's dangerous:**

- Malware hides executables inside ADS on innocent-looking files
- The file appears empty — casual inspection misses it entirely
- On older Windows versions, you can execute code directly from an ADS stream without extracting it

```powershell
Get-Item -Path file.txt -Stream *    # list all streams on a file
```

> In pentesting — ADS is a hiding technique after landing on a box. In forensics — ADS scanning is standard. A 0-byte file isn't always empty.

---

## Key Windows directories

| Path | What's in it |
|---|---|
| `C:\Windows` | The OS itself — location set by `%windir%` env variable |
| `C:\Windows\System32` | Critical OS files and tools — **don't delete anything here** |
| `C:\Users\<name>` | User's home directory |
| `C:\Program Files` | Installed 64-bit applications |
| `C:\Program Files (x86)` | Installed 32-bit applications |
| `C:\Temp` or `%TEMP%` | Temporary files — writable, useful drop location |

**Environment variables** store OS info — paths, settings, processor count. Reference them with `%variable%`:

```
%windir%       → C:\Windows  (or wherever Windows is installed)
%TEMP%         → current user's temp folder
%USERPROFILE%  → C:\Users\username
%SystemRoot%   → same as %windir%
```

> `System32` is where most Windows tools live — and where attackers look for things to abuse. Treat it like `/etc` + `/bin` combined on Linux.

---

## User accounts

Two types on a local Windows system:

| Type | What they can do |
|---|---|
| **Administrator** | Add/remove users, install software, modify system settings |
| **Standard User** | Only change their own files/folders — no system-level changes |

**User profiles** live at `C:\Users\<username>` — created on first login. Each profile contains Desktop, Documents, Downloads, Music, Pictures.

**Manage users via GUI:**
- Start Menu → search "Other Users" → Settings
- Or: Start Menu → Run → `lusrmgr.msc` (Local Users and Groups)

**`lusrmgr.msc`** — the real tool:

- **Users** — all local accounts, enable/disable, reset passwords
- **Groups** — local groups with permissions; users inherit permissions from their groups

```
lusrmgr.msc    open Local Users and Groups manager
```

> In pentesting — enumerating local users and group memberships is one of the first steps after getting a shell. Admins group membership = you have the keys.

---

## UAC — User Account Control

**The problem:** Most home users run as local admins. Malware running under that account inherits full admin rights — game over.

**The fix:** Even if you're an admin, your session runs with standard privileges by default. Actions that need elevation trigger a UAC prompt.

| Scenario | What happens |
|---|---|
| Admin user runs elevated action | UAC popup — confirm with a click |
| Standard user runs elevated action | UAC popup — must enter admin password |
| Built-in Administrator account | UAC does **not** apply by default |

**The shield icon** on a program = UAC will prompt before it runs.

**How it works under the hood:**
- Admin users get two tokens on login: a standard token and an elevated token
- Windows uses the standard token by default
- UAC switches to the elevated token only when confirmed
- This limits blast radius if malware runs — it gets the standard token, not the elevated one

> UAC is not a security boundary — it's a speed bump. A determined attacker can bypass it. But it stops most opportunistic malware from silently getting admin rights.

Read more: [How UAC works — Microsoft docs](https://learn.microsoft.com/en-us/windows/security/application-security/application-control/user-account-control/how-it-works)

---

## System Configuration (MSConfig)

Advanced troubleshooting tool — mainly used to diagnose startup issues. Requires local admin rights.

```
msconfig    open via Run (Win + R)
```

[Microsoft docs — MSConfig troubleshooting](https://learn.microsoft.com/en-us/troubleshoot/windows-client/performance/system-configuration-utility-troubleshoot-configuration-errors)

**5 tabs:**

| Tab | What it does |
|---|---|
| General | Choose what loads on boot: Normal, Diagnostic, or Selective |
| Boot | Boot options — safe mode, timeout, etc. |
| Services | List all services (running or stopped) |
| Startup | Redirects you to Task Manager for startup management |
| Tools | Shortcuts to common Windows admin utilities |

> **Tip:** MSConfig Services tab shows the manufacturer for each service. `PsShutdown` (by Sysinternals) is visible here — useful for spotting third-party or suspicious services.

**Useful commands from the Tools tab:**

```
control.exe                                                         open Control Panel
control.exe /name Microsoft.Troubleshooting                         open Troubleshooting wizard
```

**Startup items on Windows Server** — Task Manager doesn't show a Startup tab. Use:

```
shell:startup    type in Run (Win + R) — opens the startup folder directly
```

---

## Advanced System Settings

Search "View advanced system settings" or `Win + R` → `sysdm.cpl`.

<details markdown="1">
<summary>Page file & crash dumps</summary>

**Page file** — virtual memory on disk when RAM is full. View/modify: Advanced → Performance → Settings → Advanced tab.

**Crash dumps** — created on Blue Screen of Death (BSOD). View/modify: Advanced → Startup and Recovery → Settings.

| Dump type | What it captures |
|---|---|
| Small memory dump (256 KB) | Minimal — just the stop code |
| Kernel memory dump | Kernel memory only |
| Complete memory dump | Full RAM snapshot |
| Automatic memory dump | Windows decides |

> Crash dumps are gold for forensics — a complete dump contains everything in RAM at the time of crash, including decrypted data, credentials, and running processes.

</details>

---
