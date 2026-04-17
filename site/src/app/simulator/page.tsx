import QuantumSimulator from '@/components/simulator/QuantumSimulator';
import type { Metadata } from 'next';
import { FlaskConical, Satellite } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mars Quantum Simulator — Ansible',
  description:
    'Simulate superluminal quantum communication from Earth to Mars using the Ansible theoretical framework.',
};

export default function SimulatorPage() {
  return (
    <div className="pt-28 pb-24 min-h-screen grid-bg">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.25)',
              color: '#a78bfa',
              letterSpacing: '0.05em',
            }}
          >
            <FlaskConical size={12} />
            INTERACTIVE SIMULATION
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: '#e8eaf0', letterSpacing: '-0.03em' }}
          >
            Mars Quantum Simulator
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: '#8b92a9' }}>
            Transmit a message to Mars via the Ansible quantum channel. Adjust parameters,
            compare to classical radio delay, and observe error correction in action.
          </p>
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div
            className="glass rounded-xl p-4 flex items-start gap-3"
          >
            <Satellite size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#00d4ff' }} />
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8eaf0' }}>Orbital Relay Network</div>
              <div className="text-xs leading-relaxed" style={{ color: '#8b92a9' }}>
                6 geostationary satellites maintain entangled photon pairs in the vacuum of space
              </div>
            </div>
          </div>
          <div
            className="glass rounded-xl p-4 flex items-start gap-3"
          >
            <FlaskConical size={16} className="mt-0.5 flex-shrink-0" style={{ color: '#7c3aed' }} />
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: '#e8eaf0' }}>Theoretical Framework</div>
              <div className="text-xs leading-relaxed" style={{ color: '#8b92a9' }}>
                Modified non-local Hamiltonian enables controlled FTL correlational information transfer
              </div>
            </div>
          </div>
        </div>

        {/* Simulator */}
        <QuantumSimulator />
      </div>
    </div>
  );
}
