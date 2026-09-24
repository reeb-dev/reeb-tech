export type CurrencyCode = 'USD' | 'ARS';
export type VehicleType = 'CERO_KM' | 'USADO';
export type VehicleStatus = 'BORRADOR' | 'PUBLICADO' | 'VENDIDO' | 'OCULTO';
export type UserRole = 'TENANT_ADMIN' | 'TENANT_AGENT' | 'PLATFORM_ADMIN';

export interface VehiclePublic {
  id: string;
  brand: string;
  model: string;
  version?: string;
  year: number;
  km: number;
  type: VehicleType;
  price: number;
  currency: CurrencyCode;
  photos: string[];
  province: string;
  city: string;
  fuel?: string;
  transmission?: string;
  color?: string;
  description?: string;
  dealerName: string;
  dealerSlug: string;
  dealerWhatsapp: string;
  createdAt: string;
}

export interface VehiclePanel extends Omit<VehiclePublic, 'dealerName' | 'dealerSlug' | 'dealerWhatsapp'> {
  status: VehicleStatus;
  views: number;
  waClicks: number;
  updatedAt: string;
}

export interface DealerPublic {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  province: string;
  city: string;
  address?: string;
  whatsapp: string;
  email?: string;
  description?: string;
  vehicles: VehiclePublic[];
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  role: UserRole | string;
  tenantId?: string;
  tenantSlug?: string;
  tenantName?: string;
  subscriptionStatus?: string;
  moderationStatus?: string;
  message?: string;
}

export interface PanelUser {
  id: string;
  email: string;
  role: UserRole | string;
  active: boolean;
  createdAt: string;
}

export interface CreatePanelUserRequest {
  email: string;
  password: string;
  role: 'TENANT_ADMIN' | 'TENANT_AGENT';
}

export interface Stats {
  activeListings: number;
  totalViews: number;
  totalWaClicks: number;
  subscriptionStatus: string;
  trialEndsAt?: string;
  readOnly: boolean;
}

export interface BillingStatus {
  subscriptionStatus: string;
  trialEndsAt?: string;
  planId: string;
  planName: string;
  planPriceUsd?: string | null;
  planPriceArs?: string | null;
  mpConfigured: boolean;
  mpPreferenceId?: string | null;
  readOnly: boolean;
  message?: string;
}

export interface CheckoutResponse {
  configured: boolean;
  preferenceId?: string | null;
  initPoint?: string | null;
  sandboxInitPoint?: string | null;
  message?: string | null;
}

export interface RankingEntry {
  rank: number;
  tenantId: string;
  name: string;
  slug: string;
  province: string;
  waClicks: number;
  self: boolean;
}

export interface RankingResponse {
  province: string;
  entries: RankingEntry[];
  criterion: string;
}

export interface OAuthProviderStatus {
  id: string;
  enabled: boolean;
  configured: boolean;
  note: string;
}

export interface MetaStatus {
  configured: boolean;
  facebookConnected: boolean;
  instagramConnected: boolean;
  pageId?: string | null;
  pageName?: string | null;
  instagramUsername?: string | null;
  connectedAt?: string | null;
  pendingPageSelection: boolean;
  message: string;
}

export interface MetaPageOption {
  id: string;
  name: string;
  hasInstagram: boolean;
  instagramUsername?: string | null;
}

export interface PublishPreview {
  vehicleId: string;
  title: string;
  caption: string;
  priceLabel: string;
  location: string;
  publicUrl: string;
  imageUrl?: string | null;
  imagePublicHttps: boolean;
  facebookReady: boolean;
  instagramReady: boolean;
  warning?: string | null;
}

export interface PublicationResult {
  channel: string;
  status: string;
  postId?: string | null;
  postUrl?: string | null;
  errorMessage?: string | null;
  createdAt: string;
}

export interface TenantProfile {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  province: string;
  city: string;
  address?: string;
  whatsapp: string;
  email?: string;
  description?: string;
  subscriptionStatus: string;
  trialEndsAt?: string;
  planId?: string;
  planName?: string;
  planPriceUsd?: string | null;
  planPriceArs?: string | null;
  moderationStatus: string;
  readOnly: boolean;
}

export interface VehicleRequest {
  brand: string;
  model: string;
  version?: string;
  year: number;
  km: number;
  type: VehicleType;
  price: number;
  currency: CurrencyCode;
  photos: string[];
  province: string;
  city: string;
  fuel?: string;
  transmission?: string;
  color?: string;
  description?: string;
  status: VehicleStatus;
}

export interface ProfileUpdateRequest {
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  accentColor?: string;
  province: string;
  city: string;
  address?: string;
  whatsapp: string;
  email?: string;
  description?: string;
}
