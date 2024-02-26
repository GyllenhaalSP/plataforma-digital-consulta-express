import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';

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

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    getUserData(param: string) {
        const token = this.getToken();
        if (!token) return null;

        try {
            const decodedToken: Record<string, any> = jwtDecode(token);
            return decodedToken[param];
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    isAdmin(): boolean {
        return this.getUserData('role') === 'admin';
    }

    isEntidad(): boolean {
        return this.getUserData('role') === 'entidad';
    }

    isUsuario(): boolean {
        return this.getUserData('role') === 'usuario';
    }

    isProveedor(): boolean {
        return this.getUserData('role') === 'proveedor';
    }

    logout() {
        localStorage.removeItem('token');
    }
}
