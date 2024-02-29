import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclamacionesService } from '../../services/reclamacion.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../../auth/auth.service';

@Component({
    selector: 'app-reclamaciones',
    templateUrl: './reclamaciones.component.html',
    styleUrls: ['./reclamaciones.component.scss']
})
export class ReclamacionesComponent implements OnInit {
    reclamacionForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private reclamacionesService: ReclamacionesService,
        private snackBar: MatSnackBar,
        private authService: AuthService) {}

    ngOnInit(): void {
        const rol = this.authService.getUserData('rol');
        this.reclamacionForm = this.fb.group({
            nombre: ['', Validators.required],
            apellidos: ['', rol === 'user' ? Validators.required : Validators.nullValidator],
            email: ['', [Validators.required, Validators.email]],
            tipo: ['', Validators.required],
            descripcion: ['', Validators.required],
        });

        this.prefillForm();
    }

    enviarReclamacion(): void {
        if (this.reclamacionForm.valid) {
            this.reclamacionesService.enviarReclamacion(this.reclamacionForm.value).subscribe({
                next: (respuesta) => {
                    console.log(respuesta);
                    this.snackBar.open('Reclamación/Petición creada exitosamente', 'Cerrar', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                },
                error: (error) => {
                    console.error('Error al enviar la reclamación', error);
                    this.snackBar.open('Error al enviar la reclamación. Por favor, inténtalo de nuevo.', 'Cerrar', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top',
                    });
                }
            });
        }
    }

    private prefillForm() {
        const userData = {
            nombre: this.authService.getUserData("nombre"),
            apellidos: this.authService.getUserData("apellidos"),
            email: this.authService.getUserData("email")
        }

        if (userData) {
            this.reclamacionForm.patchValue({
                nombre: userData.nombre,
                apellidos: userData.apellidos,
                email: userData.email
            });
        }
    }
}
