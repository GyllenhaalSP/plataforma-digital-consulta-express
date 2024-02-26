import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) {
    }

    register(userData: any) {
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    login(userData: any) {
        return this.http.post(`${this.apiUrl}/login`, userData);
    }


    // Implementa más funciones según sea necesario, como registro, logout, etc.
    isLoggedIn() {
        return false;
    }
}
