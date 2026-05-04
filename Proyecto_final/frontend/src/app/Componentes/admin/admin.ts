import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Component({
  selector: 'app-admin',
  imports: [],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private http = inject(HttpClient);
  // ChangeDetectorRef le avisa a Angular que actualice la pantalla después de recibir datos del backend
  private cdr = inject(ChangeDetectorRef);

  pedidos: any[] = [];

  get totalPedidos() {
    return this.pedidos.length;
  }

  get totalGenerado() {
    return this.pedidos.reduce((suma, p) => suma + (p.precio || 0), 0);
  }

  ngOnInit() {
    this.http.get<any[]>('http://localhost:3001/api/pedidos').subscribe(data => {
      this.pedidos = data;
      this.cdr.markForCheck(); // Forzamos que Angular actualice la pantalla con los pedidos
    });
  }

  cambiarEstado(id: number, estado: string) {
    this.http.patch(`http://localhost:3001/api/pedidos/${id}`, { estado }).subscribe(() => {
      const pedido = this.pedidos.find(p => p.id === id);
      if (pedido) pedido.estado = estado;
      this.cdr.markForCheck();
    });
  }

  eliminar(id: number) {
    this.http.delete(`http://localhost:3001/api/pedidos/${id}`).subscribe(() => {
      this.pedidos = this.pedidos.filter(p => p.id !== id);
      this.cdr.markForCheck();
    });
  }
}
