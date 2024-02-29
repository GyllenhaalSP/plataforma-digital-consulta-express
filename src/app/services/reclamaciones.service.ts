import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReclamacionesService {

    constructor(private http: HttpClient) { }

    getReclamaciones(): Observable<any[]> {
        return this.http.get<any[]>('/api/ver-reclamaciones');
    }
}
