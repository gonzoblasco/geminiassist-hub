
import type { Timestamp } from 'firebase/firestore'; // Assuming Firebase

export interface Agent {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., 'Accounting', 'Marketing', 'Sales'
  interfaceType: 'chat' | 'form';
  promptBase: string; // Base prompt for Genkit
  icon?: string; // Lucide icon name or SVG path
  color?: string; // Hex color for card styling
  tags?: string[]; // For filtering and search
  version?: string;
  status: 'published' | 'draft' | 'archived';
  freeTrialOffered: boolean;
  trialDurationDays?: number;
  subscriptionTierRequired?: string; // e.g., 'basic', 'pro'
  creatorId?: string; // For future marketplace
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  averageRating?: number;
  reviewCount?: number;
  usageCount?: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'client' | 'admin' | 'creator'; // 'creator' for future marketplace
  onboardingCompleted?: boolean;
  userGoal?: string; // Captured during onboarding
  experienceLevel?: string; // Captured during onboarding, e.g., 'beginner', 'intermediate', 'expert'
  companyName?: string;
  companySize?: string;
  industry?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  lastLoginAt?: Timestamp | Date;
  stripeCustomerId?: string; // For subscriptions
  // favorites: string[]; // Array of agent IDs
  // customCollections: { name: string, agentIds: string[] }[];
}

export interface Subscription {
  id: string;
  userId: string;
  agentId?: string; // If subscribing to a specific agent
  tierId: string; // e.g., 'free_trial', 'basic_monthly', 'pro_annual'
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired';
  startDate: Timestamp | Date;
  endDate?: Timestamp | Date; // For trialing or if canceled
  currentPeriodStart: Timestamp | Date;
  currentPeriodEnd: Timestamp | Date;
  cancelAtPeriodEnd: boolean;
  priceId?: string; // Stripe Price ID
  paymentMethod?: string; // Last 4 digits or type
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Interaction {
  id: string;
  userId: string;
  agentId: string;
  timestamp: Timestamp | Date;
  inputType: 'chat' | 'form';
  inputContent: Record<string, any> | string; // Form data or chat message string
  outputContent: string; // Agent's response text
  isFlaggedForModeration?: boolean;
  moderationResult?: {
    isSafe: boolean;
    reason?: string;
    moderatedAt: Timestamp | Date;
    moderatedBy?: string; // e.g., 'admin_user_id' or 'system'
    typeModerated?: 'input' | 'output'; // Which part was moderated
  };
  feedback?: {
    rating?: 1 | 2 | 3 | 4 | 5;
    comment?: string;
  };
  sessionId?: string; // To group related interactions
}

// For forms
export interface OnboardingFormData {
  userGoal: string;
  experienceLevel: string;
}

export interface AgentFormData {
  name: string;
  description: string;
  category: string;
  interfaceType: 'chat' | 'form';
  promptBase: string;
  icon?: string;
  tags?: string; // Comma-separated
  status: 'published' | 'draft' | 'archived';
  freeTrialOffered: boolean;
  trialDurationDays?: string; // string for form input
}
