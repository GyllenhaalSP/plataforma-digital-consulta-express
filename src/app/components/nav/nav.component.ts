import {Component} from '@angular/core';
import {AuthService} from '../../auth/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrl: './nav.component.scss'
})
export class NavComponent {

    nombreEntidad: string | null = this.authService.getUserData('nombre');

    constructor(public authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
        this.snackBar.open('Sesión cerrada', 'Cerrar', {
            duration: 3000,
            panelClass: ['mat-toolbar', 'mat-primary'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
        });
    }
}
