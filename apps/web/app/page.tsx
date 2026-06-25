'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  Zap, MousePointer2, GitBranch, BarChart2, Sparkles,
  Palette, Globe, Shield, CheckCircle2, Star,
} from 'lucide-react';

/* ─── Win95 Window Chrome ─────────────────────────────────────────────────── */
function WinWindow({
  title,
  icon,
  children,
  className = '',
  controls = true,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  className?: string;
  controls?: boolean;
}) {
  return (
    <div className={`win-window ${className}`}>
      <div className="win-titlebar">
        <span className="win-titlebar-title">
          {icon && <span>{icon}</span>}
          {title}
        </span>
        {controls && (
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl font-bold">✕</div>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}

/* ─── Taskbar / Navbar ────────────────────────────────────────────────────── */
function Navbar() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 win-taskbar" style={{ borderBottom: '2px solid #404040' }}>
      <div className="flex h-10 items-center justify-between px-2">
        {/* Start button */}
        <div className="flex items-center gap-2">
          <Link href="/" className="win-btn flex items-center gap-1.5 px-3 py-1 text-xs font-bold">
            <Zap className="h-3.5 w-3.5" style={{ color: 'var(--primary)' }} />
            <span>Start</span>
          </Link>

          <div className="win-separator mx-1" style={{ width: 2, height: 28, margin: '0 4px' }} />

          {/* Running apps */}
          <div className="hidden sm:flex gap-1">
            {['FormOS v1.0', 'Dashboard'].map((app) => (
              <div
                key={app}
                className="win-btn-sm px-3 py-1 text-xs hidden md:flex items-center gap-1.5"
                style={{ minWidth: 80 }}
              >
                <Zap className="h-3 w-3 shrink-0" style={{ color: 'var(--primary)' }} />
                {app}
              </div>
            ))}
          </div>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          {['Features', 'Pricing', 'Docs'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="px-3 py-1 text-xs font-bold hover:underline"
              style={{ color: 'var(--foreground)' }}
            >
              {item}
            </a>
          ))}
        </div>

        {/* System tray */}
        <div
          className="flex items-center gap-1.5"
          style={{
            boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #ffffff',
            padding: '2px 6px',
          }}
        >
          <Link href="/login" className="win-btn text-xs px-2 py-0.5">
            Sign in
          </Link>
          <Link href="/register" className="win-btn-primary text-xs px-3 py-0.5">
            Register
          </Link>
          <ThemeToggle />
          <div
            className="text-xs font-mono font-bold tabular-nums pl-2"
            style={{ color: 'var(--muted-foreground)', borderLeft: '1px solid #808080' }}
          >
            {time || '12:00'}
          </div>
        </div>
      </div>
    </header>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); return 100; }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="pt-16 pb-12 px-4">
      <div className="mx-auto max-w-5xl py-8">

        {/* Main hero window */}
        <WinWindow title="FormOS — Welcome" icon="📋" className="animate-scan-in">
          <div className="win-menubar">
            {['File', 'Edit', 'View', 'Help'].map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>

          <div className="p-6 md:p-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: text */}
              <div>
                <div
                  className="win-tag inline-block mb-4"
                >
                  ► Public Beta — Free to use
                </div>

                <h1
                  className="text-2xl md:text-4xl font-bold leading-tight mb-4"
                  style={{ color: 'var(--foreground)', fontFamily: 'var(--font-sans)' }}
                >
                  The form builder<br />
                  <span style={{ color: 'var(--primary)' }}>your team will actually use.</span>
                </h1>

                <p
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Build beautiful forms with drag-and-drop, 18+ field types,
                  conditional logic, and real-time analytics. No code needed.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Link href="/register" className="win-btn-primary text-sm px-6 py-2">
                    ► Install FormOS
                  </Link>
                  <Link href="/login" className="win-btn text-sm px-4 py-2">
                    Sign in
                  </Link>
                  <button className="win-btn text-sm px-4 py-2">
                    View Demo
                  </button>
                </div>

                {/* Progress bar */}
                <div>
                  <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
                    Loading form engine... {progress}%
                  </p>
                  <div className="win-progress-track">
                    <div className="win-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Right: fake form preview window */}
              <div className="animate-scan-in delay-200">
                <WinWindow title="Customer Feedback — form.exe" icon="📝" className="text-xs">
                  <div className="p-4 space-y-3" style={{ background: 'var(--input)' }}>
                    <div>
                      <label className="block font-bold mb-1" style={{ color: 'var(--foreground)', fontSize: 11 }}>Full Name:</label>
                      <div className="win-sunken px-2 py-1 text-xs" style={{ background: 'var(--input)' }}>
                        Jane Smith<span className="cursor-blink">|</span>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-1" style={{ color: 'var(--foreground)', fontSize: 11 }}>Email Address:</label>
                      <div className="win-sunken px-2 py-1 text-xs" style={{ background: 'var(--input)' }}>
                        jane@company.com
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold mb-1" style={{ color: 'var(--foreground)', fontSize: 11 }}>Rating:</label>
                      <div className="flex gap-1 mt-1">
                        {[1,2,3,4,5].map((i) => (
                          <Star key={i} className={`h-4 w-4 ${i <= 4 ? 'fill-amber-400 text-amber-400' : ''}`}
                            style={i > 4 ? { color: 'var(--muted)' } : undefined} />
                        ))}
                      </div>
                    </div>
                    <div className="win-separator" />
                    <div className="flex gap-2 justify-end">
                      <button className="win-btn text-xs px-4 py-1">Cancel</button>
                      <button className="win-btn text-xs px-4 py-1" style={{ background: 'var(--primary)', color: '#fff' }}>OK</button>
                    </div>
                  </div>
                  {/* Status bar */}
                  <div className="win-statusbar text-xs">
                    <span className="win-status-panel">3 fields</span>
                    <span className="win-status-panel">Ready</span>
                  </div>
                </WinWindow>
              </div>
            </div>
          </div>
        </WinWindow>

        {/* Ticker */}
        <div
          className="win-statusbar mt-2 text-xs justify-between"
          style={{ borderTop: 'none', borderBottom: '1px solid var(--border)' }}
        >
          {['✓ No credit card required', '✓ Free forever plan', '✓ 18+ field types', '✓ Real-time analytics'].map((item) => (
            <span key={item} className="win-status-panel">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features ───────────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: MousePointer2, title: 'Drag & Drop Builder', desc: 'Visually build forms by adding, reordering, and configuring fields on a live canvas.', key: 'DRAG' },
  { icon: GitBranch, title: 'Conditional Logic', desc: 'Show or hide fields based on previous answers. Build intelligent adaptive forms.', key: 'LOGIC' },
  { icon: BarChart2, title: 'Real-time Analytics', desc: 'Track views, submissions, and conversion rates. Find drop-off points instantly.', key: 'STATS' },
  { icon: Sparkles, title: 'AI Form Generator', desc: 'Describe your need and AI creates the full field structure in seconds.', key: 'AI' },
  { icon: Palette, title: 'Custom Themes', desc: 'Match your brand with custom colors, fonts, and button styles. White-label ready.', key: 'THEME' },
  { icon: Globe, title: 'Instant Sharing', desc: 'Publish with one click. Share via link, embed on any site, or QR code.', key: 'SHARE' },
  { icon: Shield, title: 'Access Controls', desc: 'Password-protect forms, set submission limits, and expiry dates with ease.', key: 'SEC' },
  { icon: CheckCircle2, title: '18+ Field Types', desc: 'Text, email, dropdown, file upload, date picker, star rating, slider, and more.', key: 'FIELDS' },
];

function Features() {
  return (
    <section id="features" className="py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <WinWindow title="Program Manager — FormOS Features" icon="🗂️" className="animate-scan-in">
          <div className="win-menubar">
            {['File', 'Window', 'Help'].map((m) => <span key={m}>{m}</span>)}
          </div>

          <div className="p-4">
            <div className="mb-3">
              <p className="text-xs font-bold" style={{ color: 'var(--muted-foreground)' }}>
                FEATURES — Double-click to explore
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FEATURES.map(({ icon: Icon, title, desc, key }) => (
                <div
                  key={key}
                  className="win-raised group cursor-pointer p-3 flex flex-col items-center text-center gap-2 hover:bg-accent hover:**:text-accent-foreground"
                >
                  <div
                    className="win-sunken w-12 h-12 flex items-center justify-center"
                    style={{ background: 'var(--input)' }}
                  >
                    <Icon className="h-5 w-5" style={{ color: 'var(--primary)' }} />
                  </div>
                  <span className="text-xs font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
                    {title}
                  </span>
                  <span className="text-xs leading-tight" style={{ color: 'var(--muted-foreground)' }}>
                    {desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="win-statusbar text-xs">
            <span className="win-status-panel">8 objects</span>
            <span className="win-status-panel">FormOS Pro v1.0</span>
          </div>
        </WinWindow>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────────────────────── */
const STEPS = [
  { num: '01', title: 'Create your form', desc: 'Start from scratch or let AI generate a form from a prompt. Add and configure fields in the drag-and-drop builder.', icon: '📋' },
  { num: '02', title: 'Publish & share', desc: 'Publish with one click. Share via public link, embed on your site, or generate a QR code for offline use.', icon: '🌐' },
  { num: '03', title: 'Collect & analyze', desc: 'Responses arrive in real time. View individual submissions or analyze trends with built-in charts.', icon: '📊' },
];

function HowItWorks() {
  return (
    <section className="py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <WinWindow title="FormOS Setup Wizard" icon="🧙" className="animate-scan-in delay-100">
          <div className="p-6">
            <p className="text-xs mb-4" style={{ color: 'var(--muted-foreground)' }}>
              This wizard will guide you through getting started with FormOS.
              Follow these steps to begin collecting responses.
            </p>

            <div className="grid sm:grid-cols-3 gap-4">
              {STEPS.map(({ num, title, desc, icon }) => (
                <div key={num} className="win-raised p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="win-sunken w-8 h-8 flex items-center justify-center text-sm"
                      style={{ background: 'var(--primary)', color: '#fff', fontWeight: 'bold' }}
                    >
                      {num}
                    </div>
                    <span className="text-base">{icon}</span>
                  </div>
                  <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--foreground)' }}>{title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{desc}</p>
                </div>
              ))}
            </div>

            <div className="win-separator mt-6" />
            <div className="flex justify-between items-center mt-3">
              <button className="win-btn text-xs px-4 py-1">◄ Back</button>
              <div className="flex gap-2">
                <button className="win-btn text-xs px-4 py-1">Cancel</button>
                <Link href="/register" className="win-btn-primary text-xs px-6 py-1">
                  Next ►
                </Link>
              </div>
            </div>
          </div>
        </WinWindow>
      </div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  { quote: 'We replaced three tools with FormOS. Our lead capture rate went up 40% in the first month.', author: 'Sarah Chen', role: 'Head of Marketing, Acme Corp', rating: 5 },
  { quote: 'Setup took 15 minutes. The analytics dashboard shows us exactly where people drop off.', author: 'Marcus Reid', role: 'Product Manager, Horizon Inc', rating: 5 },
  { quote: 'The AI form generation is unreal. I described our NPS survey and it built the whole thing.', author: 'Priya Nair', role: 'Customer Success, Orbit Studio', rating: 5 },
];

function Testimonials() {
  return (
    <section className="py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <WinWindow title="User Reviews — FormOS.exe" icon="💬" className="animate-scan-in delay-200">
          <div className="p-4">
            <div className="grid sm:grid-cols-3 gap-3">
              {TESTIMONIALS.map(({ quote, author, role, rating }) => (
                <div key={author} className="win-raised p-4">
                  {/* Message box icon row */}
                  <div className="flex gap-1 mb-3">
                    {[...Array(rating)].map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <div className="win-sunken p-2 mb-3 text-xs leading-relaxed" style={{ background: 'var(--input)', color: 'var(--foreground)' }}>
                    &ldquo;{quote}&rdquo;
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="win-raised w-7 h-7 flex items-center justify-center text-xs font-bold"
                      style={{ background: 'var(--primary)', color: '#fff' }}
                    >
                      {author.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{author}</p>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </WinWindow>
      </div>
    </section>
  );
}

/* ─── Pricing ────────────────────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Starter',
    price: 'FREE',
    period: 'Forever',
    features: ['3 active forms', '100 responses/mo', 'Basic analytics', 'Public link sharing', 'Email support'],
    cta: 'Download Free',
    href: '/register',
    highlight: false,
    icon: '📁',
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    features: ['Unlimited forms', '10,000 responses/mo', 'Advanced analytics', 'Custom themes', 'Conditional logic', 'File uploads', 'QR codes', 'Priority support'],
    cta: 'Start Trial',
    href: '/register',
    highlight: true,
    icon: '⭐',
  },
  {
    name: 'Team',
    price: '$49',
    period: '/month',
    features: ['Everything in Pro', 'Unlimited responses', 'Team collaboration', 'AI generation', 'Webhooks', 'Custom domain', 'SLA support'],
    cta: 'Contact Sales',
    href: '/register',
    highlight: false,
    icon: '🏢',
  },
];

function Pricing() {
  return (
    <section id="pricing" className="py-10 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="grid sm:grid-cols-3 gap-3 animate-scan-in delay-300">
          {PLANS.map(({ name, price, period, features, cta, href, highlight, icon }) => (
            <WinWindow
              key={name}
              title={`${icon} ${name} Edition`}
              className={highlight ? 'ring-2 ring-primary' : ''}
            >
              <div className="p-4 flex flex-col h-full">
                {highlight && (
                  <div className="win-tag text-center mb-3 text-xs font-bold" style={{ borderColor: 'var(--primary)', background: 'var(--primary)', color: '#fff' }}>
                    ★ MOST POPULAR
                  </div>
                )}

                {/* Price */}
                <div className="win-sunken p-3 mb-4 text-center" style={{ background: 'var(--input)' }}>
                  <div className="text-2xl font-black" style={{ color: highlight ? 'var(--primary)' : 'var(--foreground)', fontFamily: 'var(--font-mono)' }}>
                    {price}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{period}</div>
                </div>

                {/* Features */}
                <ul className="space-y-1.5 mb-4 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs" style={{ color: 'var(--foreground)' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 'bold', flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="win-separator" />

                <Link
                  href={href}
                  className={`block text-center text-xs font-bold py-1.5 px-4 mt-3 ${
                    highlight ? 'win-btn-primary' : 'win-btn'
                  }`}
                >
                  {cta}
                </Link>
              </div>
            </WinWindow>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────────────── */
function Cta() {
  return (
    <section className="py-10 px-4">
      <div className="mx-auto max-w-2xl">
        <WinWindow title="⚠️ FormOS — Action Required" className="animate-scan-in">
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--foreground)' }}>
              Start collecting responses today
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Free to start, no credit card required.<br />
              Build your first form in under 2 minutes.
            </p>
            <div className="win-separator mb-6" />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register" className="win-btn-primary px-8 py-2 text-sm font-bold">
                ► Install Now — It&apos;s Free
              </Link>
              <button className="win-btn px-6 py-2 text-sm">
                View Demo
              </button>
              <button className="win-btn px-6 py-2 text-sm">
                Cancel
              </button>
            </div>
          </div>
        </WinWindow>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */
const FOOTER_LINKS = {
  Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
  Resources: ['Documentation', 'API Reference', 'Blog', 'Status'],
  Company: ['About', 'Careers', 'Privacy', 'Terms'],
};

function Footer() {
  return (
    <footer style={{ borderTop: '2px solid #ffffff' }}>
      <div className="win-window mx-0" style={{ boxShadow: 'none' }}>
        <div className="win-menubar justify-start py-2 px-4">
          <span className="font-bold">© 2026 FormOS, Inc.</span>
          <span style={{ color: 'var(--muted-foreground)' }}>Built for teams who ship fast.</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div
                className="win-raised w-8 h-8 flex items-center justify-center"
                style={{ background: 'var(--primary)' }}
              >
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>FormOS</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              The modern form builder for teams who care about conversion.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <p className="text-xs font-bold mb-3 uppercase" style={{ color: 'var(--foreground)' }}>{heading}</p>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs hover:underline" style={{ color: 'var(--muted-foreground)' }}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="win-statusbar text-xs justify-between">
          <span className="win-status-panel">FormOS v1.0.0</span>
          <span className="win-status-panel">Ready</span>
          <span className="win-status-panel">© 2026 FormOS Inc.</span>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="min-h-screen crt-overlay">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Cta />
      <Footer />
    </div>
  );
}
