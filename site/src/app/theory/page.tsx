'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, BookOpen } from 'lucide-react';

// Sections mirror paperData.json. Hardcoded here so the page can stay a client
// component without pulling the full paper payload into the bundle.
type Subsection = { number: string; title: string; id: string; isNew?: boolean };
type Section = {
  number: string;
  id: string;
  title: string;
  blurb: string;
  color: string;
  subsections: Subsection[];
};

const sections: Section[] = [
  {
    number: '1',
    id: 'introduction',
    title: 'The Communication Horizon Problem',
    blurb: 'Why deep-space latency is civilization-scale, and what Le Guin and Card had in mind.',
    color: '#00d4ff',
    subsections: [
      { number: '1.1', title: 'Historical Context: From EPR to Entanglement Engineering', id: 'intro-history' },
      { number: '1.2', title: 'Scope and Epistemological Status', id: 'intro-scope' },
    ],
  },
  {
    number: '2',
    id: 'modified-hamiltonian',
    title: 'The Non-Local Hamiltonian',
    blurb: 'A minimal coupling term that leaves the standard formalism intact and lets H_NL do the rest.',
    color: '#7c3aed',
    subsections: [
      { number: '2.1', title: 'Standard Formalism and Its Constraints', id: 'standard-formalism' },
      { number: '2.2', title: 'The Non-Local Coupling Term', id: 'non-local-coupling' },
      { number: '2.3', title: 'Modified Time Evolution and Signaling Mechanism', id: 'modified-evolution' },
      { number: '2.4', title: 'Constraints on the Coupling Constant', id: 'coupling-constraints' },
      { number: '2.5', title: 'Lorentz-Covariant Formulation of H_NL', id: 'lorentz-covariant-hnl' },
      { number: '2.6', title: 'Unitarity and Higher-Order Consistency of H_NL', id: 'unitarity-higher-order', isNew: true },
    ],
  },
  {
    number: '3',
    id: 'no-communication',
    title: 'No-Communication: Evasion, Not Violation',
    blurb: 'Ansible does not break the theorem. It operates where the theorem\u2019s premises cease to hold.',
    color: '#10b981',
    subsections: [
      { number: '3.1', title: 'Precise Statement of the Theorem', id: 'theorem-statement' },
      { number: '3.2', title: 'The Evasion: Non-Local Hamiltonian Dynamics', id: 'evasion-mechanism' },
      { number: '3.3', title: 'Eberhard\u2019s Theorem and Its Limitations', id: 'eberhard' },
    ],
  },
  {
    number: '4',
    id: 'er-epr',
    title: 'ER=EPR and Holographic Duality',
    blurb: 'Treating entanglement as geometry \u2014 and a traversable ER bridge as the mechanism.',
    color: '#00d4ff',
    subsections: [
      { number: '4.1', title: 'The ER=EPR Conjecture: Core Content', id: 'er-epr-basics' },
      { number: '4.2', title: 'Traversable Wormholes and the Ansible Mechanism', id: 'traversable-wormholes' },
      { number: '4.3', title: 'Holographic Entropy and Ryu-Takayanagi', id: 'holographic-entropy' },
      { number: '4.4', title: 'The Holographic Channel Capacity', id: 'holographic-channel' },
    ],
  },
  {
    number: '5',
    id: 'information-theory',
    title: 'Information-Theoretic Bounds',
    blurb: 'What Bekenstein, Holevo, and horizon thermodynamics permit \u2014 and what they forbid.',
    color: '#f59e0b',
    subsections: [
      { number: '5.1', title: 'The Bekenstein Bound', id: 'bekenstein-bound' },
      { number: '5.2', title: 'The Holevo Bound and Quantum Channel Capacity', id: 'holevo-bound' },
      { number: '5.3', title: 'Entropy Production and Thermodynamic Consistency', id: 'entropy-production' },
      { number: '5.4', title: 'Channel Capacity Scaling with Distance', id: 'channel-capacity-scaling' },
      { number: '5.5', title: 'Bekenstein Bound and Black-Hole Thermodynamic Consistency', id: 'bekenstein-derivation', isNew: true },
    ],
  },
  {
    number: '6',
    id: 'orbital-architecture',
    title: 'Orbital Relay Architecture',
    blurb: 'Why the engineering path runs through orbit, and how it aligns with funded missions.',
    color: '#00d4ff',
    subsections: [
      { number: '6.1', title: 'Why Orbital Platforms Enable the Ansible System', id: 'why-orbit' },
      { number: '6.2', title: 'Constellation Architecture and Link Geometry', id: 'constellation-design' },
      { number: '6.3', title: 'Quantum Memory Specifications', id: 'quantum-memory-nodes' },
      { number: '6.4', title: 'Alignment with Near-Term Quantum Mission Programs', id: 'near-term-mission-alignment' },
    ],
  },
  {
    number: '7',
    id: 'protocol-stack',
    title: 'The Ansible Protocol Stack',
    blurb: 'A layered design that separates quantum physics from classical synchronization.',
    color: '#7c3aed',
    subsections: [
      { number: '7.1', title: 'Stack Overview and Design Philosophy', id: 'layer-overview' },
      { number: '7.2', title: 'Layer 1: Quantum Physical Layer', id: 'physical-layer' },
      { number: '7.3', title: 'Layer 2: Quantum Link Layer and Fidelity Management', id: 'quantum-link-layer' },
      { number: '7.4', title: 'Layer 4: Entanglement Transport Protocol', id: 'transport-layer' },
      { number: '7.5', title: 'Layer 5: Synchronization and the Classical Sideband', id: 'synchronization-layer' },
    ],
  },
  {
    number: '8',
    id: 'error-correction-space',
    title: 'Quantum Error Mitigation in Space',
    blurb: 'Surface codes plus Reed-Solomon concatenation to survive the radiation environment.',
    color: '#10b981',
    subsections: [
      { number: '8.1', title: 'The Space Radiation Environment: Physical Models', id: 'radiation-environment' },
      { number: '8.2', title: 'Decoherence Channels and Rate Models', id: 'decoherence-model' },
      { number: '8.3', title: 'Surface Codes and Reed-Solomon Concatenation', id: 'surface-codes' },
      { number: '8.4', title: 'Dynamical Decoupling and Sympathetic Cooling', id: 'dynamical-decoupling' },
    ],
  },
  {
    number: '9',
    id: 'comparison-classical',
    title: 'Comparison to Classical Paradigms',
    blurb: 'Where radio, optical, and QKD succeed \u2014 and where Ansible would pick up the baton.',
    color: '#f59e0b',
    subsections: [
      { number: '9.1', title: 'Radio Frequency Deep-Space Communication', id: 'radio-comparison' },
      { number: '9.2', title: 'Free-Space Optical and Laser Communication', id: 'optical-comparison' },
      { number: '9.3', title: 'Quantum Key Distribution: Precedent and Contrast', id: 'quantum-key-comparison' },
    ],
  },
  {
    number: '10',
    id: 'experimental-verification',
    title: 'Verification and Falsification',
    blurb: 'A three-tier experimental program with explicit go/no-go milestones.',
    color: '#00d4ff',
    subsections: [
      { number: '10.1', title: 'Tier 1: Laboratory Bell Violation at Ultra-High Fidelity', id: 'tier1-experiment' },
      { number: '10.2', title: 'Tier 2: Direct Signaling Attempt with Quantum Memory', id: 'tier2-experiment' },
      { number: '10.3', title: 'Tier 3: Orbital Demonstration Mission', id: 'tier3-experiment' },
      { number: '10.4', title: 'Development Milestones and Go/No-Go Decision Points', id: 'milestones' },
    ],
  },
  {
    number: '11',
    id: 'theoretical-objections',
    title: 'Objections and Responses',
    blurb: 'The serious critiques \u2014 causality, thermodynamics, no-signaling \u2014 taken on directly.',
    color: '#a78bfa',
    subsections: [
      { number: '11.1', title: 'The Causality Paradox and Tachyonic Antitelephone', id: 'causality-objection' },
      { number: '11.2', title: 'Maxwell\u2019s Demon and Entanglement Harvesting', id: 'thermodynamic-objection' },
      { number: '11.3', title: 'Constraints from Quantum Gravity', id: 'quantum-gravity-constraint' },
      { number: '11.4', title: 'Quantitative Bounds from Precision Tests', id: 'quantitative-bounds-precision-tests' },
      { number: '11.5', title: 'Reconciliation with the No-Signaling Theorem', id: 'no-signaling-reconciliation', isNew: true },
      { number: '11.6', title: 'Two-Tier Causality in Full Quantum Gravity', id: 'two-tier-quantum-gravity', isNew: true },
    ],
  },
  {
    number: '12',
    id: 'conclusion',
    title: 'Toward the Ansible',
    blurb: 'Framed as a Lakatosian research program \u2014 not a claim, a disciplined path.',
    color: '#10b981',
    subsections: [
      { number: '12.1', title: 'Future Theoretical Directions', id: 'future-directions' },
      { number: '12.2', title: 'A Foundational Research Program', id: 'foundational-research-program', isNew: true },
    ],
  },
  {
    number: 'A',
    id: 'appendix-a',
    title: 'Appendix A: Explicit Lorentz-Covariant Form of H_NL',
    blurb: 'Weak-field expansion giving a closed leading-order Hamiltonian density handed to any EFT practitioner.',
    color: '#f59e0b',
    subsections: [
      { number: 'A.1', title: 'Starting action and the weak-field expansion', id: 'appendix-a-1', isNew: true },
      { number: 'A.2', title: 'Choice of the scalar kernel G(x-y)', id: 'appendix-a-2', isNew: true },
      { number: 'A.3', title: 'Leading-order Hamiltonian density', id: 'appendix-a-3', isNew: true },
      { number: 'A.4', title: 'Reduction to the main-text Hamiltonian', id: 'appendix-a-4', isNew: true },
    ],
  },
];

