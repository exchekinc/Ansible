# Contributing to Ansible

Thank you for your interest in contributing. This project exists at the intersection of theoretical physics, quantum information theory, and open-source software — contributions across all three domains are welcome.

## Table of Contents

- [Philosophy](#philosophy)
- [Types of Contributions](#types-of-contributions)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Contribution Standards](#contribution-standards)
- [Theoretical Contributions](#theoretical-contributions)
- [Code Contributions](#code-contributions)
- [Pull Request Process](#pull-request-process)
- [Recognition](#recognition)

---

## Philosophy

The Ansible Hypothesis is **speculative science** — bold, rigorous, and empirically falsifiable. We hold the following values in how we build together:

**Intellectual courage over orthodoxy.** We do not dismiss ideas because they challenge established consensus. We evaluate claims by their internal consistency, mathematical rigor, and experimental testability.

**Rigor over rhetoric.** Enthusiasm for the theory is not a substitute for mathematics. Every claim should be derivable; every derivation should be checkable.

**Openness over gatekeeping.** Science belongs to everyone. We actively welcome contributions from outside traditional academia — including those made in collaboration with AI systems.

**Constructive criticism as a gift.** A well-reasoned critique that identifies a flaw in the theory is more valuable than praise. We treat rigorous objections as opportunities for refinement.

---

## Types of Contributions

### Theoretical

- **Mathematical extensions** — Derive new consequences of the non-local Hamiltonian
- **Objections and rebuttals** — Identify weaknesses in the theory; propose fixes
- **Experimental proposals** — Suggest concrete experiments that could falsify or confirm the hypothesis
- **Literature connections** — Identify relevant prior work we've missed or mischaracterized
- **Formalism improvements** — Sharpen definitions, tighten proofs, improve notation

### Technical

- **Site improvements** — UI/UX enhancements, accessibility, performance
- **Simulator features** — More realistic quantum noise models, visualization improvements
- **Math rendering** — KaTeX equation improvements, new equations
- **New pages** — Data visualizations, appendices, comparison tools
- **Infrastructure** — CI/CD, testing, build optimizations

### Documentation

- **Corrections** — Fix errors in the whitepaper or site content
- **Clarity** — Improve explanations for broader audiences
- **Translations** — Make the theory accessible in other languages

---

## Getting Started

### 1. Fork & Clone

```bash
git clone https://github.com/exchekinc/Ansible.git
cd Ansible/site
npm install
npm run dev
```

### 2. Create a Branch

```bash
git checkout -b your-branch-name
```

Branch naming conventions:
- `theory/section-name` — changes to theoretical content
- `feat/feature-name` — new features
- `fix/bug-description` — bug fixes
- `docs/what-changed` — documentation updates
- `refactor/what-changed` — code refactoring

### 3. Make Changes

See development guidelines below.

### 4. Open a Pull Request

Use the PR template and describe your changes clearly.

---

## Development Workflow

### Local Setup

```bash
cd site
npm install
npm run dev      # Development server at http://localhost:3000
npm run build    # Production build check
npm run lint     # ESLint
```

Always run `npm run build` before opening a PR to catch TypeScript and Next.js errors.

### Whitepaper Data

The whitepaper content lives in `site/src/lib/paperData.json`. The structure is:

```typescript
{
  title: string
  subtitle: string
  abstract: string
  sections: Array<{
    id: string
    number: string
    title: string
    content: string        // Markdown + LaTeX ($$...$$)
    subsections?: Array<{ id, number, title, content }>
  }>
  keyInsights: Array<{ title, description }>
  stats: Array<{ label, value, unit }>
  references: Array<{ number, citation }>
}
```

Content uses standard Markdown with LaTeX math:
- Inline math: `$...$`
- Display math: `$$...$$`

### Adding a Section

1. Edit `site/src/lib/paperData.json`
2. Add your section object with a unique `id` (kebab-case)
3. Verify math renders correctly by running `npm run dev`
4. The TOC sidebar updates automatically

---

## Contribution Standards

### For theoretical content

- **Define all variables** before use
- **Cite prior work** — add entries to the `references` array
- **Flag speculative claims** explicitly — distinguish what follows from the framework vs. additional conjectures
- **Acknowledge objections** — if you know your claim is controversial, address it in the text
- **Avoid overstatement** — "we propose" and "we conjecture" are preferable to "we prove" unless you actually prove it

### For code

- **TypeScript** — all new files should be `.tsx` or `.ts`
- **No inline styles in new components** — use CSS variables defined in `globals.css`
- **Accessibility** — semantic HTML, keyboard navigability, ARIA labels where needed
- **Performance** — no heavy client-side dependencies without justification
- **Comments** — only when the *why* is non-obvious; never explain what the code does

### For prose

- Clear, precise, economical writing — this is science, not marketing
- Avoid hedging chains: "might possibly perhaps suggest" → "suggests"
- Avoid filler qualifiers: "very", "really", "quite", "basically"

---

## Theoretical Contributions

### Proposing a modification to the theory

Open a GitHub Issue using the **Theory Discussion** template before writing code or editing the JSON. Explain:
1. What the current framework states
2. What you believe is incorrect or incomplete
3. Your proposed modification or extension
4. How it could be tested empirically

This allows discussion before significant effort is invested.

### Citing your contributions

Substantial theoretical contributions will be acknowledged in the paper's authors/acknowledgments section per mutual agreement. Open a PR and we'll discuss.

---

## Pull Request Process

1. **Describe the change** — what, why, and how
2. **Link to any related issues**
3. **Verify the build passes** (`npm run build`)
4. **For theory PRs** — summarize the mathematical change and any new references
5. **Request review** from a maintainer

PRs will be reviewed within 7 days. We aim for constructive, specific feedback.

### Commit style

```
type(scope): short description

Longer description if needed (why, not what).
```

Types: `feat`, `fix`, `theory`, `docs`, `refactor`, `style`, `chore`

---

## Recognition

We believe in naming contributors. Substantial contributions are recognized:

- In the repository's [CHANGELOG.md](CHANGELOG.md)
- In the site's acknowledgments section (for theoretical contributions)
- As co-authors for significant theoretical extensions (by mutual agreement)

---

## Questions?

Open a GitHub Discussion or reach out at [matt@mrdula.co](mailto:matt@mrdula.co).

We're building something genuinely unusual here. The more minds, the better.
