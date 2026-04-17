'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, GitCommit, BookOpen, ArrowRight } from 'lucide-react';

const CURRENT_VERSION = '1.1';
const CURRENT_YEAR = '2026';
const PAPER_URL = 'https://ansible-quantum.vercel.app/paper';
const REPO_URL = 'https://github.com/exchekinc/Ansible';

const bibtex = `@misc{ansible2026,
  title        = {Project Ansible: A Theoretical Framework for
                  Faster-Than-Light Communication via Orbital
                  Quantum Entanglement Relay Networks},
  author       = {{Project Ansible Collaboration}},
  year         = {${CURRENT_YEAR}},
  version      = {${CURRENT_VERSION}},
  howpublished = {\\url{${PAPER_URL}}},
  note         = {Open-access whitepaper and interactive simulator},
}`;

const apa = `Project Ansible Collaboration. (${CURRENT_YEAR}). Project Ansible: A theoretical framework for faster-than-light communication via orbital quantum entanglement relay networks (Version ${CURRENT_VERSION}) [Whitepaper]. Retrieved from ${PAPER_URL}`;

const mla = `Project Ansible Collaboration. "Project Ansible: A Theoretical Framework for Faster-Than-Light Communication via Orbital Quantum Entanglement Relay Networks." Version ${CURRENT_VERSION}, ${CURRENT_YEAR}, ${PAPER_URL}.`;

const chicago = `Project Ansible Collaboration. ${CURRENT_YEAR}. "Project Ansible: A Theoretical Framework for Faster-Than-Light Communication via Orbital Quantum Entanglement Relay Networks." Version ${CURRENT_VERSION}. ${PAPER_URL}.`;

type Version = {
  tag: string;
  date: string;
  title: string;
  description: string;
  highlights: string[];
  accent: string;
};

const versions: Version[] = [
  {
    tag: 'v1.1',
    date: '2026-04-17',
    title: 'Peer-Review Hardening',
    description:
      'Addressed external review with three substantive theoretical additions, strengthening the framework against Lorentz, precision, and roadmap critiques.',
    highlights: [
      '§2.5 — Lorentz-covariant formulation of H_NL via bi-local currents',
      '§11.4 — Quantitative bounds on λ_NL from atomic clocks, neutrinos, LHC',
      '§6.4 — Mission-alignment roadmap (Micius, Eagle-1, DSOC, Starlink)',
    ],
    accent: '#00d4ff',
  },
  {
    tag: 'v1.0',
    date: '2026-04-17',
    title: 'Initial Public Release',
    description:
      'First complete Ansible framework published as an open-access whitepaper with interactive Mars communication simulator.',
    highlights: [
      '12 sections across quantum mechanics, holography, and orbital engineering',
      'Interactive Earth–Mars simulator with fidelity-threshold demonstration',
      'Repository, licensing, and contribution guidelines established',
    ],
    accent: '#7c3aed',
  },
  {
    tag: 'v0.1',
    date: '2026-03-20',
    title: 'Draft Whitepaper',
    description:
      'Internal draft exploring the non-local Hamiltonian hypothesis and preliminary orbital relay constraints. Preserved as historical reference.',
    highlights: [
      'First formulation of fidelity-threshold activation',
      'Initial derivation of non-local coupling mechanism',
      'Preliminary orbital architecture sketches',
    ],
    accent: '#8b92a9',
  },
];

function CitationBlock({
  label,
  text,
  monospace = false,
}: {
  label: string;
  text: string;
  monospace?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass rounded-2xl p-6 relative group"
    >
      <div className="flex items-center justify-between mb-4">
        <span
          className="text-xs font-semibold uppercase tracking-widest"
          style={{ color: '#00d4ff' }}
        >
          {label}
        </span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all"
          style={{
            background: copied ? 'rgba(16,185,129,0.1)' : 'rgba(0,212,255,0.06)',
            border: `1px solid ${copied ? 'rgba(16,185,129,0.3)' : 'rgba(0,212,255,0.2)'}`,
            color: copied ? '#10b981' : '#8b92a9',
          }}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre
        style={{
          fontFamily: monospace ? 'var(--font-geist-mono), monospace' : 'inherit',
          fontSize: monospace ? '0.82rem' : '0.92rem',
          lineHeight: 1.7,
          color: '#c8ccd8',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          margin: 0,
        }}
      >
        {text}
      </pre>
    </motion.div>
  );
}

