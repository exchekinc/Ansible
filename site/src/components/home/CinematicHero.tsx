'use client';

import { useEffect, useRef } from 'react';

/**
 * CinematicHero — a single-canvas composited scene.
 *
 * Layers (back-to-front):
 *   1. Deep-space vignette fill
 *   2. 3 parallax starfields (far/mid/near) with per-star twinkle
 *   3. Earth orb with radial-gradient atmosphere + slow highlight drift
 *   4. Two elliptical orbital rings (LEO + MEO inclinations)
 *   5. Satellites on rings, each with a soft additive glow + short trail
 *   6. Entanglement beam: satellite -> off-screen-right w/ pulsing photons
 *   7. Mars orb in upper-right with its own glow
 *   8. Heavy edge vignette for text legibility
 *
 * Performance:
 *   - single RAF loop, devicePixelRatio-aware
 *   - pauses on document.visibilityState === 'hidden'
 *   - halves particle density under 768px
 *   - clean cleanup on unmount
 */
export default function CinematicHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let W = 0, H = 0, dpr = 1;
    let mobile = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      mobile = W < 768;
    };
    resize();
    window.addEventListener('resize', resize);

    // Starfields
    type Star = { x: number; y: number; r: number; base: number; twinkle: number; speed: number };
    const makeStars = (n: number, speed: number, rMax: number, baseMin: number) =>
      Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * rMax + 0.2,
        base: baseMin + Math.random() * (1 - baseMin),
        twinkle: Math.random() * Math.PI * 2,
        speed,
      }));
    let far: Star[] = [];
    let mid: Star[] = [];
    let near: Star[] = [];
    const rebuildStars = () => {
      const mult = mobile ? 0.5 : 1;
      far = makeStars(Math.floor(140 * mult), 0.015, 0.9, 0.15);
      mid = makeStars(Math.floor(80 * mult), 0.04, 1.3, 0.3);
      near = makeStars(Math.floor(30 * mult), 0.08, 1.8, 0.55);
    };
    rebuildStars();

    // Earth placement (bottom-left-ish on desktop, centered-low on mobile)
    const earthPos = () => ({
      x: mobile ? W * 0.5 : W * 0.32,
      y: mobile ? H * 0.62 : H * 0.58,
      r: Math.min(W, H) * (mobile ? 0.24 : 0.19),
    });

    // Satellite definitions (angle offsets around Earth, inclinations, speeds)
    type Sat = { ring: 0 | 1; a0: number; speed: number; color: string };
    const sats: Sat[] = [
      { ring: 0, a0: 0.0, speed: 0.28, color: '#00d4ff' },
      { ring: 0, a0: 2.1, speed: 0.28, color: '#00d4ff' },
      { ring: 0, a0: 4.3, speed: 0.28, color: '#00d4ff' },
      { ring: 1, a0: 1.0, speed: -0.17, color: '#7c3aed' },
      { ring: 1, a0: 3.5, speed: -0.17, color: '#7c3aed' },
      { ring: 1, a0: 5.6, speed: -0.17, color: '#a78bfa' },
    ];

    // Entanglement beam photon pulses
    type Pulse = { t: number; life: number };
    let pulses: Pulse[] = [];
    let lastPulse = 0;

    let start = performance.now();
    let paused = false;

    const onVis = () => { paused = document.visibilityState === 'hidden'; if (!paused) start = performance.now() - elapsed; };
    let elapsed = 0;
    document.addEventListener('visibilitychange', onVis);

    const drawEarth = (cx: number, cy: number, r: number, t: number) => {
      // Outer atmospheric halo
      const halo = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 2.2);
      halo.addColorStop(0, 'rgba(0,212,255,0.22)');
      halo.addColorStop(0.4, 'rgba(0,120,200,0.08)');
      halo.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Base sphere
      const body = ctx.createRadialGradient(
        cx - r * 0.35,
        cy - r * 0.35,
        r * 0.1,
        cx,
        cy,
        r,
      );
      body.addColorStop(0, '#2a8dbf');
      body.addColorStop(0.45, '#0e4c7a');
      body.addColorStop(0.85, '#061a2e');
      body.addColorStop(1, '#020712');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Drifting highlight (rotation feel)
      const hx = cx + Math.cos(t * 0.15) * r * 0.25 - r * 0.3;
      const hy = cy - r * 0.25 + Math.sin(t * 0.15) * r * 0.15;
      const highlight = ctx.createRadialGradient(hx, hy, 0, hx, hy, r * 0.7);
      highlight.addColorStop(0, 'rgba(120,220,255,0.35)');
      highlight.addColorStop(1, 'rgba(120,220,255,0)');
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = highlight;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.restore();

      // Cyan terminator rim
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,255,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    const drawMars = (cx: number, cy: number, r: number) => {
      const halo = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r * 2.5);
      halo.addColorStop(0, 'rgba(245,158,11,0.25)');
      halo.addColorStop(0.5, 'rgba(220,80,40,0.08)');
      halo.addColorStop(1, 'rgba(245,158,11,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
      ctx.fill();

      const body = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r);
      body.addColorStop(0, '#d97757');
      body.addColorStop(0.55, '#8a3a22');
      body.addColorStop(1, '#2a0e08');
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(245,158,11,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    };

    const drawStars = (arr: Star[], t: number, driftPx: number) => {
      for (const s of arr) {
        s.x -= s.speed * driftPx;
        if (s.x < -2) s.x = W + 2;
        const tw = (Math.sin(t * 2 + s.twinkle) * 0.5 + 0.5) * 0.35 + 0.65;
        const a = s.base * tw;
        ctx.globalAlpha = a;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (paused) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }
      elapsed = now - start;
      const t = elapsed / 1000;

      // Base fill
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, W, H);

      // Big soft radial glow behind earth area
      const earth = earthPos();
      const bg = ctx.createRadialGradient(earth.x, earth.y, 0, earth.x, earth.y, Math.max(W, H) * 0.7);
      bg.addColorStop(0, 'rgba(8,20,50,0.7)');
      bg.addColorStop(0.5, 'rgba(5,7,15,0.2)');
      bg.addColorStop(1, 'rgba(5,7,15,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Starfields with parallax drift
      drawStars(far, t, 1);
      drawStars(mid, t, 1);
      drawStars(near, t, 1);

      // Orbital rings (ellipses to suggest inclination)
      const ringR1 = earth.r * 1.5;
      const ringR2 = earth.r * 2.1;
      const tilt1 = -0.28;
      const tilt2 = 0.18;

      const drawRing = (rx: number, ry: number, rot: number, color: string, alpha: number) => {
        ctx.save();
        ctx.translate(earth.x, earth.y);
        ctx.rotate(rot);
        ctx.strokeStyle = color.replace('ALPHA', String(alpha));
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 6]);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      };
      drawRing(ringR1, ringR1 * 0.32, tilt1, 'rgba(0,212,255,ALPHA)', 0.22);
      drawRing(ringR2, ringR2 * 0.28, tilt2, 'rgba(124,58,237,ALPHA)', 0.18);

      // Earth
      drawEarth(earth.x, earth.y, earth.r, t);

      // Satellite positions + rendering
      const satPositions: { x: number; y: number; color: string; ring: 0 | 1 }[] = [];
      for (const s of sats) {
        const rx = s.ring === 0 ? ringR1 : ringR2;
        const ry = s.ring === 0 ? ringR1 * 0.32 : ringR2 * 0.28;
        const rot = s.ring === 0 ? tilt1 : tilt2;
        const a = s.a0 + t * s.speed;
        const lx = Math.cos(a) * rx;
        const ly = Math.sin(a) * ry;
        const cos = Math.cos(rot), sin = Math.sin(rot);
        const x = earth.x + lx * cos - ly * sin;
        const y = earth.y + lx * sin + ly * cos;
        satPositions.push({ x, y, color: s.color, ring: s.ring });

        // Additive glow
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createRadialGradient(x, y, 0, x, y, 14);
        g.addColorStop(0, s.color + 'cc');
        g.addColorStop(1, s.color + '00');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Pick a satellite to be the beam emitter (first ring-0 sat)
      const emitter = satPositions[0];

      // Mars
      const marsR = Math.max(14, Math.min(W, H) * 0.035);
      const marsX = W - marsR * 3.5;
      const marsY = marsR * 3.2;
      drawMars(marsX, marsY, marsR);

      // Entanglement beam: emitter -> Mars
      if (emitter) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const grad = ctx.createLinearGradient(emitter.x, emitter.y, marsX, marsY);
        grad.addColorStop(0, 'rgba(0,212,255,0.55)');
        grad.addColorStop(0.5, 'rgba(124,58,237,0.35)');
        grad.addColorStop(1, 'rgba(245,158,11,0.5)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(emitter.x, emitter.y);
        ctx.lineTo(marsX, marsY);
        ctx.stroke();

        // Soft outer glow line
        ctx.strokeStyle = 'rgba(0,212,255,0.12)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(emitter.x, emitter.y);
        ctx.lineTo(marsX, marsY);
        ctx.stroke();
        ctx.restore();

        // Spawn pulses every ~1.5s
        if (now - lastPulse > 1500) {
          pulses.push({ t: now, life: 1800 });
          lastPulse = now;
        }
        pulses = pulses.filter(p => now - p.t < p.life);
        for (const p of pulses) {
          const progress = (now - p.t) / p.life;
          const px = emitter.x + (marsX - emitter.x) * progress;
          const py = emitter.y + (marsY - emitter.y) * progress;
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          const pg = ctx.createRadialGradient(px, py, 0, px, py, 10);
          pg.addColorStop(0, 'rgba(180,240,255,0.9)');
          pg.addColorStop(1, 'rgba(0,212,255,0)');
          ctx.fillStyle = pg;
          ctx.beginPath();
          ctx.arc(px, py, 10, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // Edge vignette for text legibility
      const vg = ctx.createRadialGradient(W * 0.5, H * 0.5, Math.min(W, H) * 0.25, W * 0.5, H * 0.5, Math.max(W, H) * 0.75);
      vg.addColorStop(0, 'rgba(5,7,15,0)');
      vg.addColorStop(0.6, 'rgba(5,7,15,0.35)');
      vg.addColorStop(1, 'rgba(5,7,15,0.95)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
