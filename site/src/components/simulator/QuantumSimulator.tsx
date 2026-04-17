'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, Zap, Clock } from 'lucide-react';
import MissionScene from './MissionScene';
import ControlConsole from './ControlConsole';

// -----------------------------
// Shared constants (exported for console)
// -----------------------------
export const MARS_DISTANCES = {
  min: { km: 54_600_000, label: 'Closest Approach', sub: '54.6M km · 3.03 lmin' },
  avg: { km: 225_000_000, label: 'Average Distance', sub: '225M km · 12.5 lmin' },
  max: { km: 401_000_000, label: 'Maximum Distance', sub: '401M km · 22.3 lmin' },
} as const;

const C = 299_792.458; // km/s

export type DistanceKey = keyof typeof MARS_DISTANCES;

interface BitResult {
  bit: number;
  original: number;
  error: boolean;
}

export default function QuantumSimulator() {
  // ---- State (all preserved from the original) ----
  const [lambda, setLambda] = useState(1.0);
  const [kappa, setKappa] = useState(0.15);
  const [theta, setTheta] = useState(Math.PI / 8);
  const [phi, setPhi] = useState((3 * Math.PI) / 8);
  const [errorRate, setErrorRate] = useState(0.01);
  const [distKey, setDistKey] = useState<DistanceKey>('min');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errorCorrection, setErrorCorrection] = useState(true);
  const [message, setMessage] = useState('Hello, Mars. This is Earth. Do you copy?');
  const [resultBits, setResultBits] = useState<BitResult[]>([]);
  const [transmitting, setTransmitting] = useState(false);
  const [complete, setComplete] = useState(false);
  const [transmitTime, setTransmitTime] = useState(0);
  const [currentBit, setCurrentBit] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [errorFlash, setErrorFlash] = useState(0);

  // Live HUD metrics for scene
  const [radioFill, setRadioFill] = useState(0);
  const [ansibleFill, setAnsibleFill] = useState(0);

  const rafRef = useRef<number>(0);
  const radioRafRef = useRef<number>(0);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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

  const binaryBits = toBinary(message);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    cancelAnimationFrame(radioRafRef.current);
    setTransmitting(false);
    setComplete(false);
    setResultBits([]);
    setCurrentBit(null);
    setProgress(0);
    setTransmitTime(0);
    setRadioFill(0);
    setAnsibleFill(0);
  }, []);

  const channelCapacity = (() => {
    const h = (p: number) => (p <= 0 || p >= 1 ? 0 : -p * Math.log2(p) - (1 - p) * Math.log2(1 - p));
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

    // Start the radio-comparison fill (scales linearly across lightspeedTime)
    const radioDurMs = Math.min(lightspeedTime * 1000, 6000); // cap visually at 6s
    const radioStart = performance.now();
    const radioTick = (now: number) => {
      if (!mountedRef.current) return;
      const r = Math.min(1, (now - radioStart) / radioDurMs);
      setRadioFill(r);
      if (r < 1) radioRafRef.current = requestAnimationFrame(radioTick);
    };
    radioRafRef.current = requestAnimationFrame(radioTick);

    const step = (timestamp: number) => {
      if (!mountedRef.current) return;
      if (timestamp - lastTimestamp < 60) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      lastTimestamp = timestamp;

      if (idx < bits.length) {
        const original = bits[idx];
        const flipped = Math.random() < errorRate;
        const received = flipped ? 1 - original : original;
        results.push({ bit: received, original, error: flipped });
        idx++;
        setCurrentBit(original);
        setResultBits([...results]);
        const prog = idx / bits.length;
        setProgress(prog);
        setAnsibleFill(prog);
        if (flipped) setErrorFlash((x) => x + 1);
        rafRef.current = requestAnimationFrame(step);
      } else {
        const elapsed = (performance.now() - startTime) / 1000;
        setTransmitTime(elapsed);
        setTransmitting(false);
        setComplete(true);
        setCurrentBit(null);
        setProgress(1);
        setAnsibleFill(1);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const decoded = (() => {
    if (!complete || resultBits.length === 0) return { text: '', errors: 0, corrected: 0 };
    let errors = 0,
      corrected = 0;
    const bits = resultBits.map(({ bit, original, error }) => {
      if (error) {
        errors++;
        if (errorCorrection) {
          corrected++;
          return original;
        }
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

  // Fidelity readout — derived from lambda/kappa window + errorRate
  const fidelity = Math.max(
    0.85,
    Math.min(
      0.9999,
      0.9997 *
        (0.5 +
          0.5 * Math.exp(-(Math.pow(lambda - 1.0, 2) + Math.pow(kappa - 0.15, 2)) / 0.5)) -
        errorRate * 0.1,
    ),
  );
  const pairRate = Math.round(1_000_000 * (0.8 + 0.4 * Math.exp(-Math.pow(lambda - 1, 2))));
  const distanceLabel = `${dist.sub}`.toUpperCase();

  return (
    <div className="space-y-5">
      {/* ---- Top transmission timeline strip ---- */}
      <div
        className="relative h-[3px] rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <motion.div
          className="absolute inset-y-0 left-0"
          style={{
            width: `${progress * 100}%`,
            background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
            boxShadow: transmitting ? '0 0 8px rgba(0,212,255,0.6)' : 'none',
          }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.15 }}
        />
        {transmitting && (
          <div
            className="absolute inset-y-0"
            style={{
              left: `${Math.max(0, progress * 100 - 2)}%`,
              width: 3,
              background: '#ffffff',
              boxShadow: '0 0 8px #00d4ff, 0 0 16px #00d4ff',
            }}
          />
        )}
      </div>

      {/* ---- Mission viewport ---- */}
      <div
        className="relative rounded-2xl overflow-hidden glass"
        style={{
          aspectRatio: '16 / 9',
          minHeight: 320,
          border: '1px solid rgba(0,212,255,0.15)',
        }}
      >
        <MissionScene
          transmitting={transmitting}
          progress={progress}
          errorFlash={errorFlash}
          distanceLabel={distanceLabel}
          fidelity={fidelity}
          pairRate={pairRate}
          bitsSent={resultBits.length}
        />
      </div>

      {/* ---- Control console ---- */}
      <ControlConsole
        distKey={distKey}
        setDistKey={setDistKey}
        lambda={lambda}
        setLambda={setLambda}
        kappa={kappa}
        setKappa={setKappa}
        theta={theta}
        setTheta={setTheta}
        phi={phi}
        setPhi={setPhi}
        errorRate={errorRate}
        setErrorRate={setErrorRate}
        errorCorrection={errorCorrection}
        setErrorCorrection={setErrorCorrection}
        showAdvanced={showAdvanced}
        setShowAdvanced={setShowAdvanced}
        message={message}
        setMessage={(s) => { setMessage(s); reset(); }}
        onTransmit={startTransmission}
        onReset={reset}
        transmitting={transmitting}
        binaryBits={binaryBits}
        channelCapacity={channelCapacity.practical}
        formatTime={formatTime}
        lightspeedTime={lightspeedTime}
      />

      {/* ---- Latency comparison panel ---- */}
      <div className="glass rounded-2xl p-6 relative">
        <div className="corner-tick-tl" />
        <div className="corner-tick-br" />
        <div className="caption mb-4" style={{ color: '#00d4ff' }}>
          LATENCY COMPARISON
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Ansible */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap size={14} style={{ color: '#00d4ff' }} />
                <span
                  style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#00d4ff' }}
                >
                  ANSIBLE
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontVariantNumeric: 'tabular-nums',
                  color: '#00d4ff',
                  fontWeight: 700,
                }}
              >
                {complete ? formatTime(transmitTime) : transmitting ? `${(transmitTime).toFixed(1)}s…` : '— —'}
              </div>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${ansibleFill * 100}%`,
                  background: 'linear-gradient(to right, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 10px rgba(0,212,255,0.3)',
                }}
              />
            </div>
          </div>

          {/* Radio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Radio size={14} style={{ color: '#ef4444' }} />
                <span
                  style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', letterSpacing: '0.2em', color: '#ef4444' }}
                >
                  RADIO · c
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono), monospace',
                  fontVariantNumeric: 'tabular-nums',
                  color: '#ef4444',
                  fontWeight: 700,
                }}
              >
                {formatTime(lightspeedTime)}
              </div>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${radioFill * 100}%`, background: 'linear-gradient(to right, #ef4444, #f59e0b)' }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence>
          {complete && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 text-center py-2.5 rounded-xl"
              style={{
                background: speedup > 1 ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${speedup > 1 ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}
            >
              {speedup > 1 ? (
                <span
                  style={{
                    color: '#10b981',
                    fontFamily: 'var(--font-mono), monospace',
                    letterSpacing: '0.15em',
                    fontWeight: 700,
                    fontSize: '12px',
                  }}
                >
                  ⚡ {speedup.toLocaleString()}× FASTER THAN LIGHT-SPEED RADIO
                </span>
              ) : (
                <span style={{ color: '#ef4444', fontSize: '12px' }}>Transmission speed not superluminal</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ---- Transmission result / decoded message ---- */}
      <AnimatePresence>
        {(transmitting || complete) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass rounded-2xl p-6 relative"
          >
            <div className="corner-tick-tr" />
            <div className="corner-tick-bl" />

            <div className="flex items-center justify-between mb-4">
              <div className="caption" style={{ color: '#00d4ff' }}>
                {transmitting ? 'LIVE STREAM' : 'RECEIVED ON MARS'}
              </div>
              {transmitting && currentBit !== null && (
                <div
                  className="flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', letterSpacing: '0.15em' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: '#00d4ff' }} />
                  <span style={{ color: '#00d4ff' }}>BIT</span>
                  <span style={{ color: '#e8eaf0', fontWeight: 700 }}>{currentBit}</span>
                </div>
              )}
            </div>

            <div
              className="rounded-xl px-4 py-3 min-h-10"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#e8eaf0',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 13,
                letterSpacing: '0.01em',
                minHeight: 54,
              }}
            >
              {complete
                ? decoded.text || <span style={{ color: '#5a6070' }}>—</span>
                : (
                  <span style={{ color: '#8b92a9' }}>
                    Transmitting bit {resultBits.length} of {binaryBits.length}…
                  </span>
                )}
            </div>

            {complete && decoded.errors > 0 && (
              <p
                className="mt-3 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', letterSpacing: '0.12em', color: '#f59e0b' }}
              >
                <Clock size={11} />
                {errorCorrection
                  ? `CORRECTED ${decoded.corrected} BIT ERRORS VIA SURFACE CODE`
                  : `${decoded.errors} UNCORRECTED BIT ERRORS`}
              </p>
            )}
            {complete && decoded.errors === 0 && (
              <p
                className="mt-3"
                style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '11px', letterSpacing: '0.12em', color: '#10b981' }}
              >
                ● ZERO-ERROR TRANSMISSION
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <p
        className="text-center"
        style={{ fontFamily: 'var(--font-mono), monospace', fontSize: '10px', letterSpacing: '0.2em', color: '#5a6070' }}
      >
        SIMULATION · ANSIBLE FRAMEWORK · THEORETICAL
      </p>
    </div>
  );
}
