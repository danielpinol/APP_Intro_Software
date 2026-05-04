import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-sign-up',
  imports: [Navbar, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  private http = inject(HttpClient);
  private router = inject(Router);

  mostrarPassword = false;
  mostrarConfirmar = false;
  error = '';

  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }
  toggleConfirmar() { this.mostrarConfirmar = !this.mostrarConfirmar; }

  // Recibimos los valores directamente desde los inputs del HTML
  registrar(nombre: string, usuario: string, gmail: string, telefono: string, password: string, confirmar: string) {

    // Validamos que las dos contraseñas sean iguales antes de enviar
    if (password !== confirmar) {
      this.error = 'Las contraseñas no coinciden';
      return; // Paramos aquí, no se crea la cuenta
    }

    this.error = '';

    // Mandamos los datos al backend con POST
    this.http.post('http://localhost:3000/api/registro', {
      nombre, usuario, gmail, telefono, password
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']); // Si todo salió bien, vamos al login
      },
      error: (err) => {
        this.error = err.error.error; // Mostramos el error que mandó el backend
      }
    });
  }
}
