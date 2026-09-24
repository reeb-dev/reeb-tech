export type CurrencyCode = 'USD' | 'ARS';
export type VehicleType = 'CERO_KM' | 'USADO';
export type VehicleStatus = 'BORRADOR' | 'PUBLICADO' | 'VENDIDO' | 'OCULTO';

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
  role: string;
  tenantId?: string;
  tenantSlug?: string;
  tenantName?: string;
  subscriptionStatus?: string;
  moderationStatus?: string;
  message?: string;
}

export interface Stats {
  activeListings: number;
  totalViews: number;
  totalWaClicks: number;
  subscriptionStatus: string;
  trialEndsAt?: string;
  readOnly: boolean;
}

export interface TenantProfile {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
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
