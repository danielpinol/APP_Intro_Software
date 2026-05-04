import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-log-in',
  imports: [Navbar, RouterLink], // RouterLink permite usar routerLink en el HTML para navegar entre páginas sin recargar
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LogIn {
  private http = inject(HttpClient); // Para mandar la petición de login al backend
  private router = inject(Router);   // Para redirigir al usuario a otra página después de iniciar sesión

  mostrarPassword = false; // Controla si la contraseña se ve como texto o como puntos (••••)
  error = '';              // Mensaje de error que se muestra si el login falla

  // Alterna entre mostrar y ocultar la contraseña
  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }

  // Recibimos los valores directamente desde los inputs del HTML con .value
  login(gmail: string, password: string) {
    this.http.post<{ nombre: string }>('http://localhost:3000/api/login', {
      gmail, password
    }).subscribe({
      next: (res) => {
        // localStorage guarda datos en el navegador de forma persistente — sobrevive al recargar la página
        // Así otras páginas (como el navbar) saben quién está logueado
        localStorage.setItem('usuario', res.nombre);
        this.router.navigate(['/']); // Redirigimos al inicio
      },
      error: () => {
        this.error = 'Gmail o contraseña incorrectos';
      }
    });
  }
}
