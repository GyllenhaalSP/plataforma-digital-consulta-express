import {Component} from '@angular/core';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss'
})
export class NavComponent {

    logout() {
        // Aquí deberías llamar a un servicio que cierre la sesión del usuario
    }
}
