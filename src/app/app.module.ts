import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CargaInformacionComponent} from './carga-informacion/carga-informacion.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AuthRoutingModule} from './auth/auth-routing.module';
import {NavComponent} from './components/nav/nav.component';
import {FooterComponent} from './components/footer/footer.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EntidadesComponent } from './components/entidades/entidades.component';
import { BienvenidaComponent } from './components/bienvenida/bienvenida.component';
import { CiudadanosComponent } from './components/ciudadanos/ciudadanos.component';
import { PromotoresComponent } from './components/promotores/promotores.component';
import { AdminComponent } from './components/admin/admin.component';
import { ReclamacionesComponent } from './components/reclamacion/reclamaciones.component';

@NgModule({
    declarations: [
        AppComponent,
        CargaInformacionComponent,
        NavComponent,
        FooterComponent,
        EntidadesComponent,
        BienvenidaComponent,
        CiudadanosComponent,
        PromotoresComponent,
        AdminComponent,
        ReclamacionesComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AuthRoutingModule,
        AppRoutingModule
    ],
    providers: [
    provideAnimationsAsync()
  ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
