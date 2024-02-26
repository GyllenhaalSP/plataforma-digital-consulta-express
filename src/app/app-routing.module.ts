import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CargaInformacionComponent} from './carga-informacion/carga-informacion.component';

const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
    },
    {path: 'ci', component: CargaInformacionComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

