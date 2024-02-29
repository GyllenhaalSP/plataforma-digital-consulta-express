import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {jwtDecode} from 'jwt-decode';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private http: HttpClient) {
    }

    register(userData: any) {
        return this.http.post(`api/register`, userData);
    }

    login(userData: any) {
        return this.http.post(`api/login`, userData);
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
        return this.getUserData('role') === 'user';
    }

    isProveedor(): boolean {
        return this.getUserData('role') === 'proveedor';
    }

    logout() {
        localStorage.removeItem('token');
    }
}
