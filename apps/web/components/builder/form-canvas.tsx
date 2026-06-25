'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormBuilder } from '@/store/form-builder';
import type { FormField } from '@repo/types';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { FieldPreview } from './field-preview';
import { motion, AnimatePresence } from '@/lib/motion';

function SortableField({ field }: { field: FormField }) {
  const { selectedFieldId, selectField, removeField, duplicateField } = useFormBuilder();
  const isSelected = selectedFieldId === field.id;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        cursor: 'pointer',
        backgroundColor: isSelected ? 'var(--accent)' : 'var(--card)',
        color: isSelected ? 'var(--accent-foreground)' : 'var(--foreground)',
        boxShadow: isSelected
          ? 'inset 1px 1px 0 rgba(255,255,255,0.15), inset -1px -1px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary)'
          : 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #404040, inset 2px 2px 0 #e0ddd8, inset -2px -2px 0 #808080',
        marginBottom: 4,
      }}
      onClick={() => selectField(field.id)}
      className="group relative p-3"
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-1.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical style={{ width: 12, height: 12, color: 'var(--muted-foreground)' }} />
      </div>

      {/* Field content */}
      <div className="pl-4 pr-16">
        <FieldPreview field={field} />
      </div>

      {/* Actions */}
      {isSelected && (
        <div
          className="absolute right-1.5 top-1.5 flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="win-btn-sm px-1.5 py-0.5 text-xs"
            onClick={() => duplicateField(field.id)}
            title="Duplicate"
          >
            <Copy style={{ width: 10, height: 10 }} />
          </button>
          <button
            className="win-btn-sm px-1.5 py-0.5 text-xs"
            style={{ color: '#cc0000' }}
            onClick={() => removeField(field.id)}
            title="Delete"
          >
            <Trash2 style={{ width: 10, height: 10 }} />
          </button>
        </div>
      )}
    </div>
  );
}

export function FormCanvas() {
  const { fields, reorderFields, title, description } = useFormBuilder();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = fields.findIndex((f) => f.id === active.id);
    const newIndex = fields.findIndex((f) => f.id === over.id);
    const reordered = arrayMove(fields, oldIndex, newIndex).map((f, i) => ({ ...f, order: i }));
    reorderFields(reordered);
  }

  return (
    <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: 'var(--background)' }}>
      <div className="mx-auto max-w-xl">
        {/* Form header window */}
        <div className="win-window mb-3">
          <div className="win-titlebar">
            <span className="win-titlebar-title">📋 {title || 'Untitled Form'}</span>
          </div>
          <div className="p-4">
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              {description || 'No description'}
            </p>
          </div>
        </div>

        {/* Fields */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <AnimatePresence>
              {fields.map((field) => (
                <motion.div
                  key={field.id}
                  layout
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                >
                  <SortableField field={field} />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>

        <AnimatePresence>
          {fields.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center justify-center py-16 text-center mt-2"
              style={{
                border: '2px dashed var(--border)',
                backgroundColor: 'var(--card)',
                boxShadow: 'inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
              }}
            >
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Canvas is empty</p>
              <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Click a field type in the Toolbox to add it here
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
