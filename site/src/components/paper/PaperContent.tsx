'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

interface Section {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections?: {
    id: string;
    number: string;
    title: string;
    content: string;
  }[];
}

interface PaperContentProps {
  sections: Section[];
}

const mdComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#00d4ff', marginTop: '2.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,212,255,0.12)' }}>
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#a5b4fc', marginTop: '1.75rem', marginBottom: '0.6rem' }}>
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ lineHeight: '1.9', color: '#c8ccd8', marginBottom: '1rem' }}>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ paddingLeft: '1.5rem', color: '#c8ccd8', marginBottom: '1rem' }}>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol style={{ paddingLeft: '1.5rem', color: '#c8ccd8', marginBottom: '1rem' }}>{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ marginBottom: '0.35rem', lineHeight: '1.75' }}>{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ color: '#e8eaf0', fontWeight: 600 }}>{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em style={{ color: '#94a3b8' }}>{children}</em>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code style={{
      fontFamily: 'var(--font-geist-mono), monospace',
      fontSize: '0.87em',
      background: 'rgba(0,212,255,0.07)',
      padding: '0.1em 0.4em',
      borderRadius: '3px',
      color: '#67e8f9',
    }}>{children}</code>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote style={{
      borderLeft: '3px solid rgba(0,212,255,0.4)',
      paddingLeft: '1rem',
      marginLeft: 0,
      marginBottom: '1rem',
      color: '#94a3b8',
      fontStyle: 'italic',
    }}>{children}</blockquote>
  ),
};

export default function PaperContent({ sections }: PaperContentProps) {
  return (
    <div>
      {sections.map((section) => (
        <div key={section.id} id={section.id} className="mb-2">
          {/* Section header */}
          <div className="flex items-baseline gap-3 mb-3" style={{ marginTop: '3.5rem' }}>
            <span
              className="text-xs font-bold"
              style={{ color: '#00d4ff', opacity: 0.6, minWidth: '24px', letterSpacing: '0.04em' }}
            >
              {section.number}
            </span>
            <h2
              className="text-xl font-bold"
              style={{ color: '#e8eaf0', letterSpacing: '-0.02em' }}
            >
              {section.title}
            </h2>
          </div>
          <div
            className="ml-0 pl-0 border-l-0"
            style={{ paddingLeft: 0 }}
          >
            {/* Section content */}
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={mdComponents as Record<string, React.ComponentType<Record<string, unknown>>>}
            >
              {section.content}
            </ReactMarkdown>

            {/* Subsections */}
            {section.subsections?.map((sub) => (
              <div key={sub.id} id={sub.id} className="mt-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span
                    className="text-xs font-semibold"
                    style={{ color: '#7c3aed', opacity: 0.7, minWidth: '28px' }}
                  >
                    {sub.number}
                  </span>
                  <h3
                    className="text-base font-semibold"
                    style={{ color: '#a5b4fc' }}
                  >
                    {sub.title}
                  </h3>
                </div>
                <ReactMarkdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                  components={mdComponents as Record<string, React.ComponentType<Record<string, unknown>>>}
                >
                  {sub.content}
                </ReactMarkdown>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
