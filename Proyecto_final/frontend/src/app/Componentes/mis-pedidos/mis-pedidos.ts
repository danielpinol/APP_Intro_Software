import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { EstadoPedidoPipe } from '../../Pipes/estado-pedido.pipe';

@Component({
  selector: 'app-mis-pedidos',
  imports: [Navbar, EstadoPedidoPipe],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css'
})
export class MisPedidos implements OnInit {
  private http = inject(HttpClient);

  pedidos: any[] = [];
  pedidoEncontrado: any = null;
  buscado = false;

  // Los pasos del estado en orden
  pasos = ['Recibido', 'En proceso', 'Finalizado'];

  // ngOnInit se ejecuta automáticamente cuando el componente carga en pantalla
  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/pedidos').subscribe(data => {
      this.pedidos = data;
    });
  }

  // Busca un pedido por nombre dentro del array de pedidos
  buscar(nombre: string) {
    this.pedidoEncontrado = this.pedidos.find(
      p => p.nombre.toLowerCase() === nombre.toLowerCase()
    ) ?? null;
    this.buscado = true;
  }

  // Devuelve en qué paso está el pedido (0 = Recibido, 1 = En proceso, 2 = Finalizado)
  pasoIndex(): number {
    return this.pasos.indexOf(this.pedidoEncontrado?.estado ?? '');
  }
}
