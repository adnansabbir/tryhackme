---
layout: default
title: Vim
parent: Linux
nav_order: 3
---

# Vim

**What it is:** A terminal text editor available on basically every Linux system — nano might be missing, vim won't be.

**The fun thing:** Once it clicks, you never touch the mouse again. Edit files at the speed of thought.

---

## 3 modes — the golden rule

| Mode | Enter with | What you can do |
|---|---|---|
| **Normal** | `Esc` | Navigate, delete, copy, search, run commands — default on open |
| **Insert** | `i` | Type text |
| **Visual** | `v` | Select text, then run a command on just that part |

> Opened vim and nothing's working? Press `Esc` → `i`. Now you can type.

---

## Save & quit

```
:w          save
:q          quit
:wq         save and quit
:q!         quit WITHOUT saving
:wqa        save and quit ALL open tabs
```

<details markdown="1">
<summary>Edge cases</summary>

```
:w filename       save with a name (fixes "No file name" error)
:w!               force save read-only file (if you have permission)
:w !sudo tee %    save as root when you forgot sudo on open
```

> **`:w !sudo tee %`** — pipes the buffer through `tee` running as root. `%` = current file. No need to close and reopen.

> **"No file name" error** — opened vim with no filename (`vim` not `vim myfile.txt`). Fix with `:w myfile.txt`.

</details>

> Always `Esc` first, then type `:` commands.

---

## Navigation

| Key | What it does |
|---|---|
| `h j k l` | ← ↓ ↑ → |
| `w` | Start of next word |
| `e` | End of current word |
| `b` | Back one word |
| `0` | Start of line |
| `$` | End of line |
| `gg` | Top of file |
| `G` | Bottom of file |
| `:42` | Jump to line 42 |

---

## Inserting

| Key | What it does |
|---|---|
| `i` | Insert before cursor |
| `I` | Insert at start of line |
| `a` | Append after cursor |
| `A` | Append at end of line |
| `o` | New line below + insert |
| `O` | New line above + insert |

---

## Cut, copy, paste

| Key | What it does |
|---|---|
| `x` | Cut character under cursor |
| `dd` | Cut current line |
| `d$` | Cut to end of line |
| `yy` | Copy current line |
| `2yy` | Copy 2 lines (any number works) |
| `y$` | Copy to end of line |
| `p` | Paste below |
| `u` | Undo |
| `Ctrl + r` | Redo |

---

## Search

```
/password    search forward for "password"
?password    search backward for "password"
n            next match
N            previous match
```

> `/` triggers search mode — type anything after it. It's not the word "password" specifically, just whatever you want to find.

<details markdown="1">
<summary>Find & replace + multi-file search</summary>

**Find and replace:**

```
:%s/old/new/g    replace every "old" with "new" in the whole file
```

> `%` = whole file, `s` = substitute, `g` = all matches per line (drop `g` to replace only the first per line).

**Search across multiple files:**

```
:vimgrep /pattern/ **/*    search all files recursively
:cn                        next match
:cp                        previous match
:copen                     browse all matches in a list
```

> Results land in the quickfix list. `:copen` to see them all without leaving vim.

</details>


---

## Help

```
:help           main help file
:help gg        help for a specific command
```

---

## Key insight

> **Esc → normal. i → insert.** Get those two reflexive — everything else is just memorising shortcuts.
