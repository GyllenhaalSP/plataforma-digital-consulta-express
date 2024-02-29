import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    datosCompletos: any = {};

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.adminService.obtenerDatosCompletos().subscribe(datos => {
            this.datosCompletos = datos;
        });
    }

}
