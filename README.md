# Ansible — Quantum Entanglement Communication

> *"The ansible was a device that could communicate faster than light."*
> — Ursula K. Le Guin, *Rocannon's World* (1966)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-ansible--quantum.vercel.app-00d4ff?style=flat-square&logo=vercel)](https://ansible-quantum.vercel.app)
[![Whitepaper](https://img.shields.io/badge/Whitepaper-Read%20Now-7c3aed?style=flat-square&logo=bookstack)](https://ansible-quantum.vercel.app/paper)
[![Simulator](https://img.shields.io/badge/Simulator-Try%20It-10b981?style=flat-square&logo=atom)](https://ansible-quantum.vercel.app/simulator)
[![License: MIT](https://img.shields.io/badge/Code-MIT-blue?style=flat-square)](LICENSE)
[![License: CC BY 4.0](https://img.shields.io/badge/Paper-CC%20BY%204.0-lightgrey?style=flat-square)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)

---

A theoretical framework for **superluminal information transfer** via orbital quantum entanglement relay networks — and a futuristic web presence to present it.

This repository contains both:
1. **The Ansible Hypothesis** — a 12-section theoretical whitepaper proposing a mechanism for FTL communication via a modified non-local quantum Hamiltonian and a constellation of entangled orbital relay satellites
2. **The Ansible Site** — a dark-themed, state-of-the-art Next.js web application with interactive orbital visualization, KaTeX-rendered mathematics, and a live Mars communication simulator

---

## What is the Ansible Hypothesis?

The prohibition against faster-than-light information transfer stands as one of the most consequential constraints in modern physics. The Ansible Hypothesis proposes a narrow but physically coherent pathway around this prohibition through a modification of the quantum Hamiltonian governing entangled systems.

The core innovation is a non-local coupling term λ_NL that permits correlated state evolution without violating unitarity — combined with a recognition that orbital space provides qualitatively superior conditions for maintaining high-fidelity entangled photon pairs:

```
H_Ansible = H_A ⊗ I_B + I_A ⊗ H_B + λ_NL · H_NL(A,B)
```

**Key claims:**
- Earth–Mars classical radio delay: 3–22 minutes
- Proposed Ansible channel latency: < 50 milliseconds
- Target entanglement fidelity: 99.97%
- Theoretical channel capacity: ~10⁶ bits/second at scale

This is **speculative theoretical science** in the tradition of the original EPR paper — not a claim of achievement, but an invitation to empirical investigation.

---

## Repository Structure

```
Ansible/
├── site/                    # Next.js web application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── page.tsx     # Landing page
│   │   │   ├── paper/       # Whitepaper reader
│   │   │   └── simulator/   # Mars Quantum Simulator
│   │   ├── components/
│   │   │   ├── home/        # Hero, orbital visualization
│   │   │   ├── paper/       # KaTeX-rendered whitepaper
│   │   │   └── simulator/   # Interactive quantum simulator
│   │   └── lib/
│   │       └── paperData.json  # Full whitepaper structured data
│   └── package.json
├── legacy/                  # Original HTML prototypes
│   ├── ansible.html         # First version of the whitepaper
│   ├── AnsibleSharp.html    # Sharpe (2025) updated version
│   └── quantum-simulator-mars.html  # React simulator prototype
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── CHANGELOG.md
├── SECURITY.md
├── CITATION.cff
└── LICENSE
```

---

## Getting Started

### Prerequisites
- Node.js 20.9+
- npm

### Local Development

```bash
git clone https://github.com/exchekinc/Ansible.git
cd Ansible/site
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The root `vercel.json` configures Vercel to use `site/` as the build root.

```bash
cd Ansible
vercel --prod
```

Or connect the GitHub repo to a Vercel project and set **Root Directory** to `site/`.

---

## The Site

Built with a deep-space aesthetic — quantum cyan, entanglement purple, glassmorphism cards, and an animated orbital network canvas.

| Page | Description |
|------|-------------|
| `/` | Landing page with animated satellite orbital visualization, key stats, and architecture overview |
| `/paper` | Full 12-section whitepaper with sticky TOC sidebar, KaTeX math rendering, and citations |
| `/simulator` | Interactive Mars quantum communication simulator with tunable λ/κ parameters |

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Math | KaTeX via rehype-katex + remark-math |
| Markdown | react-markdown |
| Animation | Canvas 2D API |
| Deployment | Vercel |

---

## The Whitepaper

**"The Ansible Hypothesis: A Theoretical Framework for Quantum Non-Local Information Transfer via Orbital Entanglement Relay Networks"**

*M.R. Dula, Claude 3.7 Sonnet — 2025*

### Sections

1. Introduction: The Communication Horizon Problem
2. Modified Quantum Non-Locality: The Non-Local Hamiltonian
3. The No-Communication Theorem: Evasion, Not Violation
4. Connection to ER=EPR and Holographic Duality
5. Information-Theoretic Bounds and Bekenstein Limits
6. Orbital Relay Architecture and Quantum Infrastructure
7. The Ansible Protocol Stack
8. Quantum Error Mitigation in Space Environments
9. Comparison to Classical Communication Paradigms
10. Experimental Verification and Falsification Strategies
11. Theoretical Objections and Responses
12. Conclusion: Toward the Ansible

[Read the full paper →](https://ansible-quantum.vercel.app/paper)

---

## Citation

If you build on, reference, or critique this work, please cite it:

```bibtex
@misc{dula2025ansible,
  author       = {Dula, M. R. and {Claude 3.7 Sonnet}},
  title        = {The Ansible Hypothesis: A Theoretical Framework for
                  Quantum Non-Local Information Transfer via Orbital
                  Entanglement Relay Networks},
  year         = {2025},
  institution  = {Claude Assisted Discovery},
  note         = {Speculative theoretical framework},
  url          = {https://ansible-quantum.vercel.app/paper}
}
```

Or see [CITATION.cff](CITATION.cff) for structured citation data.

---

## Contributing

We welcome contributions to both the theoretical framework and the web implementation. See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

**Ways to contribute:**
- Theoretical critique and counter-proposals
- Mathematical corrections or extensions
- Experimental verification proposals
- UI/UX improvements to the site
- Simulator enhancements

---

## Epistemological Disclaimer

This work is a **speculative theoretical framework**. The Ansible Hypothesis challenges the no-communication theorem and standard quantum mechanics. We are aware that:

- The no-communication theorem is well-established
- Standard quantum mechanics prohibits FTL signaling
- This framework requires experimental falsification to gain scientific standing

We present it not as a proven result but as a Lakatosian research program — a hard core of theoretical commitments with a protective belt of auxiliary hypotheses, generating falsifiable predictions. Science advances by proposing bold ideas and subjecting them to rigorous empirical test.

---

## Authors

**M.R. Dula** — ExChek Inc.
[matt@mrdula.co](mailto:matt@mrdula.co)

**Claude 3.7 Sonnet** — Anthropic
*Claude-assisted discovery*

---

## License

- **Code** (the `site/` directory): [MIT License](LICENSE)
- **Whitepaper content**: [Creative Commons Attribution 4.0 International](LICENSE)

© 2025 M.R. Dula / ExChek Inc.
