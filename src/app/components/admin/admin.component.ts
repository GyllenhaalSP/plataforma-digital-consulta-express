import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
    todosLosDatos: any;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.adminService.obtenerTodosLosDatos().subscribe(datos => {
            this.todosLosDatos = datos;
        });
    }
}