export default function TheoryPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen" style={{ background: '#05070f' }}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
              letterSpacing: '0.08em',
            }}
          >
            <Compass size={12} />
            THEORY AT A GLANCE &middot; v1.2
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="cinematic-title mb-5"
            style={{
              color: '#e8eaf0',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              letterSpacing: '-0.03em',
            }}
          >
            Theory at a Glance
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto text-base leading-relaxed"
            style={{ color: '#8b92a9' }}
          >
            Twelve sections. One coherent argument. From the non-local Hamiltonian through
            ER=EPR, Bekenstein compatibility, and a three-tier falsification program &mdash; the
            whitepaper in structural outline.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-6 inline-flex items-center gap-2 text-xs"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: '#5a6070',
              letterSpacing: '0.2em',
            }}
          >
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ background: '#f59e0b' }}
            />
            NEW IN v1.2 &middot; 5 SUBSECTIONS HIGHLIGHTED
          </motion.div>
        </div>

        {/* Section grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sections.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-8%' }}
              transition={{ duration: 0.6, delay: (i % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="glass rounded-2xl p-6 relative overflow-hidden group flex flex-col"
              style={{ minHeight: 320 }}
            >
              {/* Faded section number */}
              <div
                className="absolute -right-3 -top-4 pointer-events-none numeric-ghost select-none"
                style={{ fontSize: '5.5rem', lineHeight: 1, opacity: 0.08 }}
              >
                {String(s.number).padStart(2, '0')}
              </div>

              {/* Header */}
              <div className="relative z-10 flex items-center justify-between mb-3">
                <div
                  className="px-2 py-1 rounded-md text-[10px]"
                  style={{
                    background: `${s.color}14`,
                    border: `1px solid ${s.color}33`,
                    color: s.color,
                    fontFamily: 'var(--font-mono), monospace',
                    letterSpacing: '0.2em',
                  }}
                >
                  &sect;{s.number}
                </div>
                {s.subsections.some((sub) => sub.isNew) && (
                  <div
                    className="px-2 py-0.5 rounded-md text-[9px]"
                    style={{
                      background: 'rgba(245,158,11,0.12)',
                      border: '1px solid rgba(245,158,11,0.35)',
                      color: '#f59e0b',
                      fontFamily: 'var(--font-mono), monospace',
                      letterSpacing: '0.2em',
                    }}
                  >
                    NEW IN v1.2
                  </div>
                )}
              </div>

              {/* Title */}
              <h2
                className="relative z-10 font-semibold mb-2"
                style={{
                  color: '#e8eaf0',
                  fontSize: '1.05rem',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.25,
                }}
              >
                {s.title}
              </h2>
              <p
                className="relative z-10 text-xs mb-4 leading-relaxed"
                style={{ color: '#8b92a9' }}
              >
                {s.blurb}
              </p>

              {/* Subsections */}
              <ul className="relative z-10 space-y-1.5 flex-1">
                {s.subsections.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-baseline gap-2 text-xs"
                    style={{ color: '#a0a8b8', lineHeight: 1.4 }}
                  >
                    <span
                      className="flex-shrink-0"
                      style={{
                        fontFamily: 'var(--font-mono), monospace',
                        color: sub.isNew ? '#f59e0b' : '#5a6070',
                        fontSize: '10px',
                        minWidth: '24px',
                      }}
                    >
                      {sub.number}
                    </span>
                    <span>
                      {sub.title}
                      {sub.isNew && (
                        <span
                          className="ml-1.5 px-1 py-[1px] rounded text-[8px] align-middle"
                          style={{
                            background: 'rgba(245,158,11,0.12)',
                            border: '1px solid rgba(245,158,11,0.3)',
                            color: '#f59e0b',
                            fontFamily: 'var(--font-mono), monospace',
                            letterSpacing: '0.1em',
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Footer link */}
              <Link
                href={`/paper#${s.id}`}
                className="relative z-10 mt-5 inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
                style={{ color: s.color }}
              >
                Read &sect;{s.number}
                <ArrowRight size={12} />
              </Link>

              {/* Hover ring */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: `inset 0 0 0 1px ${s.color}55, 0 0 28px ${s.color}18`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7 }}
          className="mt-16 text-center"
        >
          <Link
            href="/paper"
            className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
          >
            <BookOpen size={16} />
            Read the Full Whitepaper
            <ArrowRight size={14} />
          </Link>
          <p
            className="mt-4 text-xs"
            style={{
              fontFamily: 'var(--font-mono), monospace',
              color: '#5a6070',
              letterSpacing: '0.2em',
            }}
          >
            v1.2 &middot; OPEN ACCESS &middot; THEORETICAL FRAMEWORK
          </p>
        </motion.div>
      </div>
    </div>
  );
}
