'use client';

import type { FormField, ConditionalLogic } from '@repo/types';
import { Star } from 'lucide-react';
import { useState } from 'react';

interface Props {
  field: FormField;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  allValues: Record<string, unknown>;
}

function evaluateConditionalLogic(
  logic: ConditionalLogic | undefined,
  allValues: Record<string, unknown>,
): boolean {
  if (!logic) return true;
  const results = logic.rules.map((rule: { fieldId: string; operator: string; value: string }) => {
    const val = String(allValues[rule.fieldId] ?? '');
    switch (rule.operator) {
      case 'equals':      return val === rule.value;
      case 'not_equals':  return val !== rule.value;
      case 'contains':    return val.includes(rule.value);
      case 'not_contains':return !val.includes(rule.value);
      case 'is_empty':    return val === '';
      case 'is_not_empty':return val !== '';
      default:            return true;
    }
  });
  const matches = logic.match === 'all' ? results.every(Boolean) : results.some(Boolean);
  return logic.action === 'show' ? matches : !matches;
}

/* ── Shared input style ──────────────────────────────────────────────────── */
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

export function PublicField({ field, value, error, onChange, allValues }: Props) {
  const [hoverRating, setHoverRating] = useState(0);

  const visible = evaluateConditionalLogic(field.conditionalLogic, allValues);
  if (!visible) return null;

  /* Label */
  const labelEl = !['heading', 'paragraph', 'divider'].includes(field.type) && (
    <p
      className="text-xs font-bold mb-1"
      style={{ color: error ? '#cc0000' : 'var(--foreground)' }}
    >
      {field.label}
      {field.required && <span style={{ color: '#cc0000', marginLeft: 3 }}>*</span>}
    </p>
  );

  /* Help text */
  const helpEl = field.helpText && (
    <p className="text-xs mb-1" style={{ color: 'var(--muted-foreground)' }}>
      {field.helpText}
    </p>
  );

  /* Error */
  const errorEl = error && (
    <p
      className="text-xs mt-1 flex items-center gap-1 font-bold"
      style={{ color: '#cc0000' }}
    >
      ⚠ {error}
    </p>
  );

  function wrap(content: React.ReactNode) {
    return (
      <div>
        {labelEl}
        {helpEl}
        <div
          className="win-sunken"
          style={error ? { outline: '1px solid #cc0000' } : undefined}
        >
          {content}
        </div>
        {errorEl}
      </div>
    );
  }

  switch (field.type) {
    /* ── Text inputs ── */
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
      return wrap(
        <input
          type={
            field.type === 'email' ? 'email'
            : field.type === 'phone' ? 'tel'
            : field.type === 'url' ? 'url'
            : 'text'
          }
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />,
      );

    case 'number':
      return wrap(
        <input
          type="number"
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          min={field.validation?.min}
          max={field.validation?.max}
          style={inputStyle}
        />,
      );

    case 'textarea':
      return wrap(
        <textarea
          placeholder={field.placeholder}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical' }}
        />,
      );

    /* ── Date/Time ── */
    case 'date':
    case 'time':
    case 'datetime':
      return wrap(
        <input
          type={field.type === 'datetime' ? 'datetime-local' : field.type}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />,
      );

    /* ── Radio ── */
    case 'radio':
      return (
        <div>
          {labelEl}
          {helpEl}
          <div
            className="win-sunken p-2 space-y-1"
            style={error ? { outline: '1px solid #cc0000' } : undefined}
          >
            {(field.options ?? []).map((opt: { id: string; label: string; value: string }) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 cursor-pointer px-1 py-0.5"
                style={{
                  background: (value as string) === opt.value ? 'var(--primary)' : 'transparent',
                  color: (value as string) === opt.value ? 'var(--primary-foreground)' : 'var(--foreground)',
                }}
              >
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={(value as string) === opt.value}
                  onChange={() => onChange(opt.value)}
                  style={{ accentColor: 'var(--primary)', width: 12, height: 12, flexShrink: 0 }}
                />
                <span className="text-xs font-bold">{opt.label}</span>
              </label>
            ))}
          </div>
          {errorEl}
        </div>
      );

    /* ── Checkbox ── */
    case 'checkbox':
      return (
        <div>
          {labelEl}
          {helpEl}
          <div
            className="win-sunken p-2 space-y-1"
            style={error ? { outline: '1px solid #cc0000' } : undefined}
          >
            {(field.options ?? []).map((opt: { id: string; label: string; value: string }) => {
              const checked = Array.isArray(value) && value.includes(opt.value);
              return (
                <label
                  key={opt.id}
                  className="flex items-center gap-2 cursor-pointer px-1 py-0.5"
                  style={{
                    background: checked ? 'var(--primary)' : 'transparent',
                    color: checked ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  <input
                    type="checkbox"
                    value={opt.value}
                    checked={checked}
                    onChange={(e) => {
                      const prev = Array.isArray(value) ? value : [];
                      onChange(e.target.checked ? [...prev, opt.value] : prev.filter((v) => v !== opt.value));
                    }}
                    style={{ accentColor: 'var(--primary)', width: 12, height: 12, flexShrink: 0 }}
                  />
                  <span className="text-xs font-bold">{opt.label}</span>
                </label>
              );
            })}
          </div>
          {errorEl}
        </div>
      );

    /* ── Select / Dropdown ── */
    case 'select':
      return (
        <div>
          {labelEl}
          {helpEl}
          <div
            className="win-sunken"
            style={error ? { outline: '1px solid #cc0000' } : undefined}
          >
            <select
              value={(value as string) ?? ''}
              onChange={(e) => onChange(e.target.value)}
              style={{
                ...inputStyle,
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
              }}
            >
              <option value="">-- Select an option --</option>
              {(field.options ?? []).map((opt) => (
                <option key={opt.id} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          {errorEl}
        </div>
      );

    /* ── Rating ── */
    case 'rating': {
      const ratingVal = (value as number) ?? 0;
      return (
        <div>
          {labelEl}
          {helpEl}
          <div
            className="win-raised flex items-center gap-1 px-2 py-2"
            style={error ? { outline: '1px solid #cc0000' } : undefined}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const star = i + 1;
              const filled = star <= (hoverRating || ratingVal);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => onChange(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="win-btn-sm p-1"
                  style={{ lineHeight: 1 }}
                >
                  <Star
                    style={{
                      width: 20,
                      height: 20,
                      fill: filled ? '#fbbf24' : 'transparent',
                      color: filled ? '#f59e0b' : 'var(--muted-foreground)',
                      transition: 'all 0.1s',
                    }}
                  />
                </button>
              );
            })}
            {ratingVal > 0 && (
              <span
                className="ml-2 text-xs font-bold font-mono"
                style={{ color: 'var(--primary)' }}
              >
                {ratingVal}/5
              </span>
            )}
          </div>
          {errorEl}
        </div>
      );
    }

    /* ── Slider ── */
    case 'slider': {
      const min = field.validation?.min ?? 0;
      const max = field.validation?.max ?? 100;
      const sliderVal = (value as number) ?? min;
      return (
        <div>
          {labelEl}
          {helpEl}
          <div className="win-raised p-3">
            <div className="flex justify-between text-xs font-mono mb-2">
              <span style={{ color: 'var(--muted-foreground)' }}>{min}</span>
              <span
                className="font-bold px-2"
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {sliderVal}
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>{max}</span>
            </div>
            <input
              type="range"
              min={min}
              max={max}
              value={sliderVal}
              onChange={(e) => onChange(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
          </div>
          {errorEl}
        </div>
      );
    }

    /* ── Layout ── */
    case 'heading':
      return (
        <div className="win-titlebar mb-1 mt-2" style={{ background: 'var(--primary)' }}>
          <span className="win-titlebar-title text-sm">{field.label}</span>
        </div>
      );

    case 'paragraph':
      return (
        <p className="text-xs px-1" style={{ color: 'var(--muted-foreground)' }}>
          {field.label}
        </p>
      );

    case 'divider':
      return <div className="win-separator my-2" />;

    default:
      return null;
  }
}
