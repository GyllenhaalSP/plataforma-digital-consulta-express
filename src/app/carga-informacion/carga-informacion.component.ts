import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector: 'app-carga-informacion',
    templateUrl: './carga-informacion.component.html',
    styleUrls: ['./carga-informacion.component.scss']
})
export class CargaInformacionComponent {
    selectedFile: File | null = null;
    errorMessage: string | null = null;

    constructor(private http: HttpClient, private router: Router) {}

    fileSelected(event: any): void {
        this.selectedFile = event.target.files[0];
    }

    uploadFile(): void {
        if (!this.selectedFile) {
            return;
        }
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);

        try {
            this.http.post('/api/cargar-informacion', formData).subscribe({
                next: (response) => {
                    console.log('Carga completada', response);
                    this.router.navigate(['/entidad']);
                    this.errorMessage = "Todo correcto";
                },
                error: (error) => {
                    console.error('Error en la carga', error);
                    this.errorMessage = error.error;
                }
            });
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
            this.errorMessage = 'Error al realizar la solicitud';
        }
    }
}

