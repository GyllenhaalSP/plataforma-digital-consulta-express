import { Component, OnInit } from '@angular/core';
import { CiudadanoService } from '../../services/ciudadano.service';

@Component({
    selector: 'app-ciudadano',
    templateUrl: './ciudadanos.component.html',
    styleUrls: ['./ciudadanos.component.scss']
})
export class CiudadanosComponent implements OnInit {
    aportaciones: any[] = [];

    constructor(private ciudadanoService: CiudadanoService) {}

    ngOnInit(): void {
        this.ciudadanoService.obtenerAportacionesCiudadano()
            .subscribe(aportaciones => {
                this.aportaciones = aportaciones;
        });
    }
}
