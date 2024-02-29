import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthService} from '../auth/auth.service';

@Injectable({
    providedIn: 'root',
})
export class PromotorService {

    constructor(private http: HttpClient, private authService: AuthService) {}

    obtenerPromotor(): Observable<any[]> {
        return this.http.get<any[]>(`/api/promotores/${this.authService.getUserData('nombre')}`);
    }
}
