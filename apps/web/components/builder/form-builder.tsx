'use client';

import { useEffect, useCallback } from 'react';
import { useFormBuilder } from '@/store/form-builder';
import { BuilderToolbar } from './builder-toolbar';
import { FieldsSidebar } from './fields-sidebar';
import { FormCanvas } from './form-canvas';
import { PropertiesPanel } from './properties-panel';
import { toast } from 'sonner';
import type { Plan } from '@/lib/plans';

interface Props {
  form: {
    id: string;
    title: string;
    description: string | null;
    fields: unknown;
    theme: unknown;
    settings: unknown;
    isPublished: boolean;
    publicId: string;
  };
  userPlan?: Plan;
}

export function FormBuilder({ form, userPlan = 'free' }: Props) {
  const { setFormData, isDirty, isSaving, setSaving, markClean, fields, theme, settings, title, description } =
    useFormBuilder();

  // Load form data into store on mount
  useEffect(() => {
    setFormData({
      formId: form.id,
      title: form.title,
      description: form.description ?? '',
      fields: (form.fields as never) ?? [],
      theme: form.theme as never,
      settings: form.settings as never,
      isPublished: form.isPublished,
      publicId: form.publicId,
      userPlan,
    });
  }, [form.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const save = useCallback(async () => {
    if (isSaving) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/forms/${form.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, fields, theme, settings }),
      });
      if (!res.ok) throw new Error('Save failed');
      markClean();
      toast.success('Saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setSaving(false);
    }
  }, [form.id, title, description, fields, theme, settings, isSaving, setSaving, markClean]);

  // Auto-save every 30s when dirty
  useEffect(() => {
    if (!isDirty) return;
    const timer = setTimeout(save, 30_000);
    return () => clearTimeout(timer);
  }, [isDirty, save]);

  // Ctrl+S to save
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        save();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [save]);

  return (
    <div className="flex h-screen flex-col overflow-hidden -m-4">
      <BuilderToolbar onSave={save} />
      <div className="flex flex-1 overflow-hidden">
        <FieldsSidebar />
        <FormCanvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
