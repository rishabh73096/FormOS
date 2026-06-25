import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  varchar,
  index,
} from 'drizzle-orm/pg-core';
import type { FormField, FormTheme, FormSettings } from '@repo/types';

// ── Auth tables (Better-Auth schema) ────────────────────────────────────────

export const users = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  plan: varchar('plan', { length: 20 }).notNull().default('free'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sessions = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const accounts = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const verifications = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// ── Forms ────────────────────────────────────────────────────────────────────

export const forms = pgTable(
  'forms',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    fields: jsonb('fields').$type<FormField[]>().notNull().default([]),
    theme: jsonb('theme').$type<FormTheme>().notNull(),
    settings: jsonb('settings').$type<FormSettings>().notNull(),
    isPublished: boolean('is_published').notNull().default(false),
    publicId: varchar('public_id', { length: 21 }).notNull().unique(),
    viewCount: integer('view_count').notNull().default(0),
    responseCount: integer('response_count').notNull().default(0),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('forms_user_id_idx').on(table.userId),
    index('forms_public_id_idx').on(table.publicId),
  ],
);

// ── Responses ────────────────────────────────────────────────────────────────

export const responses = pgTable(
  'responses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    formId: uuid('form_id')
      .notNull()
      .references(() => forms.id, { onDelete: 'cascade' }),
    respondentEmail: varchar('respondent_email', { length: 255 }),
    values: jsonb('values').$type<Record<string, unknown>>().notNull().default({}),
    metadata: jsonb('metadata')
      .$type<{
        ip?: string;
        userAgent?: string;
        device?: string;
        browser?: string;
        referrer?: string;
      }>()
      .notNull()
      .default({}),
    submittedAt: timestamp('submitted_at').notNull().defaultNow(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('responses_form_id_idx').on(table.formId)],
);

// ── Analytics ────────────────────────────────────────────────────────────────

export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    formId: uuid('form_id')
      .notNull()
      .references(() => forms.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 20 }).notNull(), // 'view' | 'start' | 'submit' | 'abandon'
    sessionId: varchar('session_id', { length: 64 }),
    metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    index('analytics_form_id_idx').on(table.formId),
    index('analytics_type_idx').on(table.type),
  ],
);
