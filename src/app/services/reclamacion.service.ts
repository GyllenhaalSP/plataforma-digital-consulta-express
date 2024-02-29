import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReclamacionesService {

    constructor(private http: HttpClient) { }

    enviarReclamacion(reclamacionData: any): Observable<any> {
        return this.http.post('/api/reclamaciones', reclamacionData);
    }
}