export default function CitePage() {
  return (
    <div className="relative pt-32 pb-32">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 70%)',
          zIndex: -1,
        }}
      />

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
              letterSpacing: '0.06em',
            }}
          >
            <BookOpen size={11} />
            CITATION · VERSION HISTORY
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            style={{ color: '#e8eaf0', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            How to cite <span className="gradient-text">Ansible</span>
          </h1>

          <p className="text-base md:text-lg max-w-2xl" style={{ color: '#8b92a9', lineHeight: 1.7 }}>
            The Ansible whitepaper and accompanying software are released under open-access
            terms (MIT for code, CC BY 4.0 for text and figures). If you reference this work
            in a publication, talk, or thesis, the citations below are current.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-8 text-xs" style={{ color: '#8b92a9' }}>
            <span
              className="px-2.5 py-1 rounded-md font-mono"
              style={{
                background: 'rgba(0,212,255,0.06)',
                border: '1px solid rgba(0,212,255,0.2)',
                color: '#00d4ff',
              }}
            >
              Current version: v{CURRENT_VERSION}
            </span>
            <span>·</span>
            <span>Last updated 17 April 2026</span>
            <span>·</span>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-[#00d4ff] transition-colors"
              style={{ color: '#8b92a9' }}
            >
              View repository <ExternalLink size={11} />
            </a>
          </div>
        </motion.div>

        {/* Citation blocks */}
        <section className="mb-24">
          <div className="flex items-center gap-3 mb-6">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#8b92a9' }}
            >
              Citation formats
            </span>
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(to right, rgba(0,212,255,0.2), transparent)' }}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <CitationBlock label="BibTeX" text={bibtex} monospace />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CitationBlock label="APA" text={apa} />
              <CitationBlock label="MLA" text={mla} />
              <CitationBlock label="Chicago" text={chicago} />
            </div>
          </div>
        </section>

        {/* Version history */}
        <section>
          <div className="flex items-center gap-3 mb-10">
            <span
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: '#8b92a9' }}
            >
              Version history
            </span>
            <div
              className="h-px flex-1"
              style={{ background: 'linear-gradient(to right, rgba(124,58,237,0.2), transparent)' }}
            />
          </div>

          <div className="relative">
            {/* Timeline vertical line */}
            <div
              className="absolute left-[11px] top-2 bottom-2 w-px"
              style={{
                background:
                  'linear-gradient(to bottom, rgba(0,212,255,0.6), rgba(124,58,237,0.4), rgba(139,146,169,0.2))',
              }}
            />

            <div className="space-y-10">
              {versions.map((v, i) => (
                <motion.div
                  key={v.tag}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="relative pl-12"
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: 'rgba(5,7,15,0.95)',
                      border: `1px solid ${v.accent}`,
                      boxShadow: `0 0 14px ${v.accent}55`,
                    }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: v.accent }}
                    />
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span
                        className="font-mono text-sm font-semibold px-2.5 py-1 rounded-md"
                        style={{
                          background: `${v.accent}15`,
                          border: `1px solid ${v.accent}40`,
                          color: v.accent,
                        }}
                      >
                        {v.tag}
                      </span>
                      <span className="text-xs" style={{ color: '#5a6070', fontFamily: 'var(--font-geist-mono), monospace' }}>
                        {v.date}
                      </span>
                      <GitCommit size={12} style={{ color: '#5a6070' }} />
                    </div>

                    <h3
                      className="text-lg md:text-xl font-semibold mb-3"
                      style={{ color: '#e8eaf0', letterSpacing: '-0.01em' }}
                    >
                      {v.title}
                    </h3>

                    <p className="text-sm mb-4 leading-relaxed" style={{ color: '#a0a8b8' }}>
                      {v.description}
                    </p>

                    <ul className="space-y-1.5">
                      {v.highlights.map((h) => (
                        <li
                          key={h}
                          className="text-xs flex items-start gap-2 leading-relaxed"
                          style={{ color: '#8b92a9' }}
                        >
                          <span
                            className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                            style={{ background: v.accent, opacity: 0.6 }}
                          />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 text-center"
        >
          <p className="text-sm mb-6" style={{ color: '#8b92a9' }}>
            Questions about citation or prior versions? Open an issue on the repository or
            contact the maintainers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/paper"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              <BookOpen size={14} />
              Read the whitepaper
              <ArrowRight size={13} />
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
            >
              Repository
              <ExternalLink size={13} />
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
