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
  // inject() es la forma moderna de obtener servicios en Angular (reemplaza al constructor)
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef); // Le avisa a Angular que revise los cambios en pantalla después de una respuesta async

  pedidos: any[] = [];          // Todos los pedidos que vienen del backend
  pedidoEncontrado: any = null; // El pedido que buscó el usuario (null = no encontrado todavía)
  buscado = false;              // Se vuelve true después de que el usuario hace una búsqueda

  // Los 3 pasos del proceso — se usan para mostrar el tracker visual con los círculos numerados
  pasos = ['Recibido', 'En proceso', 'Finalizado'];

  // ngOnInit corre automáticamente cuando el componente aparece en pantalla
  ngOnInit() {
    this.http.get<any[]>('https://uwash-backend.vercel.app/api/pedidos').subscribe(data => {
      this.pedidos = data;
      this.cdr.markForCheck(); // Necesario porque Angular no detecta cambios automáticos dentro de subscribe()
    });
  }

  // Busca un pedido por nombre del cliente
  buscar(nombre: string) {
    // find() devuelve el primer pedido que coincida con el nombre
    // ?? null convierte undefined a null si find() no encuentra nada
    this.pedidoEncontrado = this.pedidos.find(
      p => p.nombre.toLowerCase() === nombre.toLowerCase() // toLowerCase hace la búsqueda sin importar mayúsculas
    ) ?? null;
    this.buscado = true;
    this.cdr.markForCheck();
  }

  // Devuelve en qué paso (posición) está el pedido: 0=Recibido, 1=En proceso, 2=Finalizado
  pasoIndex(): number {
    // ?. (optional chaining) evita un error si pedidoEncontrado es null — devuelve undefined en vez de crashear
    // ?? '' pone texto vacío si el estado es undefined, para que indexOf() devuelva -1 sin error
    return this.pasos.indexOf(this.pedidoEncontrado?.estado ?? '');
  }
}
