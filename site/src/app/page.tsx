import Link from 'next/link';
import { ArrowRight, Satellite, Zap, Shield, Globe, BookOpen, FlaskConical } from 'lucide-react';
import OrbitalViz from '@/components/home/OrbitalViz';
import paperData from '@/lib/paperData.json';

const { stats, keyInsights } = paperData as {
  stats: { label: string; value: string; unit: string }[];
  keyInsights: { title: string; description: string }[];
};

const features = [
  {
    icon: Satellite,
    color: '#00d4ff',
    title: 'Orbital Relay Architecture',
    description:
      'Six geostationary satellites maintain entangled photon pairs in the ultra-low decoherence environment of space, 35,786 km above Earth.',
  },
  {
    icon: Zap,
    color: '#7c3aed',
    title: 'Modified Non-Local Hamiltonian',
    description:
      'A novel quantum interaction term couples spatially separated entangled subsystems, enabling controlled correlational information flow.',
  },
  {
    icon: Shield,
    color: '#10b981',
    title: 'Surface Code Error Correction',
    description:
      'Distance-7 surface codes combined with Reed-Solomon classical FEC achieve 99.95% reliability despite the harsh space radiation environment.',
  },
  {
    icon: Globe,
    color: '#f59e0b',
    title: 'Two-Tier Causality Model',
    description:
      'Energetic information remains light-speed bound while correlational information propagates via non-local quantum channels — resolving the causality paradox.',
  },
];

const highlightStats = stats.slice(0, 4);

export default function Home() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden grid-bg">
        {/* Orbital visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[500px] h-[500px] max-w-full max-h-full opacity-70">
            <OrbitalViz />
          </div>
        </div>

        {/* Radial gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,7,15,0) 0%, rgba(5,7,15,0.6) 60%, rgba(5,7,15,0.95) 100%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 pt-20">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: 'rgba(0,212,255,0.08)',
              border: '1px solid rgba(0,212,255,0.2)',
              color: '#00d4ff',
              letterSpacing: '0.06em',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse-slow"
              style={{ background: '#00d4ff' }}
            />
            THEORETICAL FRAMEWORK · OPEN ACCESS
          </div>

          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
            style={{ color: '#e8eaf0', letterSpacing: '-0.03em' }}
          >
            <span className="shimmer-text">Ansible</span>
            <br />
            <span style={{ fontSize: '0.65em', fontWeight: 500, color: '#8b92a9' }}>
              Quantum Entanglement Communication
            </span>
          </h1>

          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: '#8b92a9' }}
          >
            A theoretical framework for superluminal information transfer via orbital quantum
            entanglement relay networks — from Earth to Mars in{' '}
            <span style={{ color: '#00d4ff' }}>milliseconds, not minutes</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/paper"
              className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            >
              <BookOpen size={16} />
              Read the Whitepaper
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/simulator"
              className="btn-secondary flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold"
            >
              <FlaskConical size={16} />
              Try the Simulator
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 animate-pulse-slow" style={{ background: 'linear-gradient(to bottom, rgba(0,212,255,0.5), transparent)' }} />
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-16 border-y"
        style={{ borderColor: 'rgba(0,212,255,0.07)', background: 'rgba(13,17,23,0.5)' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {highlightStats.map(({ label, value, unit }) => (
              <div key={label} className="text-center">
                <div
                  className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ color: '#00d4ff', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}
                >
                  {value}
                  <span className="text-lg ml-1" style={{ color: '#7c3aed' }}>
                    {unit.length < 3 ? unit : ''}
                  </span>
                </div>
                <div className="text-xs" style={{ color: '#8b92a9' }}>
                  {label}
                </div>
                {unit.length >= 3 && (
                  <div className="text-xs mt-0.5" style={{ color: '#5a6070' }}>
                    {unit}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Abstract */}
      <section className="py-24 max-w-4xl mx-auto px-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.3))' }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#00d4ff' }}>
            Abstract
          </span>
          <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, rgba(0,212,255,0.3))' }} />
        </div>
        <blockquote
          className="text-lg md:text-xl leading-relaxed text-center"
          style={{ color: '#a0a8b8', fontStyle: 'italic' }}
        >
          {paperData.abstract.split('\n\n')[0]}
        </blockquote>
      </section>

      {/* Features */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#e8eaf0', letterSpacing: '-0.02em' }}>
            Core Architecture
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8b92a9' }}>
            Four pillars of the Ansible theoretical framework, from quantum physics to orbital engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map(({ icon: Icon, color, title, description }) => (
            <div
              key={title}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ cursor: 'default' }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `${color}15`,
                    border: `1px solid ${color}30`,
                  }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: '#e8eaf0' }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8b92a9' }}>
                    {description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Insights */}
      <section
        className="py-24 border-y"
        style={{ borderColor: 'rgba(0,212,255,0.07)', background: 'rgba(13,17,23,0.4)' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: '#e8eaf0', letterSpacing: '-0.02em' }}>
              Key Theoretical Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {keyInsights.map(({ title, description }, i) => (
              <div
                key={title}
                className="glass rounded-2xl p-7"
              >
                <div
                  className="text-xs font-semibold mb-3 uppercase tracking-widest"
                  style={{ color: i % 2 === 0 ? '#00d4ff' : '#7c3aed' }}
                >
                  Insight {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-bold mb-3" style={{ color: '#e8eaf0' }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: '#8b92a9' }}>
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mars CTA */}
      <section className="py-32 max-w-4xl mx-auto px-6 text-center">
        <div
          className="glass rounded-3xl p-12 relative overflow-hidden"
          style={{ border: '1px solid rgba(0,212,255,0.15)' }}
        >
          {/* Glow blob */}
          <div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)' }}
          />

          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.25)',
                color: '#a78bfa',
              }}
            >
              <FlaskConical size={12} />
              INTERACTIVE SIMULATION
            </div>

            <h2
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ color: '#e8eaf0', letterSpacing: '-0.02em' }}
            >
              Simulate Earth–Mars Communication
            </h2>
            <p className="text-base mb-8 max-w-xl mx-auto" style={{ color: '#8b92a9' }}>
              Transmit a message to Mars using our quantum simulator. Compare Ansible latency
              to classical radio — up to 22 minutes versus milliseconds.
            </p>

            <Link
              href="/simulator"
              className="btn-secondary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-semibold"
            >
              Launch Simulator
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
