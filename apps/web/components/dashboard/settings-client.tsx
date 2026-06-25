'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { ThemeToggle } from '@/components/theme-toggle';
import { Loader2 } from 'lucide-react';
import { UpgradeDialog } from '@/components/dashboard/upgrade-dialog';
import { PLANS } from '@/lib/plans';
import type { Plan } from '@/lib/plans';
import { motion } from '@/lib/motion';

interface Props {
  user: { id: string; name: string; email: string; image: string | null };
  userPlan: Plan;
}

function StatusBar({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold"
      style={{
        background: ok ? '#d4edda' : '#f8d7da',
        color: ok ? '#008000' : '#cc0000',
        border: `1px solid ${ok ? '#c3e6cb' : '#f5c6cb'}`,
      }}
    >
      {ok ? '✓' : '⚠'} {msg}
    </div>
  );
}

const sectionAnim = (delay: number) => ({
  initial: { opacity: 0, y: -8, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: { duration: 0.22, delay, ease: 'easeOut' as const },
});

export function SettingsClient({ user, userPlan }: Props) {
  const router = useRouter();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const initials = user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const plan = PLANS[userPlan];

  /* Profile state */
  const [name, setName]                   = useState(user.name);
  const [profileMsg, setProfileMsg]       = useState<{ text: string; ok: boolean } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  /* Password state */
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg]         = useState<{ text: string; ok: boolean } | null>(null);
  const [savingPw, setSavingPw]   = useState(false);

  /* Delete state */
  const [deleteConfirm, setDeleteConfirm]   = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  const inputStyle: React.CSSProperties = {
    background: 'var(--input)',
    color: 'var(--foreground)',
    fontFamily: 'var(--font-mono), monospace',
    fontSize: 12,
    outline: 'none',
    width: '100%',
    padding: '4px 8px',
    display: 'block',
    boxSizing: 'border-box',
  };

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSavingProfile(true);
    setProfileMsg(null);
    const res = await authClient.updateUser({ name: name.trim() });
    if (res.error) {
      setProfileMsg({ text: res.error.message ?? 'Update failed', ok: false });
    } else {
      setProfileMsg({ text: 'Profile updated successfully!', ok: true });
      router.refresh();
    }
    setSavingProfile(false);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (newPw !== confirmPw) { setPwMsg({ text: 'New passwords do not match', ok: false }); return; }
    if (newPw.length < 8)   { setPwMsg({ text: 'Password must be at least 8 characters', ok: false }); return; }
    setSavingPw(true);
    const res = await authClient.changePassword({
      currentPassword: currentPw,
      newPassword: newPw,
      revokeOtherSessions: true,
    });
    if (res.error) {
      setPwMsg({ text: res.error.message ?? 'Password change failed', ok: false });
    } else {
      setPwMsg({ text: 'Password changed successfully!', ok: true });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
    }
    setSavingPw(false);
  }

  async function signOutAllDevices() {
    await authClient.revokeSessions();
    router.push('/login');
  }

  async function deleteAccount() {
    if (deleteConfirm !== user.email) return;
    setDeletingAccount(true);
    await authClient.deleteUser();
    router.push('/');
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >

      {/* ── Header ── */}
      <motion.div className="win-window" {...sectionAnim(0)}>
        <div className="win-titlebar">
          <span className="win-titlebar-title">⚙ Settings</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>
        <div className="win-menubar">
          <span>File</span><span>View</span><span>Help</span>
        </div>
        <div className="p-3 flex items-center gap-4">
          <div
            className="win-raised flex items-center justify-center font-bold shrink-0"
            style={{ width: 48, height: 48, background: 'var(--primary)', color: 'var(--primary-foreground)', fontSize: 18 }}
          >
            {initials}
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{user.name}</p>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{user.email}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              User ID: <span style={{ fontFamily: 'var(--font-mono)' }}>{user.id.slice(0, 16)}…</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Profile ── */}
      <motion.div className="win-window" {...sectionAnim(0.07)}>
        <div className="win-titlebar">
          <span className="win-titlebar-title">👤 Profile Settings</span>
        </div>
        <form onSubmit={saveProfile} className="p-4 space-y-3">
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: 'var(--foreground)' }}>Display Name</p>
            <div className="win-sunken">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required style={inputStyle} />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold mb-1" style={{ color: 'var(--foreground)' }}>
              Email Address
              <span className="ml-2 font-normal" style={{ color: 'var(--muted-foreground)' }}>(read-only)</span>
            </p>
            <div className="win-sunken">
              <input value={user.email} disabled style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed' }} />
            </div>
          </div>
          {profileMsg && <StatusBar msg={profileMsg.text} ok={profileMsg.ok} />}
          <div className="flex justify-end">
            <button type="submit" disabled={savingProfile || name.trim() === user.name} className="win-btn-primary text-xs px-6 py-1.5 flex items-center gap-2">
              {savingProfile ? (<><Loader2 style={{ width: 11, height: 11 }} className="animate-spin" /> Saving…</>) : '► Save Profile'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── Password ── */}
      <motion.div className="win-window" {...sectionAnim(0.14)}>
        <div className="win-titlebar">
          <span className="win-titlebar-title">🔐 Change Password</span>
        </div>
        <form onSubmit={changePassword} className="p-4 space-y-3">
          {[
            { label: 'Current Password', val: currentPw, set: setCurrentPw },
            { label: 'New Password',     val: newPw,     set: setNewPw },
            { label: 'Confirm Password', val: confirmPw, set: setConfirmPw },
          ].map(({ label, val, set }) => (
            <div key={label}>
              <p className="text-xs font-bold mb-1" style={{ color: 'var(--foreground)' }}>{label}</p>
              <div className="win-sunken">
                <input type="password" value={val} onChange={(e) => set(e.target.value)} placeholder="••••••••" required style={inputStyle} />
              </div>
            </div>
          ))}
          {pwMsg && <StatusBar msg={pwMsg.text} ok={pwMsg.ok} />}
          <div className="flex justify-end">
            <button type="submit" disabled={savingPw} className="win-btn-primary text-xs px-6 py-1.5 flex items-center gap-2">
              {savingPw ? (<><Loader2 style={{ width: 11, height: 11 }} className="animate-spin" /> Saving…</>) : '► Change Password'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── Plan ── */}
      <motion.div className="win-window" {...sectionAnim(0.21)}>
        <div
          className="win-titlebar"
          style={userPlan === 'pro' ? { background: 'linear-gradient(90deg, #4a0080 0%, #8b5cf6 100%)' } : undefined}
        >
          <span className="win-titlebar-title">{userPlan === 'pro' ? '★ Pro Plan' : '○ Free Plan'}</span>
        </div>
        <div className="p-4">
          <div className="flex items-start gap-4 mb-3">
            <div
              className="win-raised px-3 py-2 text-sm font-bold shrink-0"
              style={userPlan === 'pro'
                ? { background: 'linear-gradient(90deg, #4a0080, #8b5cf6)', color: '#fff' }
                : { background: '#808080', color: '#fff' }}
            >
              {plan.badge}
            </div>
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>
                {userPlan === 'pro' ? 'You are on the Pro plan' : 'You are on the Free plan'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                {userPlan === 'pro'
                  ? 'Unlimited forms, all field types, no branding.'
                  : `${PLANS.free.maxForms} forms · ${PLANS.free.maxResponsesPerForm} responses/form`}
              </p>
            </div>
          </div>
          <div className="win-sunken p-2 mb-3">
            <div className="grid text-xs" style={{ gridTemplateColumns: '1fr 1fr' }}>
              {plan.featureList.map((f) => (
                <div key={f} className="flex items-center gap-1.5 py-0.5 px-1">
                  <span style={{ color: userPlan === 'pro' ? '#8b5cf6' : '#808080' }}>{userPlan === 'pro' ? '★' : '○'}</span>
                  <span style={{ color: 'var(--foreground)' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          {userPlan === 'free' && (
            <button
              onClick={() => setShowUpgrade(true)}
              className="win-btn-primary text-xs px-6 py-2 w-full"
              style={{ background: 'linear-gradient(90deg, #4a0080 0%, #8b5cf6 100%)', color: '#fff' }}
            >
              ★ Upgrade to Pro — ₹999/month
            </button>
          )}
        </div>
        <div className="win-statusbar text-xs">
          <span className="win-status-panel">
            {userPlan === 'pro' ? '★ Pro — All features unlocked' : '○ Free — Upgrade for more'}
          </span>
        </div>
      </motion.div>

      <UpgradeDialog open={showUpgrade} onClose={() => setShowUpgrade(false)} />

      {/* ── Appearance ── */}
      <motion.div className="win-window" {...sectionAnim(0.28)}>
        <div className="win-titlebar">
          <span className="win-titlebar-title">🎨 Appearance</span>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>Interface Theme</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
                Switch between Windows 95 (light) and CRT Terminal (dark)
              </p>
            </div>
            <ThemeToggle />
          </div>
          <div className="win-separator mt-3 mb-3" />
          <div className="win-sunken p-3 text-xs font-mono" style={{ color: 'var(--muted-foreground)' }}>
            <p>Light mode: Windows 95 — Classic grey desktop, raised bevels</p>
            <p>Dark mode: CRT Terminal — Dark navy with scanline overlay</p>
          </div>
        </div>
      </motion.div>

      {/* ── Session ── */}
      <motion.div className="win-window" {...sectionAnim(0.35)}>
        <div className="win-titlebar">
          <span className="win-titlebar-title">🔑 Session Management</span>
        </div>
        <div className="p-4 space-y-3">
          <div className="win-raised p-3 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>Sign out all devices</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Revokes all active sessions except your current one.</p>
            </div>
            <button onClick={signOutAllDevices} className="win-btn text-xs px-4 py-1.5 shrink-0">
              ✕ Sign Out All
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Danger Zone ── */}
      <motion.div className="win-window" {...sectionAnim(0.42)}>
        <div className="win-titlebar" style={{ background: 'linear-gradient(90deg, #8b0000 0%, #cc0000 100%)' }}>
          <span className="win-titlebar-title">⚠ Danger Zone</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div
            className="p-3"
            style={{
              background: '#fff3f3',
              border: '2px solid #cc0000',
              boxShadow: 'inset 1px 1px 0 #ff6666, inset -1px -1px 0 #880000',
            }}
          >
            <p className="text-xs font-bold mb-1" style={{ color: '#cc0000' }}>⚠ Delete Account</p>
            <p className="text-xs mb-3" style={{ color: '#800000' }}>
              Permanently deletes your account, ALL forms and responses. Cannot be undone.
            </p>
            <p className="text-xs font-bold mb-1" style={{ color: '#800000' }}>
              Type your email to confirm: <span style={{ fontFamily: 'var(--font-mono)' }}>{user.email}</span>
            </p>
            <div className="win-sunken mb-3">
              <input
                type="email"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder={user.email}
                style={{ background: '#fff0f0', color: '#cc0000', fontFamily: 'var(--font-mono)', fontSize: 12, outline: 'none', width: '100%', padding: '4px 8px', display: 'block', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={deleteAccount}
              disabled={deleteConfirm !== user.email || deletingAccount}
              className="win-btn text-xs px-4 py-1.5 flex items-center gap-2"
              style={{
                background: deleteConfirm === user.email ? '#cc0000' : 'var(--muted)',
                color: deleteConfirm === user.email ? '#ffffff' : 'var(--muted-foreground)',
              }}
            >
              {deletingAccount ? (<><Loader2 style={{ width: 11, height: 11 }} className="animate-spin" /> Deleting…</>) : '🗑 Delete My Account'}
            </button>
          </div>
        </div>
        <div className="win-statusbar text-xs">
          <span className="win-status-panel" style={{ color: '#cc0000' }}>⚠ Irreversible actions below</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
