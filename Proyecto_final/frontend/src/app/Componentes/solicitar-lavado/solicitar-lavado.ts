import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-solicitar-lavado',
  imports: [Navbar],
  templateUrl: './solicitar-lavado.html',
  styleUrl: './solicitar-lavado.css'
})
export class SolicitarLavado {
  private http = inject(HttpClient); // HttpClient para mandar el pedido al backend

  // Lista de tipos de lavado disponibles con su precio
  tipos = [
    { nombre: 'Básico',   precio: 65  },
    { nombre: 'Medium',   precio: 110 },
    { nombre: 'Premium',  precio: 170 },
  ];

  // El tipo que el usuario seleccionó — empieza en Básico por defecto
  tipoSeleccionado = this.tipos[0];

  // Actualiza cuál tipo está seleccionado cuando el usuario hace click en uno de los botones
  seleccionar(tipo: any) {
    this.tipoSeleccionado = tipo;
  }

  // Recibimos los valores de los inputs directamente desde el HTML con .value
  enviar(nombre: string, marca: string, modelo: string, anio: string, placa: string) {
    this.http.post('http://localhost:3000/api/pedidos', {
      nombre, marca, modelo, anio, placa,
      tipo: this.tipoSeleccionado.nombre,   // Tipo del paquete seleccionado
      precio: this.tipoSeleccionado.precio  // Precio correspondiente al tipo
    }).subscribe({
      next: () => alert('Pedido enviado correctamente!'),
      error: () => alert('Error al enviar pedido')
    });
  }
}
