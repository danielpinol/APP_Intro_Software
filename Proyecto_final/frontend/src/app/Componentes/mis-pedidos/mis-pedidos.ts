import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  // ChangeDetectorRef le avisa a Angular que actualice la pantalla después de recibir datos del backend
  private cdr = inject(ChangeDetectorRef);

  pedidos: any[] = [];
  pedidoEncontrado: any = null;
  buscado = false;

  pasos = ['Recibido', 'En proceso', 'Finalizado'];

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3000/api/pedidos').subscribe(data => {
      this.pedidos = data;
      this.cdr.markForCheck(); // Forzamos que Angular actualice la pantalla con los pedidos
    });
  }

  buscar(nombre: string) {
    this.pedidoEncontrado = this.pedidos.find(
      p => p.nombre.toLowerCase() === nombre.toLowerCase()
    ) ?? null;
    this.buscado = true;
    this.cdr.markForCheck();
  }

  pasoIndex(): number {
    return this.pasos.indexOf(this.pedidoEncontrado?.estado ?? '');
  }
}
