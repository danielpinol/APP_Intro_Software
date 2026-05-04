import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-admin',
  imports: [Navbar],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private http = inject(HttpClient);

  pedidos: any[] = [];

  // Calculamos el total de pedidos contando cuántos hay en el array
  get totalPedidos() {
    return this.pedidos.length;
  }

  // Sumamos el precio de cada pedido para saber cuánto dinero se generó
  get totalGenerado() {
    return this.pedidos.reduce((suma, p) => suma + (p.precio || 0), 0);
  }

  // ngOnInit se ejecuta automáticamente cuando el componente carga en pantalla
  ngOnInit() {
    this.http.get<any[]>('http://localhost:3001/api/pedidos').subscribe(data => {
      this.pedidos = data;
    });
  }

  cambiarEstado(id: number, estado: string) {
    // Mandamos al backend el nuevo estado del pedido
    this.http.patch(`http://localhost:3001/api/pedidos/${id}`, { estado }).subscribe(() => {
      // Buscamos el pedido en el array y le cambiamos el estado localmente
      const pedido = this.pedidos.find(p => p.id === id);
      if (pedido) pedido.estado = estado;
    });
  }

  eliminar(id: number) {
    // Mandamos al backend que elimine el pedido con ese id
    this.http.delete(`http://localhost:3001/api/pedidos/${id}`).subscribe(() => {
      // Lo quitamos del array para que desaparezca de la pantalla
      this.pedidos = this.pedidos.filter(p => p.id !== id);
    });
  }
}
