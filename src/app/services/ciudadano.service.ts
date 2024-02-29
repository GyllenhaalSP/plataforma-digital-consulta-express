import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CiudadanoService {

    constructor(private http: HttpClient, private authService: AuthService) {}

    obtenerAportacionesCiudadano(): Observable<any[]> {
        return this.http.get<any[]>(`/api/ciudadanos/${this.authService.getUserData('id')}`);
    }
}
