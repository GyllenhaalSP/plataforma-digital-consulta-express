import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

    isLoggedIn(): boolean {
        const token = localStorage.getItem('token');
        return !!token;
    }

    getUser(): string | null {
        return localStorage.getItem('user');
    }

    getUserData(param: string) {
        if (!this.getUser()) {
            return 'null??';
        }
        switch (param) {
            case 'nombre':
                return JSON.parse(this.getUser()!).nombre;
            case 'apellidos':
                return JSON.parse(this.getUser()!).apellidos;
            case 'dni':
                return JSON.parse(this.getUser()!).dni;
            case 'email':
                return JSON.parse(this.getUser()!).email;
            case 'role':
                return JSON.parse(this.getUser()!).role;
            default:
                return 'wow, default!';
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
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }
}
