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

    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap(_ => console.log('login successful')),
            catchError(error => {
                console.error('login error', error);
                return of(null);
            })
        );
    }

    // Implementa más funciones según sea necesario, como registro, logout, etc.
    isLoggedIn() {
        return false;
    }
}
