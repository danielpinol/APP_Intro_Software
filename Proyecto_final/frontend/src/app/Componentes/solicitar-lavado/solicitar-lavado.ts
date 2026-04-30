import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { TipoLavadoCard } from '../tipo-lavado-card/tipo-lavado-card';

@Component({
  selector: 'app-solicitar-lavado',
  standalone: true, 
  imports: [FormsModule, Navbar, TipoLavadoCard, HttpClientModule], 
  templateUrl: './solicitar-lavado.html',
  styleUrl: './solicitar-lavado.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SolicitarLavado {

  form = {
    nombre: '',
    marca: '',
    modelo: '',
    anio: '',
    placa: ''
  };

constructor(private http: HttpClient) {}

enviar() {
  this.http.post('http://localhost:3000/api/pedidos', this.form)
    .subscribe({
      next: (res) => {
        console.log('Pedido guardado:', res);
        alert('Pedido enviado correctamente !');
      },
      error: (err) => {
        console.error(err);
        alert('Error al enviar pedido :(');
      }
    });
}

}