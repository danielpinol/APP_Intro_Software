import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-solicitar-lavado',
  imports: [Navbar],
  templateUrl: './solicitar-lavado.html',
  styleUrl: './solicitar-lavado.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Revisa si hubo algun cambio en los datos dinamicos en el html y lo actualiza
})
export class SolicitarLavado {}
