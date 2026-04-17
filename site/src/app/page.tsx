'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion';
import {
  ArrowRight,
  Satellite,
  Zap,
  Shield,
  Globe,
  BookOpen,
  FlaskConical,
  Radio,
} from 'lucide-react';
import CinematicHero from '@/components/home/CinematicHero';
import FilmGrain from '@/components/home/FilmGrain';
import paperData from '@/lib/paperData.json';

const typedPaper = paperData as unknown as {
  stats: { label: string; value: string; unit: string }[];
  keyInsights: { title: string; description: string }[];
  abstract: string;
};

const { stats, keyInsights, abstract } = typedPaper;

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

const heroCallouts = [
  { num: '01', label: 'ENTANGLEMENT RELAY' },
  { num: '02', label: 'ORBITAL CONSTELLATION' },
  { num: '03', label: 'NON-LOCAL HAMILTONIAN' },
  { num: '04', label: 'MARS LINK · 22 min → 0ms' },
];

const highlightStats = stats.slice(0, 4);

// -----------------------------
// CountUp component (framer-motion)
// -----------------------------
function CountUp({ value, duration = 1.6 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const numericMatch = value.match(/([<>]?)(\d+\.?\d*)/);
  const hasNumeric = !!numericMatch;
  const [display, setDisplay] = useState(() =>
    hasNumeric ? value.replace(/[0-9]/g, '0') : value,
  );

  useEffect(() => {
    if (!inView || !hasNumeric || !numericMatch) return;
    const prefix = numericMatch[1] || '';
    const numStr = numericMatch[2];
    const target = parseFloat(numStr);
    const decimals = (numStr.split('.')[1] || '').length;
    const startTs = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - startTs) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = target * eased;
      setDisplay(prefix + cur.toFixed(decimals));
      if (t < 1) raf = requestAnimationFrame(step);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, hasNumeric, numericMatch]);

  return <span ref={ref}>{display}</span>;
}

// -----------------------------
// Small Mars-link side scene (split CTA)
// -----------------------------
function MiniLinkScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let W = 0, H = 0, dpr = 1;
    const resize = () => {
      const rect = c.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(W * dpr); c.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    let raf = 0;
    const start = performance.now();
    const pulses: number[] = [];
    let lastPulse = 0;
    const stars = Array.from({ length: 40 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 400,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.5 + 0.2,
      t: Math.random() * Math.PI * 2,
    }));
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, W, H);
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
      bg.addColorStop(0, 'rgba(10,30,60,0.3)');
      bg.addColorStop(1, 'rgba(5,7,15,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        const tw = (Math.sin(t * 1.5 + s.t) * 0.5 + 0.5) * 0.5 + 0.5;
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        const x = (s.x + t * 6) % W;
        ctx.arc(x, s.y % H, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Earth on left
      const ex = W * 0.18, ey = H * 0.62, er = Math.min(W, H) * 0.14;
      const eh = ctx.createRadialGradient(ex, ey, er * 0.9, ex, ey, er * 2);
      eh.addColorStop(0, 'rgba(0,212,255,0.2)');
      eh.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.fillStyle = eh;
      ctx.beginPath(); ctx.arc(ex, ey, er * 2, 0, Math.PI * 2); ctx.fill();
      const eb = ctx.createRadialGradient(ex - er * 0.3, ey - er * 0.3, 0, ex, ey, er);
      eb.addColorStop(0, '#2a8dbf'); eb.addColorStop(0.6, '#0e4c7a'); eb.addColorStop(1, '#061a2e');
      ctx.fillStyle = eb;
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();

      // Mars on right
      const mx = W * 0.86, my = H * 0.38, mr = Math.min(W, H) * 0.08;
      const mh = ctx.createRadialGradient(mx, my, mr * 0.9, mx, my, mr * 2.5);
      mh.addColorStop(0, 'rgba(245,158,11,0.22)');
      mh.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = mh;
      ctx.beginPath(); ctx.arc(mx, my, mr * 2.5, 0, Math.PI * 2); ctx.fill();
      const mb = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, 0, mx, my, mr);
      mb.addColorStop(0, '#d97757'); mb.addColorStop(1, '#2a0e08');
      ctx.fillStyle = mb;
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();

      // beam
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const bg2 = ctx.createLinearGradient(ex, ey, mx, my);
      bg2.addColorStop(0, 'rgba(0,212,255,0.6)');
      bg2.addColorStop(0.5, 'rgba(124,58,237,0.4)');
      bg2.addColorStop(1, 'rgba(245,158,11,0.55)');
      ctx.strokeStyle = bg2; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(mx, my); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,212,255,0.12)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(mx, my); ctx.stroke();
      ctx.restore();

      if (now - lastPulse > 1400) { pulses.push(now); lastPulse = now; }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const prog = (now - p) / 1800;
        if (prog > 1) { pulses.splice(i, 1); continue; }
        const px = ex + (mx - ex) * prog, py = ey + (my - ey) * prog;
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 8);
        pg.addColorStop(0, 'rgba(180,240,255,0.9)');
        pg.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// -----------------------------
