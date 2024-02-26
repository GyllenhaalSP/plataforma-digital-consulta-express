import {Component} from '@angular/core';
import {AuthService} from './auth/auth.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent {
    constructor(public authService: AuthService) {
    }

    title = 'Plataforma Digital de Consulta';
    protected readonly localStorage = localStorage;
}
