import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReclamacionesService } from '../../services/reclamacion.service';

@Component({
    selector: 'app-reclamaciones',
    templateUrl: './reclamaciones.component.html',
    styleUrls: ['./reclamaciones.component.scss']
})
export class ReclamacionesComponent {
    reclamacionForm: FormGroup;

    constructor(private fb: FormBuilder, private reclamacionesService: ReclamacionesService) {
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
                next: (respuesta) => console.log(respuesta),
                error: (error) => console.error(error)
            });
        }
    }
}
