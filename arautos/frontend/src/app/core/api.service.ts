import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {
  CreatePanelUserRequest,
  DealerPublic,
  ProfileUpdateRequest,
  Stats,
  TenantProfile,
  VehiclePanel,
  VehiclePublic,
  VehicleRequest,
  BillingStatus,
  CheckoutResponse,
  RankingResponse,
  PanelUser,
  MetaStatus,
  MetaPageOption,
  PublishPreview,
  PublicationResult,
  OAuthProviderStatus
} from './models';

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

  panelUsers() {
    return this.http.get<PanelUser[]>(`${environment.apiUrl}/panel/users`);
  }

  createPanelUser(body: CreatePanelUserRequest) {
    return this.http.post<PanelUser>(`${environment.apiUrl}/panel/users`, body);
  }

  updatePanelUserRole(id: string, role: 'TENANT_ADMIN' | 'TENANT_AGENT') {
    return this.http.put<PanelUser>(`${environment.apiUrl}/panel/users/${id}/role`, { role });
  }

  updatePanelUser(id: string, body: { displayName?: string; role?: 'TENANT_ADMIN' | 'TENANT_AGENT' }) {
    return this.http.put<PanelUser>(`${environment.apiUrl}/panel/users/${id}`, body);
  }

  deactivatePanelUser(id: string) {
    return this.http.post<PanelUser>(`${environment.apiUrl}/panel/users/${id}/deactivate`, {});
  }

  activatePanelUser(id: string) {
    return this.http.post<PanelUser>(`${environment.apiUrl}/panel/users/${id}/activate`, {});
  }

  deletePanelUser(id: string) {
    return this.http.delete(`${environment.apiUrl}/panel/users/${id}`);
  }

  oauthProviders() {
    return this.http.get<{ providers: OAuthProviderStatus[] }>(`${environment.apiUrl}/auth/oauth/providers`);
  }

  metaStatus() {
    return this.http.get<MetaStatus>(`${environment.apiUrl}/panel/social/meta/status`);
  }

  metaStart() {
    return this.http.get<{ authorizeUrl: string; message?: string }>(
      `${environment.apiUrl}/panel/social/meta/start`
    );
  }

  metaPages() {
    return this.http.get<{ pages: MetaPageOption[]; message: string }>(
      `${environment.apiUrl}/panel/social/meta/pages`
    );
  }

  metaSelectPage(pageId: string) {
    return this.http.post<MetaStatus>(`${environment.apiUrl}/panel/social/meta/select-page`, { pageId });
  }

  metaDisconnect() {
    return this.http.delete<MetaStatus>(`${environment.apiUrl}/panel/social/meta`);
  }

  publishPreview(vehicleId: string) {
    return this.http.get<PublishPreview>(`${environment.apiUrl}/panel/social/publish/preview`, {
      params: { vehicleId }
    });
  }

  publishSocial(body: { vehicleId: string; facebook: boolean; instagram: boolean }) {
    return this.http.post<{ results: PublicationResult[]; message: string }>(
      `${environment.apiUrl}/panel/social/publish`,
      body
    );
  }

  socialPublications() {
    return this.http.get<PublicationResult[]>(`${environment.apiUrl}/panel/social/publications`);
  }

  adminPendingTenants() {
    return this.http.get<TenantProfile[]>(`${environment.apiUrl}/admin/tenants/pending`);
  }

  adminTenants() {
    return this.http.get<TenantProfile[]>(`${environment.apiUrl}/admin/tenants`);
  }

  adminApproveTenant(id: string) {
    return this.http.post<TenantProfile>(`${environment.apiUrl}/admin/tenants/${id}/approve`, {});
  }

  adminSuspendTenant(id: string) {
    return this.http.post<TenantProfile>(`${environment.apiUrl}/admin/tenants/${id}/suspend`, {});
  }
}
