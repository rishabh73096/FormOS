'use client';

import { useFormBuilder } from '@/store/form-builder';
import { isProField } from '@/lib/plans';
import type { FieldType } from '@repo/types';
import {
  Type, AlignLeft, Mail, Hash, Phone, Link, Circle, CheckSquare,
  ChevronDown, Calendar, Clock, CalendarClock, Star,
  Sliders, Heading, AlignCenter, Minus, Lock,
} from 'lucide-react';
import { useState } from 'react';

interface FieldDef {
  type: FieldType;
  label: string;
  icon: React.ElementType;
  category: string;
}

const FIELD_DEFS: FieldDef[] = [
  { type: 'text',      label: 'Short Text',      icon: Type,          category: 'Input' },
  { type: 'textarea',  label: 'Long Text',        icon: AlignLeft,     category: 'Input' },
  { type: 'email',     label: 'Email',            icon: Mail,          category: 'Input' },
  { type: 'number',    label: 'Number',           icon: Hash,          category: 'Input' },
  { type: 'phone',     label: 'Phone',            icon: Phone,         category: 'Input' },
  { type: 'url',       label: 'URL',              icon: Link,          category: 'Input' },
  { type: 'radio',     label: 'Multiple Choice',  icon: Circle,        category: 'Choice' },
  { type: 'checkbox',  label: 'Checkboxes',       icon: CheckSquare,   category: 'Choice' },
  { type: 'select',    label: 'Dropdown',         icon: ChevronDown,   category: 'Choice' },
  { type: 'date',      label: 'Date',             icon: Calendar,      category: 'Date & Time' },
  { type: 'time',      label: 'Time',             icon: Clock,         category: 'Date & Time' },
  { type: 'datetime',  label: 'Date & Time',      icon: CalendarClock, category: 'Date & Time' },
  { type: 'rating',    label: 'Rating',           icon: Star,          category: 'Advanced' },
  { type: 'slider',    label: 'Slider',           icon: Sliders,       category: 'Advanced' },
  { type: 'heading',   label: 'Heading',          icon: Heading,       category: 'Layout' },
  { type: 'paragraph', label: 'Paragraph',        icon: AlignCenter,   category: 'Layout' },
  { type: 'divider',   label: 'Divider',          icon: Minus,         category: 'Layout' },
];

const CATEGORIES = ['Input', 'Choice', 'Date & Time', 'Advanced', 'Layout'];

export function FieldsSidebar() {
  const { addField, userPlan } = useFormBuilder();
  const isPro = userPlan === 'pro';
  const [tooltip, setTooltip] = useState<string | null>(null);

  const freeCount = FIELD_DEFS.filter((f) => !isProField(f.type)).length;
  const proCount = FIELD_DEFS.filter((f) => isProField(f.type)).length;

  return (
    <aside
      className="flex flex-col overflow-y-auto"
      style={{
        width: 176,
        flexShrink: 0,
        borderRight: '2px solid #404040',
        backgroundColor: 'var(--card)',
        boxShadow: 'inset -1px 0 0 #ffffff',
      }}
    >
      <div className="win-titlebar" style={{ flexShrink: 0 }}>
        <span className="win-titlebar-title">🧰 Toolbox</span>
      </div>

      {/* Plan badge */}
      {!isPro && (
        <div
          className="mx-1.5 mt-1.5 px-2 py-1 text-xs text-center"
          style={{
            background: 'linear-gradient(90deg, #000080 0%, #1084d0 100%)',
            color: '#ffffff',
            fontWeight: 'bold',
            boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(0,0,0,0.3)',
          }}
        >
          🔒 {proCount} fields need Pro
        </div>
      )}

      {/* Upgrade tooltip */}
      {tooltip && (
        <div
          className="mx-1.5 mt-1 px-2 py-1.5 text-xs"
          style={{
            background: '#fffbcd',
            border: '1px solid #808000',
            color: '#333',
            boxShadow: '2px 2px 0 #404040',
          }}
        >
          ★ <strong>{tooltip}</strong> requires Pro
        </div>
      )}

      <div className="flex-1 p-1.5 overflow-y-auto">
        {CATEGORIES.map((category) => {
          const catFields = FIELD_DEFS.filter((f) => f.category === category);
          return (
            <div key={category} className="mb-2">
              <div
                className="px-2 py-0.5 mb-1 text-xs font-bold"
                style={{
                  backgroundColor: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(0,0,0,0.3)',
                }}
              >
                {category}
              </div>

              {catFields.map(({ type, label, icon: Icon }) => {
                const locked = !isPro && isProField(type);
                return (
                  <button
                    key={type}
                    onClick={() => {
                      if (locked) {
                        setTooltip(label);
                        setTimeout(() => setTooltip(null), 2500);
                        return;
                      }
                      setTooltip(null);
                      addField(type);
                    }}
                    className="win-btn flex w-full items-center gap-2 px-2 py-1.5 text-xs mb-0.5"
                    style={{
                      justifyContent: 'flex-start',
                      fontWeight: 'normal',
                      opacity: locked ? 0.55 : 1,
                      cursor: locked ? 'not-allowed' : 'pointer',
                    }}
                    title={locked ? `★ ${label} — Pro feature` : label}
                  >
                    <Icon style={{ width: 11, height: 11, flexShrink: 0, color: locked ? '#808080' : 'var(--primary)' }} />
                    <span className="flex-1 text-left truncate">{label}</span>
                    {locked && <Lock style={{ width: 9, height: 9, color: '#fbbf24', flexShrink: 0 }} />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="win-statusbar text-xs" style={{ flexShrink: 0 }}>
        <span className="win-status-panel">
          {isPro ? `${FIELD_DEFS.length} fields` : `${freeCount} free · ${proCount} 🔒`}
        </span>
      </div>
    </aside>
  );
}
