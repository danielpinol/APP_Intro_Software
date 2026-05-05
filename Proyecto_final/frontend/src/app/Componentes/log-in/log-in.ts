import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../Services/auth.service'; // Servicio que maneja quién está logueado

@Component({
  selector: 'app-log-in',
  imports: [Navbar, RouterLink],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LogIn {
  private http = inject(HttpClient);   // Para hacer la petición POST al backend
  private router = inject(Router);     // Para redirigir al usuario después del login
  private auth = inject(AuthService);  // Para avisarle al servicio (y al navbar) que hay un usuario logueado

  mostrarPassword = false; // Controla si la contraseña se ve como texto o como puntos (••••)
  error = '';              // Mensaje de error que se muestra si el login falla
  bienvenida = '';         // Mensaje de éxito que se muestra 3 segundos antes de redirigir

  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }

  login(gmail: string, password: string) {
    // Enviamos gmail y password al backend
    this.http.post<{ nombre: string }>('http://localhost:3000/api/login', {
      gmail, password
    }).subscribe({
      next: (res) => {
        // auth.login() guarda el nombre en localStorage Y actualiza el signal del navbar
        // Ya no usamos localStorage.setItem directamente — el servicio lo hace por nosotros
        this.auth.login(res.nombre);
        this.router.navigate(['/']); // Redirigimos al inicio
      },
      error: () => {
        this.error = 'Gmail o contraseña incorrectos';
      }
    });
  }
}
