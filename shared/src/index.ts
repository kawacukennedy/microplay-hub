// User types
export interface User {
  id: string
  username: string
  email?: string
  avatarUrl?: string
  role: UserRole
  isGuest: boolean
  createdAt: Date
  lastSeenAt?: Date
}

export enum UserRole {
  USER = 'USER',
  CREATOR = 'CREATOR',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

// Game types
export interface Game {
  id: string
  slug: string
  title: string
  engine: string
  defaultConfig: Record<string, any>
  createdAt: Date
}

export interface GameConfig {
  seed: number
  difficulty: number
  timeLimit: number
  [key: string]: any
}

export interface GameResult {
  score: number
  duration: number
  replayDataHash?: string
  replayData?: any
}

export interface GameEngine {
  init(config: GameConfig): void
  start(onEnd?: (result: GameResult) => void): void
  end(): GameResult
  serialize(): LevelData
}

// Level types
export interface Level {
  id: string
  gameId: string
  creatorId: string
  title: string
  description?: string
  data: Record<string, any>
  thumbnailUrl?: string
  assets: Record<string, any>
  tags: string[]
  publishedAt?: Date
  isFlagged: boolean
  playsCount: number
  likesCount: number
  createdAt: Date
  updatedAt: Date
  creator?: User
}

export interface LevelData {
  config: GameConfig
  objects: any[]
  [key: string]: any
}

// Score types
export interface Score {
  id: string
  levelId: string
  gameId: string
  userId?: string
  value: number
  meta?: Record<string, any>
  isValidated: boolean
  validationInfo?: Record<string, any>
  createdAt: Date
  user?: User
  level?: Level
}

// API types
export interface GuestSession {
  guestId: string
  token: string
  expiresAt: Date
}

export interface ScoreSubmission {
  levelId: string
  value: number
  duration: number
  meta: Record<string, any>
  clientSignature: string
  replayData?: any
}

export interface ScoreResponse {
  status: 'accepted' | 'queued' | 'rejected'
  scoreId?: string
  provisionalRank?: number
}

export interface LeaderboardEntry {
  userId: string
  username: string
  score: number
  scoreId: string
  rank: number
}

// WebSocket types
export interface LeaderboardUpdate {
  levelId: string
  period: 'alltime' | 'weekly'
  delta: Array<{
    userId: string
    username: string
    value: number
    rank: number
  }>
  timestamp: number
}

// Utility functions
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function formatScore(score: number): string {
  return score.toLocaleString()
}

export function formatDuration(seconds: number): string {
  return `${seconds.toFixed(1)}s`
}

export function getGameSlug(gameId: string): string {
  // TODO: Map game IDs to slugs
  return gameId
}

export function validateUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{3,20}$/.test(username)
}

export function createHMAC(message: string, secret: string): string {
  // Simple HMAC implementation for client-side
  // In production, use crypto.subtle or a proper library
  return btoa(message + secret).replace(/=/g, '')
}