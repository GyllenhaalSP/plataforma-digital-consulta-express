import { Component, OnInit } from '@angular/core';
import { EntidadService } from '../../services/entidad.service';
import { AuthService } from '../../auth/auth.service';

interface Aportacion {
    nombre: string;
    apellidos: string;
    promotor: string;
    entidadFinanciera: string;
    cantidadTotal: number;
    mes: string;
    aportacionesMensuales: number;
}

interface AportacionAgrupada {
    mes: string;
    aportaciones: Aportacion[];
}

@Component({
    selector: 'app-entidades',
    templateUrl: './entidades.component.html',
    styleUrls: ['./entidades.component.scss']
})
export class EntidadesComponent implements OnInit {
    aportacionesAgrupadas: AportacionAgrupada[] = [];
    nombreEntidad: string = this.authService.getUserData('nombre');

    constructor(private entidadService: EntidadService, protected authService: AuthService) { }

    ngOnInit(): void {
        this.entidadService.getAportacionesPorEntidad(this.nombreEntidad).subscribe(aportaciones => {
            this.aportacionesAgrupadas = this.agruparAportacionesPorMes(aportaciones);
        });
    }

    private agruparAportacionesPorMes(aportaciones: Aportacion[]): AportacionAgrupada[] {
        const grupos: { [mes: string]: Aportacion[] } = {};
        aportaciones.forEach(aportacion => {
            const mes = aportacion.mes;
            if (!grupos[mes]) {
                grupos[mes] = [];
            }
            grupos[mes].push(aportacion);
        });
        return Object.keys(grupos).map(mes => ({
            mes: mes,
            aportaciones: grupos[mes]
        }));
    }
}

