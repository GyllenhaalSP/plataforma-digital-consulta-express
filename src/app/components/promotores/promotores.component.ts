// src/app/components/promotores/promotores.component.ts
import { Component, OnInit } from '@angular/core';
import { PromotorService } from '../../services/promotor.service';

@Component({
    selector: 'app-promotores',
    templateUrl: './promotores.component.html',
    styleUrls: ['./promotores.component.scss'],
})
export class PromotoresComponent implements OnInit {
    aportaciones: any[] = [];

    constructor(private promotorService: PromotorService) {}

    ngOnInit(): void {
        this.promotorService.obtenerPromotor()
            .subscribe((aportaciones) => {
                this.aportaciones = aportaciones;
        });
    }
}
