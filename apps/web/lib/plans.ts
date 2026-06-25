export type Plan = 'free' | 'pro';

export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    currency: '₹',
    badge: '○ FREE',
    badgeColor: '#808080',
    maxForms: 3,
    maxResponsesPerForm: 100,
    features: {
      analytics: false,
      conditionalLogic: false,
      removeBranding: false,
      advancedFields: false,
      prioritySupport: false,
      customDomain: false,
    },
    featureList: [
      '3 forms',
      '100 responses / form',
      'Basic field types',
      'FormOS branding',
    ],
  },
  pro: {
    name: 'Pro',
    price: 999,
    currency: '₹',
    badge: '★ PRO',
    badgeColor: '#fbbf24',
    maxForms: Infinity,
    maxResponsesPerForm: Infinity,
    features: {
      analytics: true,
      conditionalLogic: true,
      removeBranding: true,
      advancedFields: true,
      prioritySupport: true,
      customDomain: false,
    },
    featureList: [
      'Unlimited forms',
      'Unlimited responses',
      'All field types',
      'Conditional logic',
      'Advanced analytics',
      'Remove branding',
      'Priority support',
    ],
  },
} as const;

/** Fields free users can use */
export const FREE_FIELD_TYPES = [
  'text', 'textarea', 'email', 'number', 'radio', 'checkbox', 'select',
] as const;

/** Fields that require Pro */
export const PRO_FIELD_TYPES = [
  'phone', 'url', 'date', 'time', 'datetime',
  'rating', 'slider', 'heading', 'paragraph', 'divider',
] as const;

export function isProField(type: string): boolean {
  return (PRO_FIELD_TYPES as readonly string[]).includes(type);
}

export function getPlan(plan: string): Plan {
  return plan === 'pro' ? 'pro' : 'free';
}
