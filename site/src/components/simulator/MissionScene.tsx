'use client';

import { useEffect, useRef } from 'react';

/**
 * MissionScene — the wide mission-control viewport.
 *
 * Renders Earth (left), Mars (right), an entanglement beam between them,
 * ambient starfield, and live packet dots when transmitting. Displays an
 * error-pulse shock when errorFlash is set, which decays over ~600ms.
 *
 * Drives from props:
 *   transmitting — whether the link is active (slows/speeds pulse rate)
 *   progress     — 0..1 transmission progress (fills link with spacing marks)
 *   errorFlash   — incremented counter that triggers a red shock ripple
 *   distanceLabel — text shown floating above the beam
 */
interface Props {
  transmitting: boolean;
  progress: number;
  errorFlash: number;
  distanceLabel: string;
  fidelity: number;
  pairRate: number;
  bitsSent: number;
}

export default function MissionScene({
  transmitting,
  progress,
  errorFlash,
  distanceLabel,
  fidelity,
  pairRate,
  bitsSent,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef<Props>({ transmitting, progress, errorFlash, distanceLabel, fidelity, pairRate, bitsSent });
  const lastFlashRef = useRef(0);
  const flashAtRef = useRef(0);

  // Keep latest props readable from the RAF loop without re-running the effect.
  useEffect(() => {
    propsRef.current = { transmitting, progress, errorFlash, distanceLabel, fidelity, pairRate, bitsSent };
  }, [transmitting, progress, errorFlash, distanceLabel, fidelity, pairRate, bitsSent]);

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
      c.width = Math.floor(W * dpr);
      c.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const stars = Array.from({ length: 110 }, () => ({
      x: Math.random() * 2000,
      y: Math.random() * 1000,
      r: Math.random() * 1.2 + 0.2,
      a: Math.random() * 0.5 + 0.2,
      t: Math.random() * Math.PI * 2,
    }));

    let raf = 0;
    let paused = false;
    const onVis = () => { paused = document.visibilityState === 'hidden'; };
    document.addEventListener('visibilitychange', onVis);

    const pulses: { t: number }[] = [];
    let lastPulse = 0;

    const start = performance.now();

    const loop = (now: number) => {
      if (paused) { raf = requestAnimationFrame(loop); return; }
      const t = (now - start) / 1000;
      const p = propsRef.current;

      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, W, H);

      // bg gradient
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, Math.max(W, H) * 0.7);
      bg.addColorStop(0, 'rgba(10,20,45,0.35)');
      bg.addColorStop(1, 'rgba(5,7,15,0)');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

      // stars
      for (const s of stars) {
        const tw = (Math.sin(t * 1.5 + s.t) * 0.5 + 0.5) * 0.5 + 0.5;
        ctx.globalAlpha = s.a * tw;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        const x = (s.x + t * 4) % W;
        const y = s.y % H;
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Earth (left)
      const ex = W * 0.16, ey = H * 0.55;
      const er = Math.min(W * 0.09, H * 0.28);
      const eh = ctx.createRadialGradient(ex, ey, er * 0.9, ex, ey, er * 2.2);
      eh.addColorStop(0, 'rgba(0,212,255,0.22)');
      eh.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.fillStyle = eh;
      ctx.beginPath(); ctx.arc(ex, ey, er * 2.2, 0, Math.PI * 2); ctx.fill();
      const eb = ctx.createRadialGradient(ex - er * 0.35, ey - er * 0.35, er * 0.1, ex, ey, er);
      eb.addColorStop(0, '#2a8dbf'); eb.addColorStop(0.5, '#0e4c7a'); eb.addColorStop(1, '#061a2e');
      ctx.fillStyle = eb;
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(0,212,255,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(ex, ey, er, 0, Math.PI * 2); ctx.stroke();

      // Mars (right)
      const mx = W * 0.84, my = H * 0.55;
      const mr = Math.min(W * 0.065, H * 0.2);
      const mh = ctx.createRadialGradient(mx, my, mr * 0.9, mx, my, mr * 2.5);
      mh.addColorStop(0, 'rgba(245,158,11,0.22)');
      mh.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = mh;
      ctx.beginPath(); ctx.arc(mx, my, mr * 2.5, 0, Math.PI * 2); ctx.fill();
      const mb = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.1, mx, my, mr);
      mb.addColorStop(0, '#d97757'); mb.addColorStop(0.6, '#8a3a22'); mb.addColorStop(1, '#2a0e08');
      ctx.fillStyle = mb;
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = 'rgba(245,158,11,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(mx, my, mr, 0, Math.PI * 2); ctx.stroke();

      // Beam
      const errorFresh = p.errorFlash !== lastFlashRef.current;
      if (errorFresh) { lastFlashRef.current = p.errorFlash; flashAtRef.current = now; }
      const flashAge = now - flashAtRef.current;
      const flashing = flashAge < 600;
      const flashIntensity = flashing ? 1 - flashAge / 600 : 0;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const beamGrad = ctx.createLinearGradient(ex, ey, mx, my);
      if (flashing) {
        beamGrad.addColorStop(0, `rgba(239,68,68,${0.5 + 0.4 * flashIntensity})`);
        beamGrad.addColorStop(1, `rgba(239,68,68,${0.5 + 0.4 * flashIntensity})`);
      } else {
        beamGrad.addColorStop(0, 'rgba(0,212,255,0.55)');
        beamGrad.addColorStop(0.5, 'rgba(124,58,237,0.4)');
        beamGrad.addColorStop(1, 'rgba(245,158,11,0.5)');
      }
      ctx.strokeStyle = beamGrad; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(ex + er, ey); ctx.lineTo(mx - mr, my); ctx.stroke();

      ctx.strokeStyle = flashing ? 'rgba(239,68,68,0.25)' : 'rgba(0,212,255,0.12)';
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(ex + er, ey); ctx.lineTo(mx - mr, my); ctx.stroke();
      ctx.restore();

      // Pulses — faster when transmitting
      const pulseInterval = p.transmitting ? 320 : 1500;
      if (now - lastPulse > pulseInterval) { pulses.push({ t: now }); lastPulse = now; }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const age = now - pulses[i].t;
        const life = p.transmitting ? 900 : 1800;
        if (age > life) { pulses.splice(i, 1); continue; }
        const prog = age / life;
        const px = (ex + er) + ((mx - mr) - (ex + er)) * prog;
        const py = ey + (my - ey) * prog;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 9);
        pg.addColorStop(0, flashing ? 'rgba(255,180,180,0.9)' : 'rgba(180,240,255,0.9)');
        pg.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.arc(px, py, 9, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath(); ctx.arc(px, py, 1.4, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Progress indicator as a small filled segment from Earth along beam
      if (p.progress > 0 && p.progress < 1) {
        const endX = (ex + er) + ((mx - mr) - (ex + er)) * p.progress;
        const endY = ey + (my - ey) * p.progress;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgba(0,212,255,0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(ex + er, ey); ctx.lineTo(endX, endY); ctx.stroke();
        ctx.restore();
      }

      // Text labels
      ctx.fillStyle = '#00d4ff';
      ctx.font = '10px ui-monospace, monospace';
      ctx.textAlign = 'left';
      ctx.fillText('EARTH · 40.7°N', ex - er, ey + er + 18);
      ctx.textAlign = 'right';
      ctx.fillText('MARS · 14.6°N', mx + mr, my + mr + 18);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#8b92a9';
      ctx.fillText(p.distanceLabel, (ex + mx) / 2, ey - 14);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Corner HUD readouts */}
      <div className="corner-tick-tl" />
      <div className="corner-tick-tr" />
      <div className="corner-tick-bl" />
      <div className="corner-tick-br" />

      <div
        className="absolute top-5 left-6 z-10 pointer-events-none"
        style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#8b92a9' }}
      >
        <div style={{ color: '#00d4ff' }}>● LINK ACTIVE</div>
        <div>FRAME · ECI-J2000</div>
      </div>

      <div
        className="absolute top-5 right-6 z-10 pointer-events-none text-right"
        style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#8b92a9' }}
      >
        <div>
          FIDELITY <span style={{ color: '#10b981' }}>{(fidelity * 100).toFixed(2)}%</span>
        </div>
        <div>
          PAIR RATE <span style={{ color: '#00d4ff' }}>{pairRate.toLocaleString()}/s</span>
        </div>
      </div>

      <div
        className="absolute bottom-5 left-6 z-10 pointer-events-none"
        style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#8b92a9' }}
      >
        <div>
          BITS SENT <span style={{ color: '#e8eaf0' }}>{bitsSent.toLocaleString()}</span>
        </div>
        <div>PROGRESS {(progress * 100).toFixed(0)}%</div>
      </div>

      <div
        className="absolute bottom-5 right-6 z-10 pointer-events-none text-right"
        style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#8b92a9' }}
      >
        <div>CH · QC-01</div>
        <div>{transmitting ? <span style={{ color: '#00d4ff' }}>TRANSMITTING</span> : 'STANDBY'}</div>
      </div>
    </div>
  );
}
