import { BookOpen, Users, Calendar, Tag } from 'lucide-react';
import paperData from '@/lib/paperData.json';
import PaperContent from '@/components/paper/PaperContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Whitepaper — Ansible Quantum Communication',
  description: paperData.abstract.slice(0, 160),
};

const { title, subtitle, abstract, sections, references } = paperData as {
  title: string;
  subtitle: string;
  abstract: string;
  sections: Array<{
    id: string;
    number: string;
    title: string;
    content: string;
    subsections?: Array<{ id: string; number: string; title: string; content: string }>;
  }>;
  references: Array<{ number: number; citation: string }>;
};

export default function PaperPage() {
  return (
    <div className="pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex gap-10 relative">
          {/* Sidebar TOC */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div
              className="sticky top-24 glass rounded-2xl p-5"
              style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ color: '#00d4ff' }}
              >
                Contents
              </p>
              <nav className="space-y-0.5">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-baseline gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors hover:text-[#00d4ff] group"
                    style={{ color: '#8b92a9', lineHeight: 1.4 }}
                  >
                    <span
                      className="flex-shrink-0 text-[10px] font-mono"
                      style={{ color: '#5a6070', minWidth: '20px' }}
                    >
                      {s.number}
                    </span>
                    <span className="group-hover:text-[#00d4ff] transition-colors">{s.title}</span>
                  </a>
                ))}
                <a
                  href="#references"
                  className="flex items-baseline gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors hover:text-[#00d4ff]"
                  style={{ color: '#8b92a9', marginTop: '0.5rem' }}
                >
                  <span className="flex-shrink-0 text-[10px] font-mono" style={{ color: '#5a6070', minWidth: '20px' }}>R</span>
                  References
                </a>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <article className="flex-1 min-w-0 max-w-3xl">
            {/* Paper header */}
            <div className="mb-12">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
                style={{
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.2)',
                  color: '#00d4ff',
                  letterSpacing: '0.05em',
                }}
              >
                <BookOpen size={12} />
                THEORETICAL FRAMEWORK · OPEN ACCESS
              </div>

              <h1
                className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
                style={{ color: '#e8eaf0', letterSpacing: '-0.025em' }}
              >
                {title}
              </h1>
              <p
                className="text-lg mb-8"
                style={{ color: '#8b92a9', fontStyle: 'italic' }}
              >
                {subtitle}
              </p>

              {/* Meta */}
              <div className="flex flex-wrap gap-5 mb-8">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
                  <Users size={14} style={{ color: '#00d4ff' }} />
                  <span>M.R. Dula · Claude 3.7 Sonnet</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
                  <Calendar size={14} style={{ color: '#00d4ff' }} />
                  <span>2025</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#8b92a9' }}>
                  <Tag size={14} style={{ color: '#00d4ff' }} />
                  <span>Theoretical Physics · Quantum Information</span>
                </div>
              </div>

              {/* Abstract */}
              <div
                className="rounded-2xl p-6"
                style={{
                  background: 'rgba(0,212,255,0.04)',
                  border: '1px solid rgba(0,212,255,0.12)',
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00d4ff' }}>
                  Abstract
                </p>
                {abstract.split('\n\n').map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0" style={{ color: '#a0a8b8' }}>
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, rgba(0,212,255,0.2), transparent)' }} />
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00d4ff' }} />
              <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, rgba(0,212,255,0.2), transparent)' }} />
            </div>

            {/* Paper body */}
            <PaperContent sections={sections} />

            {/* References */}
            <div id="references" className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(0,212,255,0.1)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: '#e8eaf0' }}>
                References
              </h2>
              <ol className="space-y-3">
                {references.map(({ number, citation }) => (
                  <li key={number} className="flex gap-3 text-sm" style={{ color: '#8b92a9' }}>
                    <span
                      className="flex-shrink-0 font-mono text-xs mt-0.5"
                      style={{ color: '#00d4ff', minWidth: '24px' }}
                    >
                      [{number}]
                    </span>
                    <span className="leading-relaxed">{citation}</span>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
