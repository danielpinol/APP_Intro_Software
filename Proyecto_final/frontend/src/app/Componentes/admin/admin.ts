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
  // inject() es la forma moderna de obtener servicios en Angular (reemplaza al constructor)
  private http = inject(HttpClient);       // HttpClient hace las peticiones al backend (GET, PATCH, DELETE)
  private cdr = inject(ChangeDetectorRef); // Le avisa a Angular que revise los cambios en pantalla después de una respuesta async

  pedidos: any[] = []; // Array donde guardamos todos los pedidos que vienen del backend

  // get = propiedad calculada — se recalcula sola cada vez que 'pedidos' cambia
  get totalPedidos() {
    return this.pedidos.length;
  }

  get totalGenerado() {
    // reduce() suma todos los precios: empieza en 0 y va acumulando (suma + precio de cada pedido)
    return this.pedidos.reduce((suma, p) => suma + (p.precio || 0), 0);
  }

  // ngOnInit corre automáticamente cuando el componente aparece en pantalla
  ngOnInit() {
    this.http.get<any[]>('http://localhost:3001/api/pedidos').subscribe(data => {
      this.pedidos = data;
      this.cdr.markForCheck(); // Necesario porque Angular no detecta cambios automáticos dentro de subscribe()
    });
  }

  // Cambia el estado de un pedido (Recibido → En proceso → Finalizado)
  cambiarEstado(id: number, estado: string) {
    // PATCH actualiza solo un campo — no necesitamos mandar todo el pedido completo
    this.http.patch(`http://localhost:3001/api/pedidos/${id}`, { estado }).subscribe(() => {
      const pedido = this.pedidos.find(p => p.id === id); // Buscamos el pedido en el array local
      if (pedido) pedido.estado = estado; // Lo actualizamos localmente para no tener que recargar todo
      this.cdr.markForCheck();
    });
  }

  // Elimina un pedido de la lista
  eliminar(id: number) {
    this.http.delete(`http://localhost:3001/api/pedidos/${id}`).subscribe(() => {
      // filter() crea un array nuevo que excluye el pedido eliminado
      this.pedidos = this.pedidos.filter(p => p.id !== id);
      this.cdr.markForCheck();
    });
  }
}
