import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CargaInformacionComponent} from './carga-informacion/carga-informacion.component';
import {hasRoleGuard} from './auth/auth.guard';
import {EntidadesComponent} from './components/entidades/entidades.component';

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
/*        canActivate: [hasRoleGuard(['entidad'])],*/
        component: EntidadesComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

