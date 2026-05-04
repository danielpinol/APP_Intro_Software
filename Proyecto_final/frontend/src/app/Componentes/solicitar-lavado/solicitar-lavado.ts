import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { TipoLavadoCard } from '../tipo-lavado-card/tipo-lavado-card';

@Component({
  selector: 'app-solicitar-lavado',
  imports: [Navbar, TipoLavadoCard],
  templateUrl: './solicitar-lavado.html',
  styleUrl: './solicitar-lavado.css'
})
export class SolicitarLavado {
  private http = inject(HttpClient);

  // Recibimos los valores directamente desde los inputs del HTML
  enviar(nombre: string, marca: string, modelo: string, anio: string, placa: string) {
    this.http.post('http://localhost:3000/api/pedidos', {
      nombre, marca, modelo, anio, placa
    }).subscribe({
      next: () => {
        alert('Pedido enviado correctamente!');
      },
      error: () => {
        alert('Error al enviar pedido');
      }
    });
  }
}
