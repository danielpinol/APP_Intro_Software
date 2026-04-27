import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-tipo-lavado-card',
  imports: [],
  templateUrl: './tipo-lavado-card.html',
  styleUrl: './tipo-lavado-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TipoLavadoCard {
  nombre = input.required<string>();
  precio = input.required<number>();
}
