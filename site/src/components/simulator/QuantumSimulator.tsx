'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, RotateCcw, Zap, Clock, Radio, ChevronDown, ChevronUp, Activity } from 'lucide-react';

const MARS_DISTANCES = {
  min: { km: 54_600_000, label: 'Closest Approach', sub: '54.6M km' },
  avg: { km: 225_000_000, label: 'Average Distance', sub: '225M km' },
  max: { km: 401_000_000, label: 'Maximum Distance', sub: '401M km' },
};

const C = 299_792.458; // km/s

type DistanceKey = keyof typeof MARS_DISTANCES;

interface BitResult { bit: number; original: number; error: boolean; }

export default function QuantumSimulator() {
  const [lambda, setLambda] = useState(1.0);
  const [kappa, setKappa] = useState(0.15);
  const [theta, setTheta] = useState(Math.PI / 8);
  const [phi, setPhi] = useState((3 * Math.PI) / 8);
  const [errorRate, setErrorRate] = useState(0.01);
  const [distKey, setDistKey] = useState<DistanceKey>('min');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorCorrection, setErrorCorrection] = useState(true);
  const [message, setMessage] = useState('Hello, Mars. This is Earth. Do you copy?');
  const [binaryBits, setBinaryBits] = useState<number[]>([]);
  const [resultBits, setResultBits] = useState<BitResult[]>([]);
  const [transmitting, setTransmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [transmitTime, setTransmitTime] = useState(0);
  const [currentBit, setCurrentBit] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const mountedRef = useRef(true);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const dist = MARS_DISTANCES[distKey];
  const lightspeedTime = dist.km / C;

  const toBinary = (text: string): number[] => {
    const bits: number[] = [];
    for (const ch of text) {
      const code = ch.charCodeAt(0);
      for (let b = 7; b >= 0; b--) bits.push((code >> b) & 1);
    }
    return bits;
  };

  useEffect(() => { setBinaryBits(toBinary(message)); }, [message]);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setTransmitting(false);
    setComplete(false);
    setResultBits([]);
    setCurrentBit(null);
    setProgress(0);
    setTransmitTime(0);
  }, []);

  const channelCapacity = (() => {
    const h = (p: number) => p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
    const theoretical = 1 - h(errorRate);
    const efficiency = 0.5 + 0.5 * Math.exp(-(Math.pow(lambda - 1.0, 2) + Math.pow(kappa - 0.15, 2)) / 0.5);
    const practical = theoretical * efficiency;
    return { theoretical, practical: errorCorrection ? practical : practical * 0.7 };
  })();

  const startTransmission = () => {
    if (binaryBits.length === 0 || transmitting) return;
    reset();
    setTransmitting(true);

    const bits = [...binaryBits];
    const results: BitResult[] = [];
    let idx = 0;
    let lastTimestamp = 0;
    const startTime = performance.now();

    const step = (timestamp: number) => {
      if (!mountedRef.current) return;
      if (timestamp - lastTimestamp < 60) { rafRef.current = requestAnimationFrame(step); return; }
      lastTimestamp = timestamp;

      if (idx < bits.length) {
        const original = bits[idx];
        const flipped = Math.random() < errorRate;
        const received = flipped ? 1 - original : original;
        results.push({ bit: received, original, error: flipped });
        idx++;
        setCurrentBit(original);
        setResultBits([...results]);
        setProgress(idx / bits.length);
        rafRef.current = requestAnimationFrame(step);
      } else {
        const elapsed = (performance.now() - startTime) / 1000;
        setTransmitTime(elapsed);
        setTransmitting(false);
        setComplete(true);
        setCurrentBit(null);
        setProgress(1);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const decoded = (() => {
    if (!complete || resultBits.length === 0) return { text: '', errors: 0, corrected: 0 };
    let errors = 0, corrected = 0;
    const bits = resultBits.map(({ bit, original, error }) => {
      if (error) {
        errors++;
        if (errorCorrection) { corrected++; return original; }
      }
      return bit;
    });
    let text = '';
    for (let i = 0; i + 7 < bits.length; i += 8) {
      const byte = bits.slice(i, i + 8).reduce((acc, b, j) => acc | (b << (7 - j)), 0);
      text += String.fromCharCode(byte);
    }
    return { text, errors, corrected };
  })();

  const speedup = transmitTime > 0 ? Math.round(lightspeedTime / transmitTime) : 0;

  const formatTime = (s: number) => {
    if (s < 60) return `${s.toFixed(1)}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* Distance selector */}
      <div className="glass rounded-2xl p-6">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#00d4ff' }}>
          Earth–Mars Distance
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(MARS_DISTANCES) as [DistanceKey, typeof MARS_DISTANCES.min][]).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setDistKey(key)}
              className="p-3 rounded-xl text-left transition-all duration-200"
              style={{
                background: distKey === key ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${distKey === key ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.06)'}`,
              }}
            >
              <div className="text-xs font-semibold mb-0.5" style={{ color: distKey === key ? '#00d4ff' : '#8b92a9' }}>
                {val.label}
              </div>
              <div className="text-[10px]" style={{ color: '#5a6070' }}>{val.sub}</div>
            </button>
          ))}
        </div>
        <p className="text-xs mt-3" style={{ color: '#5a6070' }}>
          Classical radio delay at this distance: <span style={{ color: '#ef4444' }}>{formatTime(lightspeedTime)}</span>
        </p>
      </div>

      {/* Parameters */}
      <div className="glass rounded-2xl p-6">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#00d4ff' }}>
          Quantum Parameters
        </label>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: '#8b92a9' }}>λ Lambda Coupling</span>
              <span style={{ color: '#00d4ff' }}>{lambda.toFixed(2)}</span>
            </div>
            <input type="range" min={0} max={2} step={0.05} value={lambda} onChange={e => setLambda(+e.target.value)} className="w-full" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: '#8b92a9' }}>κ Kappa Coupling</span>
              <span style={{ color: '#7c3aed' }}>{kappa.toFixed(2)}</span>
            </div>
            <input type="range" min={0} max={0.5} step={0.01} value={kappa} onChange={e => setKappa(+e.target.value)} className="w-full" />
          </div>
        </div>

        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs mt-4 transition-colors hover:text-[#00d4ff]"
          style={{ color: '#5a6070' }}
        >
          {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {showAdvanced ? 'Hide' : 'Show'} Advanced Parameters
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-5 mt-4 pt-4" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: '#8b92a9' }}>θ Theta</span>
                <span style={{ color: '#10b981' }}>{(theta / Math.PI).toFixed(2)}π</span>
              </div>
              <input type="range" min={0} max={Math.PI} step={0.01} value={theta} onChange={e => setTheta(+e.target.value)} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: '#8b92a9' }}>φ Phi</span>
                <span style={{ color: '#10b981' }}>{(phi / Math.PI).toFixed(2)}π</span>
              </div>
              <input type="range" min={0} max={Math.PI} step={0.01} value={phi} onChange={e => setPhi(+e.target.value)} className="w-full" />
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span style={{ color: '#8b92a9' }}>Error Rate</span>
                <span style={{ color: '#f59e0b' }}>{(errorRate * 100).toFixed(1)}%</span>
              </div>
              <input type="range" min={0} max={0.1} step={0.001} value={errorRate} onChange={e => setErrorRate(+e.target.value)} className="w-full" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div
                onClick={() => setErrorCorrection(!errorCorrection)}
                className="w-10 h-5 rounded-full cursor-pointer transition-all duration-200 relative flex-shrink-0"
                style={{
                  background: errorCorrection ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${errorCorrection ? 'rgba(0,212,255,0.5)' : 'rgba(255,255,255,0.15)'}`,
                }}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
                  style={{
                    left: errorCorrection ? '20px' : '1px',
                    background: errorCorrection ? '#00d4ff' : '#5a6070',
                  }}
                />
              </div>
              <span className="text-xs" style={{ color: '#8b92a9' }}>Error Correction</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,212,255,0.07)' }}>
          <span className="text-xs" style={{ color: '#5a6070' }}>Channel Capacity</span>
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${channelCapacity.practical * 100}%`, background: 'linear-gradient(to right, #00d4ff, #7c3aed)' }}
              />
            </div>
            <span className="text-xs font-mono" style={{ color: '#00d4ff' }}>
              {(channelCapacity.practical * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Message input */}
      <div className="glass rounded-2xl p-6">
        <label className="block text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#00d4ff' }}>
          Message to Transmit
        </label>
        <textarea
          value={message}
          onChange={e => { setMessage(e.target.value); reset(); }}
          placeholder="Enter message to transmit to Mars..."
          disabled={transmitting}
          rows={3}
          className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none transition-all"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(0,212,255,0.15)',
            color: '#e8eaf0',
            caretColor: '#00d4ff',
          }}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)'; }}
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-xs" style={{ color: '#5a6070' }}>
            {binaryBits.length} bits · {message.length} chars
          </span>
          <div className="flex gap-3">
            <button
              onClick={reset}
              disabled={transmitting}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#8b92a9',
              }}
            >
              <RotateCcw size={12} /> Reset
            </button>
            <button
              onClick={startTransmission}
              disabled={binaryBits.length === 0 || transmitting}
              className="btn-primary flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
            >
              <Send size={12} />
              {transmitting ? 'Transmitting...' : 'Transmit to Mars'}
            </button>
          </div>
        </div>
      </div>

      {/* Transmission visualization */}
      {(transmitting || complete) && (
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity size={16} style={{ color: '#00d4ff' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#00d4ff' }}>
              Quantum Transmission
            </span>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs mb-2">
              <span style={{ color: '#8b92a9' }}>
                {transmitting ? `Transmitting bit ${resultBits.length} of ${binaryBits.length}` : 'Transmission complete'}
              </span>
              <span style={{ color: '#00d4ff' }}>{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${progress * 100}%`,
                  background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                  boxShadow: transmitting ? '0 0 10px rgba(0,212,255,0.4)' : 'none',
                }}
              />
            </div>
          </div>

          {/* Live bit stream */}
          {transmitting && currentBit !== null && (
            <div className="mb-5 p-3 rounded-xl font-mono text-xs flex items-center gap-3"
              style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)' }}>
              <span className="animate-pulse-slow w-2 h-2 rounded-full bg-[#00d4ff]" />
              <span style={{ color: '#00d4ff' }}>TRANSMITTING</span>
              <span style={{ color: '#8b92a9' }}>current bit:</span>
              <span className="text-sm font-bold" style={{ color: '#e8eaf0' }}>{currentBit}</span>
            </div>
          )}

          {/* Results */}
          {complete && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Zap size={14} style={{ color: '#00d4ff' }} />
                    <span className="text-xs" style={{ color: '#8b92a9' }}>Ansible Time</span>
                  </div>
                  <div className="text-xl font-bold font-mono" style={{ color: '#00d4ff' }}>
                    {formatTime(transmitTime)}
                  </div>
                </div>
                <div
                  className="rounded-xl p-4"
                  style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Radio size={14} style={{ color: '#ef4444' }} />
                    <span className="text-xs" style={{ color: '#8b92a9' }}>Radio Time</span>
                  </div>
                  <div className="text-xl font-bold font-mono" style={{ color: '#ef4444' }}>
                    {formatTime(lightspeedTime)}
                  </div>
                </div>
              </div>

              <div
                className="text-center py-3 rounded-xl mb-5"
                style={{
                  background: speedup > 1 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                  border: `1px solid ${speedup > 1 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`,
                }}
              >
                {speedup > 1 ? (
                  <span className="font-bold text-sm" style={{ color: '#10b981' }}>
                    ⚡ {speedup.toLocaleString()}× faster than light-speed radio
                  </span>
                ) : (
                  <span className="text-sm" style={{ color: '#ef4444' }}>Transmission speed not superluminal</span>
                )}
              </div>

              {/* Decoded message */}
              <div>
                <p className="text-xs font-semibold mb-2 flex items-center gap-2" style={{ color: '#8b92a9' }}>
                  <Clock size={12} style={{ color: '#00d4ff' }} />
                  Message Received on Mars
                </p>
                <div
                  className="rounded-xl px-4 py-3 font-mono text-sm min-h-10"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: '#e8eaf0' }}
                >
                  {decoded.text || <span style={{ color: '#5a6070' }}>—</span>}
                </div>
                {decoded.errors > 0 && (
                  <p className="text-xs mt-2" style={{ color: '#f59e0b' }}>
                    {errorCorrection
                      ? `Detected & corrected ${decoded.corrected} bit errors via surface code`
                      : `${decoded.errors} bit errors detected (error correction disabled)`}
                  </p>
                )}
                {decoded.errors === 0 && (
                  <p className="text-xs mt-2" style={{ color: '#10b981' }}>No transmission errors detected</p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <p className="text-xs text-center" style={{ color: '#5a6070' }}>
        Simulation based on the Ansible theoretical framework. Real implementation would require orbital quantum relay infrastructure.
      </p>
    </div>
  );
}
