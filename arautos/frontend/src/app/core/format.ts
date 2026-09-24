import { CurrencyCode, VehicleType } from './models';

export function formatPrice(price: number, currency: CurrencyCode): string {
  const n = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(price);
  return currency === 'USD' ? `USD ${n}` : `$ ${n} ARS`;
}

export function typeLabel(t: VehicleType): string {
  return t === 'CERO_KM' ? '0 Km' : 'Usado';
}

export function waLink(phone: string, text: string): string {
  const digits = phone.replace(/\D/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
