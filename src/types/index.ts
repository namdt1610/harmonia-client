/**
 * Core Application Types
 * Comprehensive type definitions for the entire application
 */

// Base types
export type ID = string | number
export type Timestamp = string // ISO 8601 format
export type URL = string

// Legacy types (keeping for backward compatibility)
export interface Artist {
    id: number
    name: string
    bio?: string
    avatar: string
    genres?: string[]
    tracks: Track[]
    albums: Album[]
}

export interface Genre {
    id: number
    name: string
}

export interface Album {
    id: number
    title: string
    artist: Artist
    release_date: string
    image: string
    tracks: Track[]
}

export interface Track {
    id: number
    title: string
    album?: Album | null
    artist: Artist
    file: string
    image?: string
    album_image?: string
    lyrics?: string
    duration: number
    created_at: string
    is_favorite: boolean
    video?: string
    explicit?: boolean
    genre?: Genre
    release_date: string
    play_count: number
}

export interface Playlist {
    id: number
    name: string
    tracks: Track[]
    cover?: string
    creator: User
    tracks_count?: number
    description?: string
    is_public?: boolean
    created_at?: string
    updated_at?: string
}

export interface User {
    id: number
    username: string
    email?: string
    first_name?: string
    last_name?: string
    avatar?: string
    bio?: string
    is_active?: boolean
    date_joined?: string
    last_login?: string
}

// Enhanced types for enterprise features
export interface EnhancedUser extends Omit<User, 'email'> {
  email: string
  displayName: string
  preferences: UserPreferences
  profile: UserProfile
  permissions: string[]
  roles: Role[]
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: 'en' | 'vi'
  audioQuality: 'low' | 'normal' | 'high'
  autoplay: boolean
  notifications: NotificationPreferences
  privacy: PrivacySettings
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  newMusic: boolean
  playlists: boolean
  followers: boolean
  marketing: boolean
}

export interface PrivacySettings {
  profilePublic: boolean
  playlistsPublic: boolean
  followersVisible: boolean
  listeningHistoryPublic: boolean
}

export interface UserProfile {
  country?: string
  dateOfBirth?: string
  followers: number
  following: number
  playlistsCount: number
  favoritesCount: number
}

export interface Role {
  id: ID
  name: string
  permissions: Permission[]
}

export interface Permission {
  id: ID
  name: string
  codename: string
}

// Authentication types
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: 'Bearer'
}

export interface AuthUser extends EnhancedUser {
  isAuthenticated: boolean
  sessionId?: string
}

// Player types
export interface PlayerState {
  currentTrack: Track | null
  queue: Track[]
  currentIndex: number
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  volume: number
  isMuted: boolean
  isShuffled: boolean
  repeatMode: RepeatMode
  currentTime: number
  duration: number
  playbackRate: number
}

export interface QueueItem {
  id: ID
  track: Track
  addedAt: Timestamp
  addedBy?: User
  position: number
  isPlayed: boolean
}

// Search types
export interface SearchResults {
  tracks: Track[]
  artists: Artist[]
  albums: Album[]
  playlists: Playlist[]
  users: User[]
}

export interface SearchSuggestion {
  id: ID
  text: string
  type: 'track' | 'artist' | 'album' | 'playlist' | 'user'
  popularity: number
}

// Activity types
export interface Activity {
  id: ID
  user: User
  type: ActivityType
  target: ActivityTarget
  metadata: Record<string, any>
  createdAt: Timestamp
}

export interface ListeningHistory {
  id: ID
  user: User
  track: Track
  playedAt: Timestamp
  duration: number
  source: 'playlist' | 'album' | 'search' | 'recommendation'
  sourceId?: ID
}

// Upload types
export interface UploadSession {
  id: ID
  fileName: string
  fileSize: number
  mimeType: string
  status: UploadStatus
  progress: number
  url?: URL
  metadata: TrackMetadata
  createdAt: Timestamp
  expiresAt: Timestamp
}

export interface TrackMetadata {
  title?: string
  artist?: string
  album?: string
  year?: number
  genre?: string
  trackNumber?: number
  discNumber?: number
  duration?: number
  bitrate?: number
  format?: AudioFormat
}

// Settings types
export interface AppSettings {
  theme: ThemeSettings
  audio: AudioSettings
  privacy: PrivacySettings
  notifications: NotificationSettings
  accessibility: AccessibilitySettings
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system'
  primaryColor: string
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
}

export interface AudioSettings {
  quality: 'low' | 'normal' | 'high'
  normalization: boolean
  crossfade: number
  gapless: boolean
  autoplay: boolean
}

export interface AccessibilitySettings {
  reducedMotion: boolean
  highContrast: boolean
  screenReader: boolean
  keyboardNavigation: boolean
}

export interface NotificationSettings {
  desktop: boolean
  sound: boolean
  vibration: boolean
}

// Enums and constants
export type AudioFormat = 'mp3' | 'wav' | 'flac' | 'ogg' | 'aac' | 'm4a'
export type AlbumType = 'single' | 'ep' | 'album' | 'compilation'
export type RepeatMode = 'off' | 'one' | 'all'
export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
export type ActivityType = 'play' | 'like' | 'follow' | 'playlist_create' | 'playlist_add' | 'share'
export type ActivityTarget = Track | Artist | Album | Playlist | User

// Form types
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
  newsletter?: boolean
}

export interface CreatePlaylistData {
  name: string
  description?: string
  is_public: boolean
  collaborative?: boolean
}

export interface EditProfileData {
  displayName: string
  bio?: string
  avatar?: File
  website?: URL
  country?: string
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  message?: string
  success: boolean
  errors?: Record<string, string[]>
  meta?: {
    pagination?: PaginationMeta
    timestamp: Timestamp
    requestId: string
    version: string
  }
}

export interface ApiError {
  message: string
  code: string
  status: number
  details?: Record<string, any>
  timestamp: Timestamp
}

// Pagination types
export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginationMeta {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

// Component prop types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
  'data-testid'?: string
}

export interface LoadingProps extends BaseComponentProps {
  size?: 'small' | 'medium' | 'large'
  variant?: 'spinner' | 'dots' | 'pulse'
}

export interface ErrorProps extends BaseComponentProps {
  error: Error | ApiError
  retry?: () => void
  fallback?: React.ReactNode
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type ArrayElement<T> = T extends (infer U)[] ? U : never

// Redux types
export interface AsyncState<T = any> {
  data: T | null
  loading: boolean
  error: string | null
  lastFetch: number | null
}

export interface EntityState<T> {
  entities: Record<ID, T>
  ids: ID[]
}

// Hook return types
export interface UseAsyncReturn<T> {
  data: T | null
  loading: boolean
  error: Error | null
  execute: (...args: any[]) => Promise<T>
  reset: () => void
}

export interface UseToggleReturn {
  value: boolean
  toggle: () => void
  setTrue: () => void
  setFalse: () => void
}

// Event types
export interface PlayerEvent {
  type: 'play' | 'pause' | 'stop' | 'seek' | 'volumechange' | 'ended' | 'error'
  track?: Track
  currentTime?: number
  volume?: number
  error?: Error
}

export interface UploadEvent {
  type: 'start' | 'progress' | 'complete' | 'error'
  file: File
  progress?: number
  result?: UploadSession
  error?: Error
}

// Validation types
export interface ValidationRule<T = any> {
  required?: boolean
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: T) => boolean | string
  message?: string
}

export type ValidationSchema<T = any> = {
  [K in keyof T]?: ValidationRule<T[K]>
}

export interface ValidationError {
  field: string
  message: string
  code: string
}
