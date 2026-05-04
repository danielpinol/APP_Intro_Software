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
  private http = inject(HttpClient);

  // Tipos de lavado con su precio
  tipos = [
    { nombre: 'Básico',   precio: 65  },
    { nombre: 'Medium',   precio: 110 },
    { nombre: 'Premium',  precio: 170 },
  ];

  // Guardamos el tipo seleccionado por el usuario
  tipoSeleccionado = this.tipos[0];

  seleccionar(tipo: any) {
    this.tipoSeleccionado = tipo;
  }

  enviar(nombre: string, marca: string, modelo: string, anio: string, placa: string) {
    this.http.post('http://localhost:3000/api/pedidos', {
      nombre, marca, modelo, anio, placa,
      tipo: this.tipoSeleccionado.nombre,
      precio: this.tipoSeleccionado.precio
    }).subscribe({
      next: () => alert('Pedido enviado correctamente!'),
      error: () => alert('Error al enviar pedido')
    });
  }
}
