export enum SubscriptionTier {
  FREE = 'FREE',
  PRO = 'PRO',
  PREMIUM = 'PREMIUM',
}

export interface User {
  id: string
  email: string
  username: string | null
  avatarUrl: string | null
  bankroll: number
  subscriptionTier: SubscriptionTier
  subscriptionExpiresAt: Date | null
  defaultBuyIn: number
  favoriteStructures: string[]
  createdAt: Date
  updatedAt: Date
}

export interface UserProfile {
  id: string
  username: string | null
  avatarUrl: string | null
  bankroll: number
  subscriptionTier: SubscriptionTier
  defaultBuyIn: number
  favoriteStructures: string[]
}
