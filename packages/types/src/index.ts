export type FieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'phone'
  | 'url'
  | 'radio'
  | 'checkbox'
  | 'select'
  | 'date'
  | 'time'
  | 'datetime'
  | 'file'
  | 'rating'
  | 'slider'
  | 'heading'
  | 'paragraph'
  | 'divider';

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  patternMessage?: string;
}

export interface ConditionalLogicRule {
  fieldId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'is_empty' | 'is_not_empty';
  value: string;
}

export interface ConditionalLogic {
  action: 'show' | 'hide';
  match: 'all' | 'any';
  rules: ConditionalLogicRule[];
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  validation?: FieldValidation;
  options?: FieldOption[];
  conditionalLogic?: ConditionalLogic;
  order: number;
  width?: 'full' | 'half';
}

export type ThemeName = 'modern' | 'minimal' | 'dark' | 'glassmorphism' | 'colorful';

export interface FormTheme {
  name: ThemeName;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: 'filled' | 'outlined' | 'ghost';
}

export interface FormSettings {
  submitButtonText: string;
  successMessage: string;
  redirectUrl?: string;
  allowMultipleSubmissions: boolean;
  requireAuth: boolean;
  password?: string;
  expiresAt?: string;
  maxResponses?: number;
  showProgressBar: boolean;
  shuffleFields: boolean;
}

export interface Form {
  id: string;
  userId: string;
  title: string;
  description?: string;
  fields: FormField[];
  theme: FormTheme;
  settings: FormSettings;
  isPublished: boolean;
  publicId: string;
  viewCount: number;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  id: string;
  formId: string;
  respondentEmail?: string;
  submittedAt: string;
  values: Record<string, unknown>;
  metadata: {
    ip?: string;
    userAgent?: string;
    device?: string;
    browser?: string;
    referrer?: string;
  };
}

export type Plan = 'free' | 'pro' | 'team';

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  plan: Plan;
  createdAt: string;
}

export const DEFAULT_THEME: FormTheme = {
  name: 'modern',
  primaryColor: '#6366f1',
  backgroundColor: '#ffffff',
  textColor: '#111827',
  fontFamily: 'Inter, sans-serif',
  borderRadius: '0.5rem',
  buttonStyle: 'filled',
};

export const DEFAULT_SETTINGS: FormSettings = {
  submitButtonText: 'Submit',
  successMessage: 'Thank you for your response!',
  allowMultipleSubmissions: true,
  requireAuth: false,
  showProgressBar: false,
  shuffleFields: false,
};
