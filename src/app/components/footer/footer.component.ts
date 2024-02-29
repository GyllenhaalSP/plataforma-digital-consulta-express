import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <br><footer>
            <p>PDCE 2024 - Todos los derechos reservados</p>
        </footer>
    `,
    styles: `
        footer {
            background-color: #333;
            color: white;
            padding: 20px;
            text-align: center;
            width: 100%;
            position: relative;
            bottom: 0;
        }
    `
})
export class FooterComponent {

}
