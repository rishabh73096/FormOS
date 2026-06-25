'use client';

import { useState } from 'react';
import { PLANS } from '@/lib/plans';
import { motion } from '@/lib/motion';

interface Props {
  trigger?: React.ReactNode;
  open?: boolean;
  onClose?: () => void;
}

export function UpgradeDialog({ trigger, open: controlledOpen, onClose }: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const close = () => { setInternalOpen(false); onClose?.(); };

  return (
    <>
      {trigger && (
        <span onClick={() => setInternalOpen(true)} style={{ cursor: 'pointer' }}>
          {trigger}
        </span>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            className="win-window"
            style={{ width: 460, maxWidth: '95vw' }}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {/* Title bar */}
            <div
              className="win-titlebar"
              style={{ background: 'linear-gradient(90deg, #4a0080 0%, #8b5cf6 100%)' }}
            >
              <span className="win-titlebar-title">★ Upgrade to Pro</span>
              <div className="win-titlebar-controls">
                <div className="win-ctrl" onClick={close}>✕</div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Plan comparison */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Free */}
                <div className="win-raised p-3">
                  <div
                    className="win-titlebar mb-2"
                    style={{ background: '#808080', minHeight: 18 }}
                  >
                    <span className="win-titlebar-title text-xs">○ Free — ₹0/mo</span>
                  </div>
                  <ul className="space-y-1">
                    {PLANS.free.featureList.map((f) => (
                      <li key={f} className="text-xs flex gap-1.5" style={{ color: 'var(--muted-foreground)' }}>
                        <span>○</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pro */}
                <div
                  className="win-raised p-3"
                  style={{
                    outline: '2px solid #fbbf24',
                    outlineOffset: 1,
                  }}
                >
                  <div
                    className="win-titlebar mb-2"
                    style={{ background: 'linear-gradient(90deg, #4a0080 0%, #8b5cf6 100%)', minHeight: 18 }}
                  >
                    <span className="win-titlebar-title text-xs">★ Pro — ₹999/mo</span>
                  </div>
                  <ul className="space-y-1">
                    {PLANS.pro.featureList.map((f) => (
                      <li key={f} className="text-xs flex gap-1.5" style={{ color: 'var(--foreground)', fontWeight: 'bold' }}>
                        <span style={{ color: '#fbbf24' }}>★</span> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="win-separator mb-3" />

              <div
                className="win-sunken p-2 mb-3 text-xs font-mono text-center"
                style={{ color: 'var(--muted-foreground)' }}
              >
                💳 ₹999/month · Cancel anytime · Instant activation
              </div>

              <div className="flex gap-2 justify-end">
                <button onClick={close} className="win-btn text-xs px-4 py-1.5">
                  ✕ Cancel
                </button>
                <a
                  href="mailto:2digitinnovations@gmail.com?subject=FormOS Pro Upgrade"
                  className="win-btn-primary text-xs px-6 py-1.5"
                  style={{
                    background: 'linear-gradient(90deg, #4a0080 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  ★ Upgrade to Pro →
                </a>
              </div>
            </div>

            <div className="win-statusbar text-xs">
              <span className="win-status-panel" style={{ color: '#8b5cf6', fontWeight: 'bold' }}>
                ★ Pro unlocks all features
              </span>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}

/** Compact upgrade banner for use inside pages */
export function UpgradeBanner({
  current,
  limit,
  resource,
}: {
  current: number;
  limit: number;
  resource: string;
}) {
  const [showDialog, setShowDialog] = useState(false);
  const pct = Math.min(Math.round((current / limit) * 100), 100);
  const critical = pct >= 80;

  return (
    <>
      <div
        className="win-raised p-3 flex items-center gap-3"
        style={{
          borderLeft: `3px solid ${critical ? '#cc0000' : '#fbbf24'}`,
        }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold" style={{ color: critical ? '#cc0000' : 'var(--foreground)' }}>
            {critical ? '⚠' : '★'} {resource}: {current}/{limit} used ({pct}%)
          </p>
          <div className="win-progress-track mt-1">
            <div
              className="win-progress-bar"
              style={{
                width: `${pct}%`,
                background: critical ? '#cc0000' : undefined,
                transition: 'width 0.3s',
              }}
            />
          </div>
        </div>
        <button
          onClick={() => setShowDialog(true)}
          className="win-btn-primary text-xs px-3 py-1 shrink-0"
          style={{
            background: 'linear-gradient(90deg, #4a0080 0%, #8b5cf6 100%)',
            color: '#fff',
          }}
        >
          ★ Upgrade
        </button>
      </div>
      <UpgradeDialog open={showDialog} onClose={() => setShowDialog(false)} />
    </>
  );
}