// Page
// -----------------------------
export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Track cursor position for subtle parallax on title
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 12;
      const ny = (e.clientY / window.innerHeight - 0.5) * 8;
      mx.set(nx); my.set(ny);
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [mx, my]);

  return (
    <div className="relative">
      {/* ======================== HERO ======================== */}
      <section
        ref={heroRef}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Canvas */}
        <motion.div
          className="absolute inset-0"
          style={{ opacity: heroOpacity, y: heroY }}
        >
          <CinematicHero />
        </motion.div>

        {/* Film grain */}
        <FilmGrain opacity={0.035} zIndex={5} blendMode="overlay" />

        {/* Corner ticks */}
        <div className="corner-tick-tl" />
        <div className="corner-tick-tr" />
        <div className="corner-tick-bl" />
        <div className="corner-tick-br" />

        {/* Side chrome */}
        <div
          className="absolute top-6 right-24 z-10 hidden md:block"
          style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.25em', color: '#5a6070' }}
        >
          v1.1 · PAGE 01
        </div>
        <div
          className="absolute bottom-6 left-24 z-10 hidden md:block"
          style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.25em', color: '#5a6070' }}
        >
          34°N · ORBITAL FRAME
        </div>

        {/* Status chip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute top-24 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:top-28 md:right-10 z-10 flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: 'rgba(5,7,15,0.6)',
            border: '1px solid rgba(0,212,255,0.2)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '10px',
            letterSpacing: '0.22em',
            color: '#00d4ff',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#00d4ff' }} />
          THEORETICAL FRAMEWORK · OPEN ACCESS · v1.0
        </motion.div>

        {/* Hero content (title block) */}
        <div className="relative z-10 h-screen flex items-center">
          <motion.div
            className="w-full max-w-7xl mx-auto px-6 md:px-12"
            style={{ x: sx, y: sy }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-3xl"
            >
              <h1
                className="cinematic-title text-white"
                style={{
                  fontSize: 'clamp(4rem, 11vw, 10rem)',
                  marginBottom: '1.5rem',
                }}
              >
                ANSIBLE
              </h1>
              <div
                className="h-px mb-6"
                style={{
                  background: 'linear-gradient(to right, rgba(0,212,255,0.8), rgba(0,212,255,0) 80%)',
                  width: 'min(240px, 55%)',
                }}
              />
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.7 }}
                className="text-white/80"
                style={{
                  fontWeight: 200,
                  fontSize: 'clamp(1.25rem, 2.6vw, 2rem)',
                  lineHeight: 1.2,
                  letterSpacing: '-0.015em',
                  maxWidth: '42ch',
                }}
              >
                Quantum entanglement
                <br />
                across interplanetary
                <br />
                distances.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.1 }}
                className="mt-10 flex flex-wrap items-center gap-4"
              >
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
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Radiating callouts (right side) */}
        <div className="pointer-events-none absolute inset-0 z-10 hidden lg:block">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-6 pr-8">
            {heroCallouts.map((c, i) => (
              <motion.div
                key={c.num}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 1.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3"
              >
                <div
                  style={{
                    width: 'clamp(120px, 18vw, 220px)',
                    height: 1,
                    background: 'linear-gradient(to right, rgba(0,212,255,0), rgba(0,212,255,0.55))',
                  }}
                />
                <div className="flex items-baseline gap-2">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '10px',
                      color: '#00d4ff',
                      letterSpacing: '0.2em',
                    }}
                  >
                    {c.num}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '11px',
                      color: '#c8ccd8',
                      letterSpacing: '0.22em',
                    }}
                  >
                    {c.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        >
          <div
            className="scroll-pulse"
            style={{ width: 1, height: 48, background: 'linear-gradient(to bottom, rgba(0,212,255,0.8), rgba(0,212,255,0))' }}
          />
          <span
            style={{
              fontFamily: 'var(--font-mono), monospace',
              fontSize: '9px',
              letterSpacing: '0.35em',
              color: '#8b92a9',
            }}
          >
            SCROLL
          </span>
        </motion.div>
      </section>

      {/* ======================== STATS BAND ======================== */}
      <section
        className="relative py-24 border-y overflow-hidden"
        style={{ borderColor: 'rgba(0,212,255,0.08)', background: 'linear-gradient(180deg, rgba(5,7,15,1), rgba(8,12,22,1))' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6 }}
            className="caption mb-10"
          >
            THE NUMBERS · I/IV
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {highlightStats.map(({ label, value, unit }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15%' }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div
                  className="text-xs mb-3"
                  style={{ fontFamily: 'var(--font-mono), monospace', color: '#5a6070', letterSpacing: '0.2em' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div
                  className="font-bold mb-2"
                  style={{
                    color: '#00d4ff',
                    fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <CountUp value={value} />
                  <span style={{ color: '#7c3aed', fontSize: '0.5em', marginLeft: '0.35em' }}>
                    {unit.length < 4 ? unit : ''}
                  </span>
                </div>
                <div
                  className="text-xs"
                  style={{ color: '#8b92a9', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 500 }}
                >
                  {label}
                </div>
                {unit.length >= 4 && (
                  <div
                    className="text-[10px] mt-1"
                    style={{ color: '#5a6070', fontFamily: 'var(--font-mono), monospace' }}
                  >
                    {unit}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== ABSTRACT / CHAPTER I ======================== */}
      <section className="relative py-40 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 0.7 }}
            className="caption mb-8"
          >
            CHAPTER I · THE PROPOSITION
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true, margin: '-20%' }}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{
              height: 1,
              width: 80,
              margin: '0 auto 3rem',
              background: 'linear-gradient(to right, transparent, rgba(0,212,255,0.6), transparent)',
            }}
          />
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 1.0, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(1.25rem, 2vw, 1.65rem)',
              lineHeight: 1.55,
              color: '#c8ccd8',
              fontWeight: 300,
              letterSpacing: '-0.01em',
            }}
          >
            {abstract.split('\n\n')[0]}
          </motion.blockquote>
        </div>
      </section>

      {/* ======================== CORE ARCHITECTURE ======================== */}
      <section className="relative py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.6 }}
            className="mb-14"
          >
            <div className="caption mb-4">CHAPTER II · CORE ARCHITECTURE</div>
            <h2
              className="cinematic-title"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4rem)', color: '#e8eaf0' }}
            >
              Four pillars,
              <br />
              <span style={{ color: '#8b92a9', fontWeight: 200 }}>one theoretical frame.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, color, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10%' }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="glass rounded-2xl p-8 relative overflow-hidden group transition-colors"
                style={{ cursor: 'default' }}
              >
                {/* Giant faded numeric */}
                <div
                  className="absolute -right-4 -top-6 pointer-events-none numeric-ghost select-none"
                  style={{ fontSize: '8rem', lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                {/* Icon corner */}
                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3"
                    style={{ background: `${color}18`, border: `1px solid ${color}40` }}
                  >
                    <Icon size={20} style={{ color }} />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '10px',
                      color: '#5a6070',
                      letterSpacing: '0.25em',
                    }}
                  >
                    {String(i + 1).padStart(2, '0')} / 04
                  </div>
                </div>

                <div className="relative z-10">
                  <h3
                    className="font-semibold mb-3"
                    style={{ color: '#e8eaf0', fontSize: '1.15rem', letterSpacing: '-0.015em' }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8b92a9' }}>
                    {description}
                  </p>
                </div>

                {/* Hover glow border */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    boxShadow: `inset 0 0 0 1px ${color}55, 0 0 30px ${color}20`,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== KEY INSIGHTS — TIMELINE ======================== */}
      <section
        className="relative py-32 border-y"
        style={{ borderColor: 'rgba(0,212,255,0.08)', background: 'rgba(8,12,22,0.6)' }}
      >
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="caption mb-4">CHAPTER III · INSIGHTS</div>
            <h2
              className="cinematic-title"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: '#e8eaf0' }}
            >
              Key theoretical insights
            </h2>
          </motion.div>

          <div className="relative pl-10">
            {/* Vertical line */}
            <div
              className="absolute left-3 top-0 bottom-0 w-px"
              style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.4) 10%, rgba(0,212,255,0.4) 90%, transparent)' }}
            />

            <div className="space-y-10">
              {keyInsights.map(({ title, description }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.7, delay: i * 0.08 }}
                  className="relative"
                >
                  {/* Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.5, delay: i * 0.08 + 0.2, type: 'spring' }}
                    className="absolute -left-[30px] top-1 w-3 h-3 rounded-full"
                    style={{
                      background: '#00d4ff',
                      boxShadow: '0 0 12px rgba(0,212,255,0.7), 0 0 0 4px rgba(0,212,255,0.1)',
                    }}
                  />

                  <div
                    className="mb-2 text-xs"
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      color: i % 2 === 0 ? '#00d4ff' : '#a78bfa',
                      letterSpacing: '0.2em',
                    }}
                  >
                    INSIGHT · {String(i + 1).padStart(2, '0')}
                  </div>
                  <h3
                    className="font-semibold mb-2"
                    style={{ color: '#e8eaf0', fontSize: '1.15rem', letterSpacing: '-0.015em' }}
                  >
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8b92a9', maxWidth: '60ch' }}>
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================== MARS CTA ======================== */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-0 glass rounded-3xl overflow-hidden"
            style={{ border: '1px solid rgba(0,212,255,0.15)' }}
          >
            {/* Left: mini link scene */}
            <div className="relative aspect-[5/4] lg:aspect-auto lg:min-h-[420px] overflow-hidden" style={{ background: '#05070f' }}>
              <MiniLinkScene />
              <FilmGrain opacity={0.03} zIndex={2} />
              <div className="corner-tick-tl" />
              <div className="corner-tick-br" />
              {/* Distance readout */}
              <div
                className="absolute bottom-4 left-4 z-10"
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontSize: '10px',
                  letterSpacing: '0.18em',
                  color: '#8b92a9',
                }}
              >
                <div style={{ color: '#00d4ff' }}>54.6M KM · 3.03 LIGHT-MIN</div>
                <div>EARTH → MARS LINK</div>
              </div>
            </div>

            {/* Right: copy */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <div className="caption mb-6" style={{ color: '#a78bfa' }}>
                CHAPTER IV · INTERACTIVE
              </div>
              <h2
                className="cinematic-title mb-5"
                style={{ fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', color: '#e8eaf0' }}
              >
                Simulate Earth
                <br />
                to Mars.
              </h2>
              <p className="text-base mb-10" style={{ color: '#8b92a9', maxWidth: '38ch', lineHeight: 1.7 }}>
                Transmit a message via the Ansible quantum channel. Compare entangled latency to
                classical radio — <span style={{ color: '#00d4ff' }}>22 minutes</span> versus{' '}
                <span style={{ color: '#00d4ff' }}>milliseconds</span>.
              </p>
              <div className="flex items-center gap-6 mb-8">
                <div>
                  <div
                    style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', color: '#5a6070', letterSpacing: '0.25em' }}
                  >
                    RADIO
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#ef4444', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    3:02
                  </div>
                </div>
                <Radio size={14} style={{ color: '#5a6070' }} />
                <div>
                  <div
                    style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', color: '#5a6070', letterSpacing: '0.25em' }}
                  >
                    ANSIBLE
                  </div>
                  <div style={{ fontSize: '1.5rem', color: '#00d4ff', fontWeight: 700, letterSpacing: '-0.02em' }}>
                    12ms
                  </div>
                </div>
              </div>
              <Link
                href="/simulator"
                className="btn-secondary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold self-start"
              >
                <FlaskConical size={15} />
                Launch Simulator
                <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================== SIGN-OFF ======================== */}
      <section className="relative py-28 px-6 text-center">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0 }}
            className="max-w-3xl mx-auto"
          >
            <div className="caption mb-6" style={{ color: '#5a6070' }}>
              CLOSING
            </div>
            <p
              style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.25rem)',
                color: '#8b92a9',
                lineHeight: 1.6,
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              &ldquo;The non-locality is real, but it is, in the standard framework,
              informationally sterile. The question we pose is whether that sterility is
              fundamental — or contingent.&rdquo;
            </p>
            <div
              className="mt-8 text-xs"
              style={{ fontFamily: 'var(--font-mono), monospace', color: '#5a6070', letterSpacing: '0.25em' }}
            >
              — PROJECT ANSIBLE · 2026
            </div>
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  );
}
