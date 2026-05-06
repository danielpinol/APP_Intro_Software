import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common'; // CurrencyPipe formatea números como precios (ej: Q 220)
import { Navbar } from '../navbar/navbar';

// "type" define la forma exacta que debe tener un objeto paquete en toda la clase
// Así TypeScript nos avisa si intentamos usar un campo que no existe
type Paquete = { nombre: string; lavados: number; precio: number; ahorro: number };

@Component({
  selector: 'app-paquetes',
  imports: [Navbar, CurrencyPipe],
  templateUrl: './paquetes.html',
  styleUrl: './paquetes.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Solo actualiza la pantalla cuando un signal cambia — más eficiente
})
export class Paquetes {

  // "paquetes: Paquete[]" significa: esta variable es un array de objetos tipo Paquete
  // El [] al final indica que no es un solo Paquete, sino varios — sin [] TypeScript solo aceptaría uno
  // Así TypeScript nos avisa si accidentalmente ponemos un campo que no existe en el tipo Paquete
  paquetes: Paquete[] = [
    { nombre: 'Starter',   lavados: 4,  precio: 220,  ahorro: 40  },
    { nombre: 'Frecuente', lavados: 8,  precio: 400,  ahorro: 120 },
    { nombre: 'Pro',       lavados: 15, precio: 720,  ahorro: 160 },
    { nombre: 'Élite',     lavados: 20, precio: 1400, ahorro: 300 },
  ];

  // signal<Paquete | null> significa que puede ser un paquete o null
  // null = modal cerrado | con valor = modal abierto mostrando ese paquete
  seleccionado = signal<Paquete | null>(null);

  // signal(false) = empieza en false (no ha pagado)
  // Cuando el usuario hace clic en "Pagar" se pone en true y cambia lo que ve el modal
  suscrito = signal(false);

  // Se llama cuando el usuario hace clic en "Suscribirme" en alguna fila
  // Recibe el paquete de esa fila y lo guarda en el signal para mostrarlo en el modal
  abrir(paquete: Paquete) {
    this.seleccionado.set(paquete); // Guarda el paquete elegido y abre el modal
    this.suscrito.set(false);       // Resetea por si el usuario había pagado antes y vuelve a abrir
  }

  // Se llama cuando el usuario hace clic en "Pagar"
  // Solo cambia suscrito a true — el HTML detecta ese cambio y muestra el mensaje de éxito
  pagar() {
    this.suscrito.set(true);
  }

  // Se llama cuando el usuario hace clic en "Cancelar" o "Cerrar"
  // Poner seleccionado en null hace que el @if del HTML cierre el modal automáticamente
  cancelar() {
    this.seleccionado.set(null);
    this.suscrito.set(false);
  }
}
