'use client';

import { useState, useEffect } from 'react';
import type { FormField } from '@repo/types';
import { PublicField } from './public-field';
import { Loader2 } from 'lucide-react';
import { motion } from '@/lib/motion';

interface Props {
  form: {
    id: string;
    title: string;
    description: string | null;
    fields: unknown;
    settings: unknown;
    theme: unknown;
  };
}

type FormSettings = {
  submitButtonText: string;
  successMessage: string;
  showProgressBar: boolean;
};

export function PublicForm({ form }: Props) {
  const fields = (form.fields as FormField[]) ?? [];
  const settings = form.settings as FormSettings;

  const [values, setValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`/api/analytics/${form.id}`, { method: 'POST' });
  }, [form.id]);

  function setValue(fieldId: string, value: unknown) {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
    setErrors((prev) => ({ ...prev, [fieldId]: '' }));
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    for (const field of fields) {
      if (['heading', 'paragraph', 'divider'].includes(field.type)) continue;
      const val = values[field.id];
      if (field.required && (val === undefined || val === '' || (Array.isArray(val) && val.length === 0))) {
        newErrors[field.id] = 'This field is required';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const res = await fetch(`/api/responses/${form.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        values,
        metadata: { referrer: document.referrer, userAgent: navigator.userAgent },
      }),
    });
    if (res.ok) {
      setSubmitted(true);
    } else {
      const json = await res.json();
      alert(json.error ?? 'Submission failed. Please try again.');
    }
    setSubmitting(false);
  }

  const inputFields = fields.filter((f) => !['heading', 'paragraph', 'divider'].includes(f.type));
  const filledCount = inputFields.filter((f) => {
    const v = values[f.id];
    return v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
  }).length;
  const progress = inputFields.length > 0 ? Math.round((filledCount / inputFields.length) * 100) : 0;

  /* ── Success screen ── */
  if (submitted) {
    return (
      <motion.div
        className="win-window"
        initial={{ opacity: 0, scale: 0.96, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <div className="win-titlebar">
          <span className="win-titlebar-title">✓ {form.title} — Submitted</span>
          <div className="win-titlebar-controls">
            <div className="win-ctrl">_</div>
            <div className="win-ctrl">□</div>
            <div className="win-ctrl">✕</div>
          </div>
        </div>

        <div className="p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-lg font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Response Submitted!
          </h2>
          <div
            className="win-sunken p-3 text-sm mb-6"
            style={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}
          >
            {settings.successMessage || 'Thank you for your response!'}
          </div>
          <div className="win-separator mb-4" />
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="win-btn text-xs px-5 py-1.5"
            >
              ↺ Submit Another
            </button>
            <button
              onClick={() => window.close()}
              className="win-btn-primary text-xs px-5 py-1.5"
            >
              ✕ Close
            </button>
          </div>
        </div>

        <div className="win-statusbar text-xs">
          <span className="win-status-panel" style={{ color: '#008000' }}>✓ Submitted successfully</span>
        </div>
      </motion.div>
    );
  }

  /* ── Form ── */
  return (
    <div className="win-window">
      {/* Title bar */}
      <div className="win-titlebar">
        <span className="win-titlebar-title">
          📋 {form.title}
        </span>
        <div className="win-titlebar-controls">
          <div className="win-ctrl">_</div>
          <div className="win-ctrl">□</div>
          <div className="win-ctrl">✕</div>
        </div>
      </div>

      {/* Menu bar */}
      <div className="win-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>Help</span>
      </div>

      {/* Description */}
      {form.description && (
        <div
          className="px-4 py-2 text-xs"
          style={{
            borderBottom: '1px solid var(--border)',
            color: 'var(--muted-foreground)',
            backgroundColor: 'var(--muted)',
          }}
        >
          {form.description}
        </div>
      )}

      {/* Progress bar */}
      {settings.showProgressBar && inputFields.length > 0 && (
        <div className="px-4 py-2" style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--card)' }}>
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
            <span>{filledCount} of {inputFields.length} answered</span>
            <span className="font-bold font-mono" style={{ color: 'var(--primary)' }}>{progress}%</span>
          </div>
          <div className="win-progress-track">
            <div
              className="win-progress-bar"
              style={{ width: `${progress}%`, transition: 'width 0.3s ease' }}
            />
          </div>
        </div>
      )}

      {/* Fields */}
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          {fields.map((field, i) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.18, delay: Math.min(i * 0.05, 0.4), ease: 'easeOut' }}
            >
              <PublicField
                field={field}
                value={values[field.id]}
                error={errors[field.id]}
                onChange={(v) => setValue(field.id, v)}
                allValues={values}
              />
            </motion.div>
          ))}
        </div>

        <div className="win-separator mx-4" />

        {/* Submit */}
        <div className="p-4 flex items-center justify-between">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            {Object.keys(errors).length > 0 && (
              <span style={{ color: '#cc0000' }}>⚠ {Object.keys(errors).length} required field(s) missing</span>
            )}
          </p>
          <button
            type="submit"
            disabled={submitting}
            className="win-btn-primary text-sm px-8 py-2 flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 style={{ width: 12, height: 12 }} className="animate-spin" />
                Submitting…
              </>
            ) : (
              `► ${settings.submitButtonText || 'Submit'}`
            )}
          </button>
        </div>
      </form>

      {/* Status bar */}
      <div className="win-statusbar text-xs justify-between">
        <span className="win-status-panel">{inputFields.length} field(s)</span>
        <span className="win-status-panel">
          {filledCount}/{inputFields.length} answered
        </span>
        <span className="win-status-panel">● Ready</span>
      </div>
    </div>
  );
}
