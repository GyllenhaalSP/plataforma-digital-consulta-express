import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclamacionesService } from '../../services/reclamacion.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-reclamaciones',
    templateUrl: './reclamaciones.component.html',
    styleUrls: ['./reclamaciones.component.scss']
})
export class ReclamacionesComponent implements OnInit {
    reclamacionForm!: FormGroup;

    constructor(private fb: FormBuilder, private reclamacionesService: ReclamacionesService, private snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.reclamacionForm = this.fb.group({
            nombre: ['', Validators.required],
            apellidos: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            tipo: ['', Validators.required],
            descripcion: ['', Validators.required],
        });
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
}
