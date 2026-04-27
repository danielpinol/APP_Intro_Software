import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-paquetes',
  imports: [Navbar, CurrencyPipe],
  templateUrl: './paquetes.html',
  styleUrl: './paquetes.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Revisa si hubo algun cambio en los datos dinamicos en el html y lo actualiza
})
export class Paquetes {
  paquetes = [
    { nombre: 'Starter',   lavados: 4,  precio: 220,  ahorro: 40  },
    { nombre: 'Frecuente', lavados: 8,  precio: 400,  ahorro: 120 },
    { nombre: 'Pro',       lavados: 15, precio: 720,  ahorro: 160 },
    { nombre: 'Élite',     lavados: 20, precio: 1400, ahorro: 300 },
  ];
}
