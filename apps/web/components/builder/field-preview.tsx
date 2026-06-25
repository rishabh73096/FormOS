'use client';

import type { FormField } from '@repo/types';
import { Star } from 'lucide-react';

interface Props {
  field: FormField;
}

export function FieldPreview({ field }: Props) {
  const label = (
    <div className="mb-1.5 flex items-center gap-1.5">
      <span className="text-sm font-medium">{field.label}</span>
      {field.required && <span className="text-destructive text-xs">*</span>}
    </div>
  );

  const helpText = field.helpText && (
    <p className="mt-1 text-xs text-muted-foreground">{field.helpText}</p>
  );

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
    case 'url':
    case 'number':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="h-9 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground flex items-center">
            {field.placeholder ?? 'Type your answer…'}
          </div>
          {helpText}
        </div>
      );

    case 'textarea':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="h-20 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
            {field.placeholder ?? 'Type your answer…'}
          </div>
          {helpText}
        </div>
      );

    case 'radio':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="space-y-1.5">
            {(field.options ?? []).map((opt: { id: string; label: string; value: string }) => (
              <div key={opt.id} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/40 shrink-0" />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
          {helpText}
        </div>
      );

    case 'checkbox':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="space-y-1.5">
            {(field.options ?? []).map((opt: { id: string; label: string; value: string }) => (
              <div key={opt.id} className="flex items-center gap-2">
                <div className="h-4 w-4 rounded border-2 border-muted-foreground/40 shrink-0" />
                <span className="text-sm">{opt.label}</span>
              </div>
            ))}
          </div>
          {helpText}
        </div>
      );

    case 'select':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="h-9 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground flex items-center justify-between">
            <span>Select an option…</span>
            <span>▾</span>
          </div>
          {helpText}
        </div>
      );

    case 'date':
    case 'time':
    case 'datetime':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="h-9 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground flex items-center">
            {field.type === 'date' ? 'MM / DD / YYYY' : field.type === 'time' ? 'HH : MM' : 'MM / DD / YYYY HH : MM'}
          </div>
          {helpText}
        </div>
      );

    case 'rating':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-6 w-6 text-muted-foreground/30" />
            ))}
          </div>
          {helpText}
        </div>
      );

    case 'slider':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="relative h-5 flex items-center">
            <div className="h-1.5 w-full rounded-full bg-muted" />
            <div
              className="absolute h-4 w-4 rounded-full bg-primary border-2 border-background shadow"
              style={{ left: '50%' }}
            />
          </div>
          {helpText}
        </div>
      );

    case 'file':
      return (
        <div className="pointer-events-none">
          {label}
          <div className="h-20 rounded-md border-2 border-dashed flex items-center justify-center text-sm text-muted-foreground">
            Click or drag to upload
          </div>
          {helpText}
        </div>
      );

    case 'heading':
      return (
        <div className="pointer-events-none">
          <h3 className="text-lg font-bold">{field.label}</h3>
        </div>
      );

    case 'paragraph':
      return (
        <div className="pointer-events-none">
          <p className="text-sm text-muted-foreground">{field.label}</p>
        </div>
      );

    case 'divider':
      return <hr className="border-border" />;

    default:
      return (
        <div className="pointer-events-none">
          {label}
          <div className="h-9 rounded-md border bg-muted/40" />
        </div>
      );
  }
}
