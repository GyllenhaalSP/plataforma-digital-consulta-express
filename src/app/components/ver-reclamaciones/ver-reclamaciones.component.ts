import { Component, OnInit } from '@angular/core';
import { ReclamacionesService } from '../../services/reclamaciones.service';

@Component({
    selector: 'app-ver-reclamaciones',
    templateUrl: './ver-reclamaciones.component.html',
    styleUrls: ['./ver-reclamaciones.component.scss']
})
export class VerReclamacionesComponent implements OnInit {
    reclamaciones: any[] = [];

    constructor(private reclamacionesService: ReclamacionesService) { }

    ngOnInit(): void {
        this.reclamacionesService.getReclamaciones().subscribe({
            next: (data) => this.reclamaciones = data,
            error: (e) => console.error(e)
        });
    }
}
