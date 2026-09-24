import { Routes } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { VehicleDetailComponent } from './pages/vehicle-detail/vehicle-detail.component';
import { DealerProfileComponent } from './pages/dealer-profile/dealer-profile.component';
import { PanelLoginComponent } from './pages/panel-login/panel-login.component';
import { PanelHomeComponent } from './pages/panel-home/panel-home.component';
import { PanelAdminComponent } from './pages/panel-admin/panel-admin.component';
import { platformAdminGuard, tenantPanelGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'aviso/:id', component: VehicleDetailComponent },
  { path: 'c/:slug', component: DealerProfileComponent },
  { path: 'panel/login', component: PanelLoginComponent },
  { path: 'panel/admin', component: PanelAdminComponent, canActivate: [platformAdminGuard] },
  { path: 'panel', component: PanelHomeComponent, canActivate: [tenantPanelGuard] },
  { path: '**', redirectTo: '' }
];
