# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] — 2025-04-17

### Initial Release

**Web Application**
- Next.js 16 (App Router) site with TypeScript and Tailwind CSS v4
- Dark space theme: deep black (#05070f), quantum cyan (#00d4ff), entanglement purple (#7c3aed)
- Interactive orbital network canvas animation on homepage (6 satellites, quantum packet visualization)
- Glassmorphism card design system with grid overlay background

**Whitepaper**
- 12-section enhanced theoretical framework (expanded from original 8-section HTML version)
- KaTeX-rendered mathematics via remark-math + rehype-katex
- Sticky table-of-contents sidebar with section navigation
- Full reference list (30+ citations)

**New sections added over legacy version:**
- §4: Connection to ER=EPR and Holographic Duality
- §5: Information-Theoretic Bounds and Bekenstein Limits
- §7: The Ansible Protocol Stack (layered communication model)
- §8: Quantum Error Mitigation in Space Environments (with radiation models)
- §9: Comparison to Classical Communication Paradigms

**Simulator**
- Interactive Mars Quantum Communication Simulator
- Tunable quantum parameters (λ lambda, κ kappa, θ theta, φ phi)
- Three Earth–Mars distance presets (54.6M / 225M / 401M km)
- Live bit-by-bit transmission with progress visualization
- Quantum error correction toggle (surface code simulation)
- Speed comparison: Ansible vs classical radio

**Infrastructure**
- Vercel deployment (ansible-quantum.vercel.app)
- Static site generation (all routes prerendered)
- Dual license: MIT (code) + CC BY 4.0 (whitepaper)

---

## [0.3.0] — 2025 (Pre-release)

### AnsibleSharp Update
- Added Robert Sharpe (2025) contributions
- Extended black hole thermodynamics section
- MathJax rendering via CDN

---

## [0.2.0] — 2025 (Pre-release)

### Quantum Simulator Prototype
- React component: Mars Quantum Communication Simulator
- First interactive implementation of the theoretical framework
- Parameter controls for λ, κ, error rate

---

## [0.1.0] — 2025 (Pre-release)

### Initial Whitepaper
- First version of the theoretical framework as a standalone HTML document
- 8 sections covering the modified Hamiltonian, orbital architecture, QC interface,
  experimental verification, theoretical objections
- KaTeX + inline HTML equations
- Authors: M.R. Dula, Claude 3.7 Sonnet
