'use client';

import { useFormBuilder } from '@/store/form-builder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { FieldOption } from '@repo/types';
import { Plus, Trash2, Settings2, Palette } from 'lucide-react';
import { nanoid } from 'nanoid';

/* ── Win95 field wrappers ──────────────────────────────────────────────────── */
function WinLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold mb-1" style={{ color: 'var(--foreground)' }}>
      {children}
    </p>
  );
}

function WinInput({
  value,
  onChange,
  placeholder,
  type = 'text',
}: {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="win-sunken">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-2 py-1 text-xs outline-none"
        style={{
          background: 'transparent',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-mono), monospace',
        }}
      />
    </div>
  );
}

function WinTextarea({
  value,
  onChange,
  placeholder,
  rows = 2,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <div className="win-sunken">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-2 py-1 text-xs outline-none resize-none"
        style={{
          background: 'transparent',
          color: 'var(--foreground)',
          fontFamily: 'var(--font-mono), monospace',
          display: 'block',
        }}
      />
    </div>
  );
}

function WinToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between px-2 py-1.5"
      style={{
        backgroundColor: 'var(--muted)',
        boxShadow: 'inset 1px 1px 0 #404040, inset -1px -1px 0 #ffffff',
      }}
    >
      <span className="text-xs font-bold" style={{ color: 'var(--foreground)' }}>{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="win-btn-sm text-xs px-3 py-0.5"
        style={{
          background: checked ? 'var(--primary)' : 'var(--secondary)',
          color: checked ? 'var(--primary-foreground)' : 'var(--foreground)',
          minWidth: 44,
          textAlign: 'center',
        }}
      >
        {checked ? '✓ Yes' : '○ No'}
      </button>
    </div>
  );
}

