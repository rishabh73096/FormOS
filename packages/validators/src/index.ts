import { z } from 'zod';

export const fieldOptionSchema = z.object({
  id: z.string(),
  label: z.string().min(1, 'Option label is required'),
  value: z.string(),
});

export const fieldValidationSchema = z.object({
  required: z.boolean().optional(),
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().min(1).optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  patternMessage: z.string().optional(),
});

export const conditionalLogicRuleSchema = z.object({
  fieldId: z.string(),
  operator: z.enum(['equals', 'not_equals', 'contains', 'not_contains', 'is_empty', 'is_not_empty']),
  value: z.string(),
});

export const conditionalLogicSchema = z.object({
  action: z.enum(['show', 'hide']),
  match: z.enum(['all', 'any']),
  rules: z.array(conditionalLogicRuleSchema).min(1),
});

export const fieldTypeSchema = z.enum([
  'text', 'textarea', 'email', 'number', 'phone', 'url',
  'radio', 'checkbox', 'select', 'date', 'time', 'datetime',
  'file', 'rating', 'slider', 'heading', 'paragraph', 'divider',
]);

export const formFieldSchema = z.object({
  id: z.string(),
  type: fieldTypeSchema,
  label: z.string().min(1, 'Field label is required'),
  placeholder: z.string().optional(),
  helpText: z.string().optional(),
  required: z.boolean().optional(),
  validation: fieldValidationSchema.optional(),
  options: z.array(fieldOptionSchema).optional(),
  conditionalLogic: conditionalLogicSchema.optional(),
  order: z.number().int().min(0),
  width: z.enum(['full', 'half']).optional(),
});

export const formThemeSchema = z.object({
  name: z.enum(['modern', 'minimal', 'dark', 'glassmorphism', 'colorful']),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color'),
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  textColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  fontFamily: z.string(),
  borderRadius: z.string(),
  buttonStyle: z.enum(['filled', 'outlined', 'ghost']),
});

export const formSettingsSchema = z.object({
  submitButtonText: z.string().min(1).max(100).default('Submit'),
  successMessage: z.string().max(500).default('Thank you for your response!'),
  redirectUrl: z.string().url().optional().or(z.literal('')),
  allowMultipleSubmissions: z.boolean().default(true),
  requireAuth: z.boolean().default(false),
  password: z.string().max(100).optional(),
  expiresAt: z.string().datetime().optional(),
  maxResponses: z.number().int().positive().optional(),
  showProgressBar: z.boolean().default(false),
  shuffleFields: z.boolean().default(false),
});

export const createFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(1000).optional(),
});

export const updateFormSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional().nullable(),
  fields: z.array(formFieldSchema).optional(),
  theme: formThemeSchema.optional(),
  settings: formSettingsSchema.optional(),
  isPublished: z.boolean().optional(),
});

export const submitResponseSchema = z.object({
  values: z.record(z.unknown()),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      referrer: z.string().optional(),
    })
    .optional(),
});

export type CreateFormInput = z.infer<typeof createFormSchema>;
export type UpdateFormInput = z.infer<typeof updateFormSchema>;
export type SubmitResponseInput = z.infer<typeof submitResponseSchema>;
