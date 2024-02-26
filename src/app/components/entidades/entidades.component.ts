import { Component, OnInit } from '@angular/core';
import { EntidadService } from '../../services/entidad.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-entidades',
    templateUrl: './entidades.component.html',
    styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {
    aportaciones: any[] = [];

    constructor(
        private entidadService: EntidadService,
        protected authService: AuthService
    ) { }

    ngOnInit(): void {
        const nombreEntidad = this.authService.getUserData("nombre");
        this.entidadService.getAportacionesPorEntidad(nombreEntidad).subscribe((data: any[]) => {
            this.aportaciones = data;
        });
    }

    protected readonly AuthService = AuthService;
}

