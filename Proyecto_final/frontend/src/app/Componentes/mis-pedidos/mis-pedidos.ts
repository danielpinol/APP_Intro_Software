import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Navbar } from '../navbar/navbar';

// Define la estructura de un pedido
type Pedido = { nombre: string; placa: string; tipo: string; estado: string };

@Component({
  selector: 'app-mis-pedidos',
  imports: [Navbar],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Revisa si hubo algun cambio en los datos dinamicos en el html y lo actualiza
})


export class MisPedidos {
  private pedidos = [
    { nombre: 'Daniel', placa: 'P069CPP', tipo: 'Premium', estado: 'Finalizado' },
    { nombre: 'Alex', placa: 'P601KPB', tipo: 'Medium',  estado: 'En proceso' },
    { nombre: 'Maria',  placa: 'P302YSJ', tipo: 'Básico',  estado: 'Recibido'   },
  ];
  // Mini base de datos

  pasos = ['Recibido', 'En proceso', 'Finalizado'];

  pedidoEncontrado = signal<Pedido | null>(null);
  // signal es una variable inteligente, cuando cambia la pantalla se actualiza sola. Pedido | null significa que puede tener un pedido o estar vacio
  buscado = signal(false); // Controla si el usuario ya presiono buscar o no

  buscar(nombre: string) {
    const found = this.pedidos.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
    // Busca si esta el nombre adentro de pedidos

    this.pedidoEncontrado.set(found ?? null);
    // Guarda el resultado

    this.buscado.set(true);
    // Marca que ya hizo la busqueda
  }

  pasoIndex(): number {
    return this.pasos.indexOf(this.pedidoEncontrado()?.estado ?? '');
  }
}
// Pasoindex convierte texto a numeros entonces recibido = 0 ...
