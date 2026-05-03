import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-admin',
  imports: [Navbar],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Admin implements OnInit {
  private http = inject(HttpClient);
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
      this.cdr.markForCheck();
    });
  }

  cambiarEstado(id: number, estado: string) {
    this.http.patch(`http://localhost:3001/api/pedidos/${id}`, { estado }).subscribe(() => {
      const pedido = this.pedidos.find(p => p.id === id);
      if (pedido) pedido.estado = estado;
      this.cdr.markForCheck();
    });
  }
}
