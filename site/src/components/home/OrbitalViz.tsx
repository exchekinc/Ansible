'use client';

import { useEffect, useRef } from 'react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; color: string; }
interface Connection { from: number; to: number; progress: number; speed: number; }

export default function OrbitalViz() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2, cy = H / 2;
    const colors = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b'];

    // Particles (stars)
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.1,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.6 + 0.1,
      color: Math.random() > 0.85 ? colors[Math.floor(Math.random() * colors.length)] : '#ffffff',
    }));

    // Orbital nodes (satellites)
    const R1 = Math.min(W, H) * 0.22;
    const R2 = Math.min(W, H) * 0.35;
    const nodeCount = 6;
    const nodeAngles = Array.from({ length: nodeCount }, (_, i) => (i / nodeCount) * Math.PI * 2);
    let time = 0;

    // Data packets on connections
    const connections: Connection[] = [
      { from: 0, to: 3, progress: 0, speed: 0.004 },
      { from: 1, to: 4, progress: 0.33, speed: 0.005 },
      { from: 2, to: 5, progress: 0.66, speed: 0.003 },
      { from: 0, to: 1, progress: 0.2, speed: 0.006 },
      { from: 3, to: 4, progress: 0.7, speed: 0.004 },
    ];

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Dark gradient bg
      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.7);
      radGrad.addColorStop(0, 'rgba(10,15,35,0.3)');
      radGrad.addColorStop(1, 'rgba(5,7,15,0)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, W, H);

      time += 0.005;

      // Particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color === '#ffffff'
          ? `rgba(255,255,255,${p.opacity})`
          : p.color + Math.round(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });

      // Orbit rings
      [R1, R2].forEach((r, ri) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = ri === 0
          ? `rgba(0,212,255,0.12)`
          : `rgba(124,58,237,0.1)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Compute node positions
      const nodes = nodeAngles.map((base, i) => {
        const speed = i % 2 === 0 ? 0.15 : -0.1;
        const angle = base + time * speed;
        const r = i < 3 ? R1 : R2;
        return { x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, i };
      });

      // Connections (entanglement links)
      connections.forEach(conn => {
        conn.progress = (conn.progress + conn.speed) % 1;
        const a = nodes[conn.from], b = nodes[conn.to];

        // Line
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(0,212,255,0.06)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Packet
        const px = a.x + (b.x - a.x) * conn.progress;
        const py = a.y + (b.y - a.y) * conn.progress;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        grad.addColorStop(0, 'rgba(0,212,255,0.9)');
        grad.addColorStop(1, 'rgba(0,212,255,0)');
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Packet core
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });

      // Earth glow
      const earthGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 28);
      earthGrad.addColorStop(0, 'rgba(0,212,255,0.25)');
      earthGrad.addColorStop(0.5, 'rgba(0,100,180,0.15)');
      earthGrad.addColorStop(1, 'rgba(0,212,255,0)');
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fillStyle = earthGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#0ea5e9';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx, cy, 12, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,255,0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Satellite nodes
      nodes.forEach(({ x, y, i }) => {
        const col = i < 3 ? '#00d4ff' : '#7c3aed';
        const glowGrad = ctx.createRadialGradient(x, y, 0, x, y, 16);
        glowGrad.addColorStop(0, col + '40');
        glowGrad.addColorStop(1, col + '00');
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fillStyle = col;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff30';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    const onResize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.9 }}
    />
  );
}
