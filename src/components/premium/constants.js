// src/components/premium/constants.js

import { Clock, BarChart3, Zap, Shield } from 'lucide-react';

export const PREMIUM_BENEFITS = [
  {
    icon: Clock,
    title: 'Unlimited Live Mode',
    description: 'Track unlimited shifts in real-time',
  },
  {
    icon: BarChart3,
    title: 'Advanced Statistics',
    description: 'Detailed analytics and insights',
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get help faster with priority support',
  },
  {
    icon: Shield,
    title: 'Data Export',
    description: 'Export your data anytime',
  },
];

// Card Element styles (shared for all card elements)
const CARD_ELEMENT_STYLE = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1a1a1a',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

export const CARD_NUMBER_OPTIONS = {
  ...CARD_ELEMENT_STYLE,
  showIcon: true,
  placeholder: '1234 1234 1234 1234',
};

export const CARD_EXPIRY_OPTIONS = {
  ...CARD_ELEMENT_STYLE,
  placeholder: 'MM / YY',
};

export const CARD_CVC_OPTIONS = {
  ...CARD_ELEMENT_STYLE,
  placeholder: 'CVC',
};

// Country list for billing details (most common countries first)
export const COUNTRIES = [
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'IE', name: 'Ireland' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'PT', name: 'Portugal' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'HK', name: 'Hong Kong' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'CO', name: 'Colombia' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'PH', name: 'Philippines' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'VN', name: 'Vietnam' },
];

// Confetti animation colors
export const CONFETTI_COLORS = ['#FFD700', '#FFA500', '#FF6347', '#7B68EE', '#00CED1', '#FF69B4', '#32CD32', '#FF4500'];

// Status badge config
export const STATUS_CONFIG = {
  active: { label: 'Active', color: 'bg-emerald-100 text-emerald-700' },
  trialing: { label: 'Free Trial', color: 'bg-blue-100 text-blue-700' },
  cancelling: { label: 'Cancelling', color: 'bg-amber-100 text-amber-700' },
  past_due: { label: 'Past Due', color: 'bg-red-100 text-red-700' },
};

// Helper to format subscription dates
export const formatDate = (dateField) => {
  if (!dateField) return '—';
  const date = dateField.toDate ? dateField.toDate() : new Date(dateField);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};
