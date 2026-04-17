'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Menu, X } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Overview' },
  { href: '/paper', label: 'Whitepaper' },
  { href: '/simulator', label: 'Simulator' },
  { href: '/cite', label: 'Cite' },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(5, 7, 15, 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.2), rgba(124,58,237,0.2))',
              border: '1px solid rgba(0,212,255,0.35)',
            }}
          >
            <Zap size={16} className="text-[#00d4ff]" />
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: '#e8eaf0' }}>
            Ansible
          </span>
          <span
            className="text-xs px-1.5 py-0.5 rounded"
            style={{
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.25)',
              color: '#00d4ff',
              fontSize: '10px',
              letterSpacing: '0.06em',
            }}
          >
            THEORY
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const active = pathname === href || (href === '/' && pathname === '/');
            return (
              <Link
                key={href + label}
                href={href}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  color: active ? '#00d4ff' : '#8b92a9',
                  background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(0,212,255,0.2)' : '1px solid transparent',
                }}
              >
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/paper" className="btn-primary px-4 py-2 rounded-lg text-sm font-medium">
            Read Paper
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: '#8b92a9' }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-2"
          style={{ background: 'rgba(5,7,15,0.97)', borderColor: 'rgba(0,212,255,0.1)' }}
        >
          {navLinks.map(({ href, label }) => (
            <Link
              key={href + label}
              href={href}
              className="py-2.5 px-4 rounded-lg text-sm font-medium"
              style={{
                color: pathname === href ? '#00d4ff' : '#8b92a9',
                background: pathname === href ? 'rgba(0,212,255,0.08)' : 'transparent',
              }}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </motion.nav>
  );
}
