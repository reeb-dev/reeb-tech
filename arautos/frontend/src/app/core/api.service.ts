import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DealerPublic, ProfileUpdateRequest, Stats, TenantProfile, VehiclePanel, VehiclePublic, VehicleRequest, BillingStatus, CheckoutResponse, RankingResponse } from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  catalog(filters: Record<string, string | number | undefined>) {
    let params = new HttpParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<VehiclePublic[]>(`${environment.apiUrl}/public/catalog`, { params });
  }

  vehicle(id: string) {
    return this.http.get<VehiclePublic>(`${environment.apiUrl}/public/vehicles/${id}`);
  }

  view(id: string) {
    return this.http.post(`${environment.apiUrl}/public/vehicles/${id}/view`, {});
  }

  waClick(id: string) {
    return this.http.post(`${environment.apiUrl}/public/vehicles/${id}/wa-click`, {});
  }

  dealer(slug: string) {
    return this.http.get<DealerPublic>(`${environment.apiUrl}/public/c/${slug}`);
  }

  myVehicles() {
    return this.http.get<VehiclePanel[]>(`${environment.apiUrl}/panel/vehicles`);
  }

  createVehicle(body: VehicleRequest) {
    return this.http.post<VehiclePanel>(`${environment.apiUrl}/panel/vehicles`, body);
  }

  updateVehicle(id: string, body: VehicleRequest) {
    return this.http.put<VehiclePanel>(`${environment.apiUrl}/panel/vehicles/${id}`, body);
  }

  deleteVehicle(id: string) {
    return this.http.delete(`${environment.apiUrl}/panel/vehicles/${id}`);
  }

  profile() {
    return this.http.get<TenantProfile>(`${environment.apiUrl}/panel/profile`);
  }

  updateProfile(body: ProfileUpdateRequest) {
    return this.http.put<TenantProfile>(`${environment.apiUrl}/panel/profile`, body);
  }

  stats() {
    return this.http.get<Stats>(`${environment.apiUrl}/panel/stats`);
  }

  billingStatus() {
    return this.http.get<BillingStatus>(`${environment.apiUrl}/panel/billing/status`);
  }

  billingCheckout() {
    return this.http.post<CheckoutResponse>(`${environment.apiUrl}/panel/billing/checkout`, {});
  }

  ranking(province?: string) {
    let params = new HttpParams();
    if (province) params = params.set('province', province);
    return this.http.get<RankingResponse>(`${environment.apiUrl}/panel/ranking`, { params });
  }
}
