import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { TipoLavadoCard } from '../tipo-lavado-card/tipo-lavado-card';

@Component({
  selector: 'app-solicitar-lavado',
  imports: [Navbar, TipoLavadoCard],
  templateUrl: './solicitar-lavado.html',
  styleUrl: './solicitar-lavado.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Revisa si hubo algun cambio en los datos dinamicos en el html y lo actualiza
})
export class SolicitarLavado {}
