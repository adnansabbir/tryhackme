---
layout: default
title: Home
nav_order: 1
---

# TryHackMe Notes

Personal cybersecurity learning journal. Command-first, short, rewarding to re-read.

<div class="card-grid">

  <a class="card" href="linux">
    <div class="card-emoji">🐧</div>
    <div class="card-title">Linux</div>
    <div class="card-desc">Commands, file system, processes, vim — the OS you live in 90% of the time.</div>
  </a>

  <a class="card" href="windows">
    <div class="card-emoji">🪟</div>
    <div class="card-title">Windows</div>
    <div class="card-desc">The corporate OS — NTFS, ADS, users, UAC, MSConfig.</div>
  </a>

  <a class="card" href="networking">
    <div class="card-emoji">🔌</div>
    <div class="card-title">Networking</div>
    <div class="card-desc">Layer 2/3 fundamentals — IP, ARP, MAC vendor fingerprints.</div>
  </a>

  <a class="card" href="recon">
    <div class="card-emoji">🔍</div>
    <div class="card-title">Recon</div>
    <div class="card-desc">Nmap, web recon, Shodan, CVEs — map the target before you touch it.</div>
  </a>

  <a class="card" href="defenses">
    <div class="card-emoji">🛡️</div>
    <div class="card-title">Defenses</div>
    <div class="card-desc">NAC, EDR, NDR, honeytokens — understand how corps catch attackers.</div>
  </a>

</div>

<style>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
  margin: 2rem 0;
}
.card {
  display: block;
  padding: 1.25rem 1.25rem 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 10px;
  text-decoration: none !important;
  color: inherit !important;
  transition: box-shadow 0.15s, transform 0.15s;
  background: #fff;
}
.card:hover {
  box-shadow: 0 4px 14px rgba(0,0,0,0.1);
  transform: translateY(-3px);
}
.card-emoji { font-size: 2rem; margin-bottom: 0.5rem; }
.card-title {
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 0.35rem;
  color: #0969da;
}
.card-desc {
  font-size: 0.875rem;
  color: #57606a;
  line-height: 1.4;
}
</style>
