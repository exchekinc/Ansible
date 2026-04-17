'use client';

import { ChevronDown, ChevronUp, Send, RotateCcw } from 'lucide-react';
import { MARS_DISTANCES, type DistanceKey } from './QuantumSimulator';

interface Props {
  distKey: DistanceKey;
  setDistKey: (k: DistanceKey) => void;
  lambda: number;
  setLambda: (n: number) => void;
  kappa: number;
  setKappa: (n: number) => void;
  theta: number;
  setTheta: (n: number) => void;
  phi: number;
  setPhi: (n: number) => void;
  errorRate: number;
  setErrorRate: (n: number) => void;
  errorCorrection: boolean;
  setErrorCorrection: (b: boolean) => void;
  showAdvanced: boolean;
  setShowAdvanced: (b: boolean) => void;
  message: string;
  setMessage: (s: string) => void;
  onTransmit: () => void;
  onReset: () => void;
  transmitting: boolean;
  binaryBits: number[];
  channelCapacity: number;
  formatTime: (s: number) => string;
  lightspeedTime: number;
}

export default function ControlConsole(p: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* ---- LEFT: distance ---- */}
      <div className="glass rounded-2xl p-6 relative">
        <div className="corner-tick-tl" />
        <div className="corner-tick-br" />
        <div className="caption mb-4" style={{ color: '#00d4ff' }}>
          EARTH-MARS LINK
        </div>
        <div className="flex flex-col gap-2">
          {(Object.entries(MARS_DISTANCES) as [DistanceKey, typeof MARS_DISTANCES.min][]).map(([key, val]) => {
            const active = p.distKey === key;
            return (
              <button
                key={key}
                onClick={() => p.setDistKey(key)}
                className="px-3 py-2.5 rounded-lg text-left transition-all duration-200 flex items-center justify-between gap-3"
                style={{
                  background: active ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${active ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <div>
                  <div className="text-xs font-semibold" style={{ color: active ? '#00d4ff' : '#c8ccd8' }}>
                    {val.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono), monospace',
                      fontSize: '10px',
                      color: '#5a6070',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {val.sub}
                  </div>
                </div>
                {active && (
                  <span
                    className="w-1.5 h-1.5 rounded-full animate-pulse-slow"
                    style={{ background: '#00d4ff' }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <p
          className="mt-4 text-xs"
          style={{ fontFamily: 'var(--font-mono), monospace', color: '#5a6070', letterSpacing: '0.1em' }}
        >
          RADIO DELAY: <span style={{ color: '#ef4444' }}>{p.formatTime(p.lightspeedTime)}</span>
        </p>
      </div>

      {/* ---- MIDDLE: parameters ---- */}
      <div className="glass rounded-2xl p-6 relative">
        <div className="corner-tick-tr" />
        <div className="corner-tick-bl" />
        <div className="flex items-center justify-between mb-4">
          <div className="caption" style={{ color: '#00d4ff' }}>
            QUANTUM PARAMS
          </div>
          <button
            onClick={() => p.setShowAdvanced(!p.showAdvanced)}
            className="flex items-center gap-1 text-[10px] transition-colors hover:text-[#00d4ff]"
            style={{ color: '#5a6070', fontFamily: 'var(--font-mono), monospace', letterSpacing: '0.15em' }}
          >
            {p.showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {p.showAdvanced ? 'HIDE' : 'MORE'}
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div
              className="flex justify-between mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.1em' }}
            >
              <span style={{ color: '#8b92a9' }}>λ · LAMBDA</span>
              <span style={{ color: '#00d4ff' }}>{p.lambda.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.05}
              value={p.lambda}
              onChange={(e) => p.setLambda(+e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <div
              className="flex justify-between mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.1em' }}
            >
              <span style={{ color: '#8b92a9' }}>κ · KAPPA</span>
              <span style={{ color: '#7c3aed' }}>{p.kappa.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.01}
              value={p.kappa}
              onChange={(e) => p.setKappa(+e.target.value)}
              className="w-full"
            />
          </div>

          {p.showAdvanced && (
            <div className="pt-2 space-y-3" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
              <div>
                <div
                  className="flex justify-between mb-1.5"
                  style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.1em' }}
                >
                  <span style={{ color: '#8b92a9' }}>θ · THETA</span>
                  <span style={{ color: '#10b981' }}>{(p.theta / Math.PI).toFixed(2)}π</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.PI}
                  step={0.01}
                  value={p.theta}
                  onChange={(e) => p.setTheta(+e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <div
                  className="flex justify-between mb-1.5"
                  style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.1em' }}
                >
                  <span style={{ color: '#8b92a9' }}>φ · PHI</span>
                  <span style={{ color: '#10b981' }}>{(p.phi / Math.PI).toFixed(2)}π</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={Math.PI}
                  step={0.01}
                  value={p.phi}
                  onChange={(e) => p.setPhi(+e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <div
                  className="flex justify-between mb-1.5"
                  style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.1em' }}
                >
                  <span style={{ color: '#8b92a9' }}>ERROR RATE</span>
                  <span style={{ color: '#f59e0b' }}>{(p.errorRate * 100).toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={0.1}
                  step={0.001}
                  value={p.errorRate}
                  onChange={(e) => p.setErrorRate(+e.target.value)}
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="pt-2" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
            <div
              className="flex justify-between mb-1.5"
              style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.1em' }}
            >
              <span style={{ color: '#8b92a9' }}>CAPACITY</span>
              <span style={{ color: '#00d4ff' }}>{(p.channelCapacity * 100).toFixed(1)}%</span>
            </div>
            <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-1 rounded-full transition-all"
                style={{
                  width: `${p.channelCapacity * 100}%`,
                  background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ---- RIGHT: message + transmit + EC toggle ---- */}
      <div className="glass rounded-2xl p-6 relative flex flex-col">
        <div className="corner-tick-tl" />
        <div className="corner-tick-br" />
        <div className="flex items-center justify-between mb-4">
          <div className="caption" style={{ color: '#00d4ff' }}>
            TRANSMISSION
          </div>
          <div
            onClick={() => p.setErrorCorrection(!p.errorCorrection)}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div
              className="w-9 h-5 rounded-full relative transition-all"
              style={{
                background: p.errorCorrection ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)',
                border: `1px solid ${p.errorCorrection ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.12)'}`,
              }}
            >
              <div
                className="absolute top-0.5 w-3.5 h-3.5 rounded-full transition-all"
                style={{
                  left: p.errorCorrection ? '18px' : '2px',
                  background: p.errorCorrection ? '#00d4ff' : '#5a6070',
                }}
              />
            </div>
            <span
              style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#8b92a9' }}
            >
              EC
            </span>
          </div>
        </div>

        <textarea
          value={p.message}
          onChange={(e) => p.setMessage(e.target.value)}
          disabled={p.transmitting}
          rows={3}
          placeholder="Message to transmit…"
          className="w-full rounded-lg px-3 py-2 text-sm resize-none focus:outline-none transition-colors flex-1"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.15)',
            color: '#e8eaf0',
            caretColor: '#00d4ff',
            minHeight: 72,
            fontFamily: 'var(--font-mono), monospace',
            fontSize: '12px',
            letterSpacing: '0.02em',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; }}
        />

        <div className="flex items-center justify-between mt-3">
          <span
            style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#5a6070' }}
          >
            {p.binaryBits.length} BITS
          </span>
          <div className="flex gap-2">
            <button
              onClick={p.onReset}
              disabled={p.transmitting}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-[10px] transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#8b92a9',
                fontFamily: 'var(--font-mono), monospace',
                letterSpacing: '0.15em',
              }}
            >
              <RotateCcw size={10} /> RESET
            </button>
            <button
              onClick={p.onTransmit}
              disabled={p.binaryBits.length === 0 || p.transmitting}
              className="btn-primary flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-semibold"
              style={{ letterSpacing: '0.15em' }}
            >
              <Send size={10} />
              {p.transmitting ? 'SENDING…' : 'TRANSMIT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
