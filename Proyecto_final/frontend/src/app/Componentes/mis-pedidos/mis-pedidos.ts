import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Navbar } from '../navbar/navbar';
import { EstadoPedidoPipe } from '../../Pipes/estado-pedido.pipe';


// Data del pedido 
type Pedido = {
  id: number;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  tipo: string;
  precio: number;
  estado: string;
  fecha: string;
};


@Component({
  selector: 'app-mis-pedidos',
  standalone: true, // indica que este componente es independiente
  imports: [Navbar, EstadoPedidoPipe, HttpClientModule],
  templateUrl: './mis-pedidos.html',
  styleUrl: './mis-pedidos.css', 

  // OnPush mejora rendimiento (solo actualiza cuando hay cambios controlados)
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class MisPedidos implements OnInit {

  // Aquí guardamos todos los pedidos que vienen del backend
  // signal = variable reactiva (cuando cambia, la vista se actualiza)
  pedidos = signal<Pedido[]>([]);

  // Pasos del estado del pedido 
  pasos = ['Recibido', 'En proceso', 'Finalizado'];

  // Aquí guardamos el pedido que el usuario busca
  // Puede ser un pedido o null si no encuentra nada
  pedidoEncontrado = signal<Pedido | null>(null);

  // Variable para saber si ya se hizo una búsqueda
  buscado = signal(false);

  // Inyección del servicio HttpClient para hacer requests al backend
  constructor(private http: HttpClient) {}


  // ngOnInit se ejecuta automáticamente cuando el componente carga
  ngOnInit() {

    // Hace una petición GET al backend para obtener los pedidos
    this.http.get<Pedido[]>('http://localhost:3000/api/pedidos')
      .subscribe(data => {

        // Guardamos los datos en el signal pedidos
        // Esto actualiza automáticamente la vista
        this.pedidos.set(data);
      });
  }


  // Función para buscar un pedido por nombre
  buscar(nombre: string) {

    // Busca dentro del array de pedidos (convertido desde signal)
    const found = this.pedidos().find(
      p => p.nombre.toLowerCase() === nombre.toLowerCase()
    );

    this.pedidoEncontrado.set(found ?? null); // Guarda el resultado (si no encuentra, guarda null)

    // Marca que ya se realizó una búsqueda
    this.buscado.set(true);
  }


  // Convierte el estado del pedido en un índice numérico
  // Ejemplo: "Recibido" → 0, "En proceso" → 1, "Finalizado" → 2
  pasoIndex(): number {

    return this.pasos.indexOf(this.pedidoEncontrado()?.estado ?? '');
  }
}