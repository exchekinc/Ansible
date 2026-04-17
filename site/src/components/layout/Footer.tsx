import Link from 'next/link';
import { Zap, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="border-t mt-24"
      style={{ borderColor: 'rgba(0,212,255,0.08)', background: 'rgba(5,7,15,0.8)' }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
                  border: '1px solid rgba(0,212,255,0.3)',
                }}
              >
                <Zap size={14} className="text-[#00d4ff]" />
              </div>
              <span className="font-bold text-base" style={{ color: '#e8eaf0' }}>Ansible</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: '#8b92a9' }}>
              A theoretical framework for superluminal information transfer via orbital quantum entanglement networks.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#00d4ff' }}>
              Research
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/paper', label: 'Whitepaper' },
                { href: '/simulator', label: 'Mars Simulator' },
                { href: '/paper#references', label: 'References' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm transition-colors hover:text-[#00d4ff]"
                    style={{ color: '#8b92a9' }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Authors */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#00d4ff' }}>
              Authors
            </h4>
            <ul className="space-y-2 text-sm" style={{ color: '#8b92a9' }}>
              <li>M.R. Dula</li>
              <li>Claude 3.7 Sonnet</li>
              <li className="flex items-center gap-1.5">
                <a
                  href="mailto:matt@mrdula.co"
                  className="hover:text-[#00d4ff] transition-colors flex items-center gap-1"
                >
                  matt@mrdula.co <ExternalLink size={11} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(0,212,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: '#5a6070' }}>
            Claude assisted discovery · 2025 · Theoretical framework for academic investigation
          </p>
          <p className="text-xs" style={{ color: '#5a6070' }}>
            Not a claim of achievement — an invitation to empirical investigation
          </p>
        </div>
      </div>
    </footer>
  );
}
