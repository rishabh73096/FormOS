'use client';

import {
  motion,
  AnimatePresence,
  type Variants,
  type MotionProps,
} from 'framer-motion';

/* ── Shared variants ──────────────────────────────────────────────────────── */

/** A window "opening" — appears from slightly above with a faint scale */
export const windowVariants: Variants = {
  hidden:  { opacity: 0, y: -8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.22, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 6, scale: 0.97,
    transition: { duration: 0.15, ease: 'easeIn' } },
};

/** Slide in from left (sidebar items, toolbox buttons) */
export const slideLeftVariants: Variants = {
  hidden:  { opacity: 0, x: -12 },
  visible: (i: number = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.2, delay: i * 0.04, ease: 'easeOut' },
  }),
};

/** Slide in from right (properties panel) */
export const slideRightVariants: Variants = {
  hidden:  { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0,
    transition: { duration: 0.2, ease: 'easeOut' } },
};

/** Stagger container — wraps list items */
export const staggerContainer: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

/** Row fade-slide (table rows, form cards) */
export const rowVariants: Variants = {
  hidden:  { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -4,
    transition: { duration: 0.12 } },
};

/** Progress bar fill */
export const progressVariants: Variants = {
  hidden:  { scaleX: 0, originX: 0 },
  visible: (pct: number) => ({
    scaleX: pct / 100,
    originX: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 },
  }),
};

/** Stat number count-up spring */
export const statVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.1 } },
};

/* ── Reusable wrappers ────────────────────────────────────────────────────── */

interface WinProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

/** Drop-in for any win-window — adds open/close animation */
export function WinWindow({ children, className, style, delay = 0, ...rest }: WinProps) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={windowVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      custom={delay}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Stagger list container */
export function StaggerList({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

/** Single row inside a StaggerList */
export function AnimRow({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={rowVariants}
    >
      {children}
    </motion.div>
  );
}

/** Page-level fade — wraps entire page content */
export function PageFade({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

/** Floating badge pop */
export function PopIn({ children, delay = 0, className, style }: WinProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 22, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Hover-lift for interactive cards */
export function HoverCard({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div
      className={className}
      style={style}
      whileHover={{ y: -2, transition: { duration: 0.12 } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
    >
      {children}
    </motion.div>
  );
}

/** Animated button press */
export function MotionBtn({
  children,
  onClick,
  className,
  style,
  disabled,
  type = 'button',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      style={style}
      disabled={disabled}
      whileTap={disabled ? {} : { scale: 0.95, transition: { duration: 0.07 } }}
      whileHover={disabled ? {} : { brightness: 1.05 } as never}
    >
      {children}
    </motion.button>
  );
}

export { motion, AnimatePresence };
