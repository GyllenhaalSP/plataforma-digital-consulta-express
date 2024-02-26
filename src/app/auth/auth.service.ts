import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private authUrl = 'http://localhost:3000/auth';

    constructor(private http: HttpClient) {
    }

    login(credentials: { username: string, password: string }): Observable<any> {
        return this.http.post(`${this.authUrl}/login`, credentials).pipe(
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