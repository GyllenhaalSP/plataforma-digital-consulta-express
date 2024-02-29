import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CargaInformacionComponent} from './carga-informacion/carga-informacion.component';
import {hasRoleGuard} from './auth/auth.guard';
import {EntidadesComponent} from './components/entidades/entidades.component';
import {CiudadanosComponent} from './components/ciudadanos/ciudadanos.component';
import {PromotoresComponent} from './components/promotores/promotores.component';
import {AdminComponent} from './components/admin/admin.component';
import {ReclamacionesComponent} from './components/reclamacion/reclamaciones.component';
import {VerReclamacionesComponent} from './components/ver-reclamaciones/ver-reclamaciones.component';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {
        path: 'carga-info',
        canActivate: [hasRoleGuard(['entidad'])],
        component: CargaInformacionComponent
    },
    {
        path: 'entidad',
        canActivate: [hasRoleGuard(['entidad'])],
        component: EntidadesComponent
    },
    {
        path: 'ciudadano',
        canActivate: [hasRoleGuard(['user'])],
        component: CiudadanosComponent
    },
    {
        path: 'promotor',
        canActivate: [hasRoleGuard(['promotor'])],
        component: PromotoresComponent
    },
    {
        path: 'admin',
        canActivate: [hasRoleGuard(['admin'])],
        component: AdminComponent
    },
    {
        path: 'reclamaciones',
        component: ReclamacionesComponent
    },
    {
        path: 'ver-reclamaciones',
        canActivate: [hasRoleGuard(['admin'])],
        component: VerReclamacionesComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

