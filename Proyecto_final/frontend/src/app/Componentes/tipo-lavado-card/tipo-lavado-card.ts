import { Component, input } from '@angular/core';

@Component({
  selector: 'app-tipo-lavado-card',
  imports: [],
  templateUrl: './tipo-lavado-card.html',
  styleUrl: './tipo-lavado-card.css'
})
export class TipoLavadoCard {
  // input() recibe datos desde el componente padre (solicitar-lavado)
  nombre = input.required<string>();
  precio = input.required<number>();
}