function WinSeparator({ label }: { label: string }) {
  return (
    <div
      className="px-2 py-0.5 text-xs font-bold uppercase tracking-wider"
      style={{
        backgroundColor: 'var(--primary)',
        color: 'var(--primary-foreground)',
        boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(0,0,0,0.3)',
      }}
    >
      {label}
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export function PropertiesPanel() {
  const {
    selectedFieldId, fields, updateField,
    theme, updateTheme,
    settings, updateSettings,
    title, setTitle,
    description, setDescription,
  } = useFormBuilder();

  const field = fields.find((f) => f.id === selectedFieldId);

  return (
    <aside
      className="flex flex-col overflow-hidden"
      style={{
        width: 240,
        flexShrink: 0,
        borderLeft: '2px solid #404040',
        boxShadow: 'inset 1px 0 0 #ffffff',
        backgroundColor: 'var(--card)',
      }}
    >
      {/* Title bar */}
      <div className="win-titlebar" style={{ flexShrink: 0 }}>
        <span className="win-titlebar-title">⚙ Properties</span>
      </div>

      <Tabs defaultValue="field" className="flex flex-col flex-1 overflow-hidden">
        {/* Tab strip */}
        <div className="win-menubar" style={{ gap: 0, padding: 0, flexShrink: 0 }}>
          <TabsList
            style={{ display: 'flex', gap: 0, background: 'transparent', padding: 0, borderRadius: 0 }}
          >
            <TabsTrigger
              value="field"
              className="flex items-center gap-1"
              style={{ fontSize: 11, fontWeight: 'bold', borderRadius: 0, padding: '3px 10px' }}
            >
              <Settings2 style={{ width: 10, height: 10 }} /> Field
            </TabsTrigger>
            <TabsTrigger
              value="form"
              className="flex items-center gap-1"
              style={{ fontSize: 11, fontWeight: 'bold', borderRadius: 0, padding: '3px 10px' }}
            >
              <Palette style={{ width: 10, height: 10 }} /> Form
            </TabsTrigger>
          </TabsList>
        </div>

        {/* ── Field Tab ── */}
        <TabsContent value="field" className="flex-1 overflow-y-auto mt-0 p-0">
          {!field ? (
            <div
              className="flex flex-col items-center justify-center h-full p-4 text-center"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <div className="text-3xl mb-2">⚙</div>
              <p className="text-xs font-bold">No field selected</p>
              <p className="text-xs mt-1">Click a field on the canvas to edit it</p>
            </div>
          ) : (
            <div className="p-2 space-y-2">
              {/* Field type badge */}
              <div
                className="win-raised px-2 py-1 text-center text-xs font-bold font-mono"
                style={{ color: 'var(--primary)' }}
              >
                [{field.type.toUpperCase()}]
              </div>

              <div>
                <WinLabel>Label</WinLabel>
                <WinInput
                  value={field.label}
                  onChange={(v) => updateField(field.id, { label: v })}
                  placeholder="Field label"
                />
              </div>

              {!['heading', 'paragraph', 'divider'].includes(field.type) && (
                <>
                  <div>
                    <WinLabel>Placeholder</WinLabel>
                    <WinInput
                      value={field.placeholder ?? ''}
                      onChange={(v) => updateField(field.id, { placeholder: v })}
                      placeholder="Hint text..."
                    />
                  </div>

                  <div>
                    <WinLabel>Help text</WinLabel>
                    <WinTextarea
                      value={field.helpText ?? ''}
                      onChange={(v) => updateField(field.id, { helpText: v })}
                      placeholder="Optional help text"
                    />
                  </div>

                  <WinToggle
                    label="Required field"
                    checked={field.required ?? false}
                    onChange={(v) => updateField(field.id, { required: v })}
                  />
                </>
              )}

              {/* Options for choice fields */}
              {(field.type === 'radio' || field.type === 'checkbox' || field.type === 'select') && (
                <>
                  <div className="win-separator mt-1" />
                  <WinSeparator label="Options" />
                  <div className="space-y-1 pt-1">
                    {(field.options ?? []).map((opt: FieldOption, i: number) => (
                      <div key={opt.id} className="flex items-center gap-1">
                        <div className="win-sunken flex-1">
                          <input
                            value={opt.label}
                            onChange={(e) => {
                              const newOpts = (field.options ?? []).map((o: FieldOption) =>
                                o.id === opt.id
                                  ? { ...o, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '_') }
                                  : o,
                              );
                              updateField(field.id, { options: newOpts });
                            }}
                            placeholder={`Option ${i + 1}`}
                            className="w-full px-2 py-1 text-xs outline-none"
                            style={{ background: 'transparent', color: 'var(--foreground)', fontFamily: 'monospace' }}
                          />
                        </div>
                        <button
                          className="win-btn-sm px-1 py-1"
                          style={{ color: '#cc0000' }}
                          onClick={() =>
                            updateField(field.id, {
                              options: (field.options ?? []).filter((o: FieldOption) => o.id !== opt.id),
                            })
                          }
                        >
                          <Trash2 style={{ width: 10, height: 10 }} />
                        </button>
                      </div>
                    ))}
                    <button
                      className="win-btn text-xs px-2 py-1 w-full flex items-center justify-center gap-1 mt-1"
                      onClick={() => {
                        const n = (field.options?.length ?? 0) + 1;
                        updateField(field.id, {
                          options: [
                            ...(field.options ?? []),
                            { id: nanoid(), label: `Option ${n}`, value: `option_${n}` },
                          ],
                        });
                      }}
                    >
                      <Plus style={{ width: 10, height: 10 }} /> Add Option
                    </button>
                  </div>
                </>
              )}

              {/* Slider range */}
              {field.type === 'slider' && (
                <>
                  <div className="win-separator mt-1" />
                  <WinSeparator label="Range" />
                  <div className="grid grid-cols-2 gap-1 pt-1">
                    <div>
                      <WinLabel>Min</WinLabel>
                      <WinInput
                        type="number"
                        value={field.validation?.min ?? 0}
                        onChange={(v) => updateField(field.id, { validation: { ...field.validation, min: Number(v) } })}
                      />
                    </div>
                    <div>
                      <WinLabel>Max</WinLabel>
                      <WinInput
                        type="number"
                        value={field.validation?.max ?? 100}
                        onChange={(v) => updateField(field.id, { validation: { ...field.validation, max: Number(v) } })}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </TabsContent>

        {/* ── Form Tab ── */}
        <TabsContent value="form" className="flex-1 overflow-y-auto mt-0 p-0">
          <div className="p-2 space-y-2">
            <WinSeparator label="Form Info" />
            <div className="pt-1">
              <WinLabel>Title</WinLabel>
              <WinInput value={title} onChange={setTitle} placeholder="Form title" />
            </div>
            <div>
              <WinLabel>Description</WinLabel>
              <WinTextarea value={description} onChange={setDescription} placeholder="Optional description" />
            </div>

            <div className="win-separator mt-1" />
            <WinSeparator label="Theme" />
            <div className="pt-1">
              <WinLabel>Primary color</WinLabel>
              <div className="flex gap-1 items-center">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                  className="win-raised cursor-pointer"
                  style={{ width: 28, height: 24, padding: 2, border: 'none' }}
                />
                <div className="win-sunken flex-1">
                  <input
                    value={theme.primaryColor}
                    onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                    className="w-full px-2 py-1 text-xs outline-none font-mono"
                    style={{ background: 'transparent', color: 'var(--foreground)' }}
                  />
                </div>
              </div>
            </div>

            <div className="win-separator mt-1" />
            <WinSeparator label="Settings" />
            <div className="pt-1 space-y-2">
              <div>
                <WinLabel>Submit button text</WinLabel>
                <WinInput
                  value={settings.submitButtonText}
                  onChange={(v) => updateSettings({ submitButtonText: v })}
                  placeholder="Submit"
                />
              </div>
              <div>
                <WinLabel>Success message</WinLabel>
                <WinTextarea
                  value={settings.successMessage}
                  onChange={(v) => updateSettings({ successMessage: v })}
                  placeholder="Thank you!"
                />
              </div>

              <WinToggle
                label="Multiple submissions"
                checked={settings.allowMultipleSubmissions}
                onChange={(v) => updateSettings({ allowMultipleSubmissions: v })}
              />
              <WinToggle
                label="Show progress bar"
                checked={settings.showProgressBar}
                onChange={(v) => updateSettings({ showProgressBar: v })}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status bar */}
      <div className="win-statusbar text-xs" style={{ flexShrink: 0 }}>
        <span className="win-status-panel">
          {field ? `[${field.type}]` : 'No selection'}
        </span>
        <span className="win-status-panel">{fields.length} field(s)</span>
      </div>
    </aside>
  );
}
