import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {DataService} from '../data.service';

@Component({
    selector: 'app-carga-informacion',
    templateUrl: './carga-informacion.component.html',
    styleUrls: ['./carga-informacion.component.scss']
})
export class CargaInformacionComponent implements OnInit {
    cargaForm!: FormGroup;

    constructor(private fb: FormBuilder, private dataService: DataService) {
    }

    ngOnInit(): void {
        this.cargaForm = this.fb.group({
            nombre: [''],
            apellido: [''],
            promotor: [''],
            entidadFinanciera: [''],
            cantidadTotalAportacionesMensuales: [''],
            aportacionesMensuales: ['']
        });
    }

    onSubmit() {
        this.dataService.cargarInformacion(this.cargaForm.value).subscribe({
            next: (response) => console.log(response),
            error: (error) => console.error(error)
        });
    }
}
