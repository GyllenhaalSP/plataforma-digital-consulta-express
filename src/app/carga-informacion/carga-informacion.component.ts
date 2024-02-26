import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
    selector: 'app-carga-informacion',
    templateUrl: './carga-informacion.component.html',
    styleUrls: ['./carga-informacion.component.scss']
})
export class CargaInformacionComponent {
    selectedFile!: File;

    constructor(private http: HttpClient) {}

    fileSelected(event: any) {
        this.selectedFile = event.target.files[0];
    }

    uploadFile() {
        const formData = new FormData();
        formData.append('file', this.selectedFile, this.selectedFile.name);

        this.http.post('/api/cargar-informacion', formData).subscribe(
            (response) => console.log('Carga exitosa', response),
            (error) => console.error('Error en la carga', error)
        );
    }
}
