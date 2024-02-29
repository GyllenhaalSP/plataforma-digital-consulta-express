import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector: 'app-carga-informacion',
    templateUrl: './carga-informacion.component.html',
    styleUrls: ['./carga-informacion.component.scss']
})
export class CargaInformacionComponent {
    selectedFile: File | null = null;
    errorMessage: string | null = null;

    constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {}

    fileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            this.errorMessage = "No se ha seleccionado ningún archivo";
            return;
        }
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);

        this.http.post('/api/cargar-informacion', formData).subscribe({
            next: (response) => {
                this.router.navigate(['/entidad']);
                this.errorMessage = "Todo correcto";
                this.snackBar.open('Información subida correctamente', 'Cerrar', {
                    duration: 3000,
                    panelClass: ['mat-toolbar', 'mat-primary'],
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                });
            },
            error: (error) => {
                console.error('Error en la carga', error);
                this.errorMessage = error.error;
            }
        });
    }
}

