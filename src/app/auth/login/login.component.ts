import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {dniValidator} from '../register/register.component';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            dni: ['', [Validators.required, dniValidator()]],
            password: ['', Validators.required]
        });
    }

    login() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: (response: any) => {
                    console.log('Inicio de sesión exitoso', response);
                    localStorage.setItem('token', response.token);
                    this.router.navigate(['/']);
                    this.snackBar.open('Sesión iniciada', 'Cerrar', {
                        duration: 3000,
                        panelClass: ['mat-toolbar', 'mat-primary'],
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                },
                error: (error) => {
                    console.error('Error en el inicio de sesión', error);
                    this.snackBar.open('Error en el inicio de sesión: ' + error.error, 'Cerrar', {
                        duration: 3000,
                        panelClass: ['mat-toolbar', 'mat-error'],
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                }
            });
        }
    }

}
