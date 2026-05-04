import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-log-in',
  imports: [Navbar, RouterLink],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LogIn {
  private http = inject(HttpClient);
  private router = inject(Router);

  mostrarPassword = false;
  error = '';

  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }

  // Recibimos los valores directamente desde los inputs del HTML
  login(gmail: string, password: string) {
    this.http.post<{ nombre: string }>('http://localhost:3000/api/login', {
      gmail, password
    }).subscribe({
      next: (res) => {
        // localStorage guarda datos en el navegador — así otras páginas saben quién está logueado
        localStorage.setItem('usuario', res.nombre);
        this.router.navigate(['/']); // Redirigimos al inicio
      },
      error: () => {
        this.error = 'Gmail o contraseña incorrectos';
      }
    });
  }
}
