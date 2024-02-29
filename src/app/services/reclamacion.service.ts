import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ReclamacionesService {

    constructor(private http: HttpClient) { }

    enviarReclamacion(reclamacionData: any) {
        return this.http.post('/api/reclamaciones', reclamacionData);
    }
}
