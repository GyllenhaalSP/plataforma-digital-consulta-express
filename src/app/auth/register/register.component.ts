import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {AuthService} from '../auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Router} from '@angular/router';

function dniValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        const value = control.value;
        const dniRegex = /^[XYZ]?\d{5,8}[A-Z]$/i;
        const validDni = dniRegex.test(value) && checkDniLetter(value);
        return validDni ? null : {'invalidDni': {value}};
    };
}

function checkDniLetter(dni: string): boolean {
    const letterValue = parseInt(dni.substring(0, dni.length - 1)) % 23;
    const letter = 'TRWAGMYFPDXBNJZSQVHLCKET'[letterValue];
    return dni.endsWith(letter);
}

function passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const passwordValidation = control.get('passwordValidation');

    if (password && passwordValidation && password.value !== passwordValidation.value) {
        return {'passwordsMismatch': true};
    }
    return null;
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private snackBar: MatSnackBar,
    ) {}

    ngOnInit(): void {
        this.registerForm = this.formBuilder.group({
            dni: ['', [Validators.required, dniValidator()]],
            nombre: ['', [Validators.required, Validators.minLength(3)]],
            apellidos: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            passwordValidation: ['', [Validators.required, Validators.minLength(8)]],
        }, {validators: passwordsMatchValidator});
    }

    onRegister(): void {
        if (this.registerForm.valid) {

            const userData = {
                dni: this.registerForm.value.dni,
                nombre: this.registerForm.value.nombre,
                apellidos: this.registerForm.value.apellidos,
                email: this.registerForm.value.email,
                password: this.registerForm.value.password,
            };

            this.authService.register(userData).subscribe({
                next: (response) => {
                    this.snackBar.open('Registro exitoso', 'Cerrar', { duration: 2000 });
                    setTimeout(() => this.router.navigate(['/login']), 2000);
                },
                error: (error) => {
                    console.error('Error en el registro', error);
                    this.snackBar.open('Error en el registro. Por favor, inténtalo de nuevo.', 'Cerrar', { duration: 3000 });
                }
            });
        }
    }
}
