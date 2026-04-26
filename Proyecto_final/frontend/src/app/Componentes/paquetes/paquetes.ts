import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-paquetes',
  imports: [Navbar, CurrencyPipe],
  templateUrl: './paquetes.html',
  styleUrl: './paquetes.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Paquetes {
  paquetes = [
    { nombre: 'Starter',   lavados: 4,  precio: 220,  ahorro: 40,  recomendado: false },
    { nombre: 'Frecuente', lavados: 8,  precio: 400,  ahorro: 120, recomendado: true  },
    { nombre: 'Pro',       lavados: 15,  precio: 720,  ahorro: 160, recomendado: false },
    { nombre: 'Élite',     lavados: 20, precio: 1400, ahorro: 300, recomendado: false },
  ];
}
