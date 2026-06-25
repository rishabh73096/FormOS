import { create } from "zustand";
import { nanoid } from "nanoid";
import type {
  FormField,
  FormTheme,
  FormSettings,
  FieldType,
} from "@repo/types";
import { DEFAULT_THEME, DEFAULT_SETTINGS } from "@repo/types";
import type { Plan } from "@/lib/plans";

interface FormBuilderState {
  formId: string;
  title: string;
  description: string;
  fields: FormField[];
  theme: FormTheme;
  settings: FormSettings;
  isPublished: boolean;
  publicId: string;
  selectedFieldId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  userPlan: Plan;

  // Actions
  setFormData: (data: Partial<FormBuilderState>) => void;
  addField: (type: FieldType) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (fields: FormField[]) => void;
  selectField: (id: string | null) => void;
  duplicateField: (id: string) => void;
  updateTheme: (updates: Partial<FormTheme>) => void;
  updateSettings: (updates: Partial<FormSettings>) => void;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setSaving: (saving: boolean) => void;
  markClean: () => void;
}

const DEFAULT_LABEL: Record<FieldType, string> = {
  text: "Short Answer",
  textarea: "Long Answer",
  email: "Email Address",
  number: "Number",
  phone: "Phone Number",
  url: "Website URL",
  radio: "Multiple Choice",
  checkbox: "Checkboxes",
  select: "Dropdown",
  date: "Date",
  time: "Time",
  datetime: "Date & Time",
  file: "File Upload",
  rating: "Rating",
  slider: "Slider",
  heading: "Heading",
  paragraph: "Paragraph Text",
  divider: "Divider",
};

export const useFormBuilder = create<FormBuilderState>((set, get) => ({
  formId: "",
  title: "",
  description: "",
  fields: [],
  theme: DEFAULT_THEME,
  settings: DEFAULT_SETTINGS,
  isPublished: false,
  publicId: "",
  selectedFieldId: null,
  isDirty: false,
  isSaving: false,
  userPlan: "free",

  setFormData: (data) => set({ ...data, isDirty: false }),

  addField: (type) => {
    const newField: FormField = {
      id: nanoid(),
      type,
      label: DEFAULT_LABEL[type],
      order: get().fields.length,
      width: "full",
      options:
        type === "radio" || type === "checkbox" || type === "select"
          ? [
              { id: nanoid(), label: "Option 1", value: "option_1" },
              { id: nanoid(), label: "Option 2", value: "option_2" },
            ]
          : undefined,
    };
    set((state) => ({
      fields: [...state.fields, newField],
      selectedFieldId: newField.id,
      isDirty: true,
    }));
  },

  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
      isDirty: true,
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields
        .filter((f) => f.id !== id)
        .map((f, i) => ({ ...f, order: i })),
      selectedFieldId:
        state.selectedFieldId === id ? null : state.selectedFieldId,
      isDirty: true,
    })),

  reorderFields: (fields) => set({ fields, isDirty: true }),

  selectField: (id) => set({ selectedFieldId: id }),

  duplicateField: (id) => {
    const field = get().fields.find((f) => f.id === id);
    if (!field) return;
    const copy: FormField = {
      ...field,
      id: nanoid(),
      order: get().fields.length,
    };
    set((state) => ({
      fields: [...state.fields, copy],
      selectedFieldId: copy.id,
      isDirty: true,
    }));
  },

  updateTheme: (updates) =>
    set((state) => ({ theme: { ...state.theme, ...updates }, isDirty: true })),

  updateSettings: (updates) =>
    set((state) => ({
      settings: { ...state.settings, ...updates },
      isDirty: true,
    })),

  setTitle: (title) => set({ title, isDirty: true }),
  setDescription: (description) => set({ description, isDirty: true }),
  setSaving: (isSaving) => set({ isSaving }),
  markClean: () => set({ isDirty: false }),
}));
