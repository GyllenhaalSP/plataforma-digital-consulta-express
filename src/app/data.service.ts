import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    constructor(private http: HttpClient) { }

    cargarInformacion(data: any) {
        return this.http.post('http://localhost:3000/api/cargar-informacion', data);
    }
}
