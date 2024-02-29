import {Component} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss'
})
export class NavComponent {

    nombreEntidad: string | null = this.authService.getUserData('nombre');

    constructor(public authService: AuthService, private router: Router) {
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
