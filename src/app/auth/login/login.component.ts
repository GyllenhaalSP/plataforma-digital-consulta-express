import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../auth.service';
import {Router} from '@angular/router';
import {dniValidator} from '../register/register.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;

    constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            dni: ['', Validators.required, dniValidator()],
            password: ['', Validators.required]
        });
    }

    login() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: (response: any) => {
                    console.log('Inicio de sesión exitoso', response);
                    localStorage.setItem('token', response.token); // Almacena el token en el almacenamiento local
                    this.router.navigate(['/']); // Redirige al usuario a la página de inicio o dashboard
                },
                error: (error) => {
                    console.error('Error en el inicio de sesión', error);
                    // Aquí puedes manejar errores, como mostrar un mensaje al usuario
                }
            });
        }
    }

}
