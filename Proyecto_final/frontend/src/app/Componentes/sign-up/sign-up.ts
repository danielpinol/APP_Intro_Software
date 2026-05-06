import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-sign-up',
  imports: [Navbar, RouterLink], // RouterLink permite usar routerLink en el HTML para navegar entre páginas sin recargar
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  private http = inject(HttpClient); // Para mandar los datos de registro al backend
  private router = inject(Router);   // Para redirigir al usuario al login después de crear la cuenta

  mostrarPassword = false;   // Controla si la contraseña se ve como texto o como puntos (••••)
  mostrarConfirmar = false;  // Lo mismo pero para el campo de confirmar contraseña
  error = '';                // Mensaje de error que se muestra si algo falla

  // Alternan entre mostrar y ocultar cada campo de contraseña
  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }
  toggleConfirmar() { this.mostrarConfirmar = !this.mostrarConfirmar; }

  // Recibimos los valores directamente desde los inputs del HTML con .value
  registrar(nombre: string, usuario: string, gmail: string, telefono: string, password: string, confirmar: string) {

    // Validamos que las dos contraseñas sean iguales antes de enviar nada al backend
    if (password !== confirmar) {
      this.error = 'Las contraseñas no coinciden';
      return; // return detiene la función aquí — no se manda ninguna petición
    }

    this.error = ''; // Limpiamos cualquier error anterior

    this.http.post('https://uwash-backend.vercel.app/api/registro', {
      nombre, usuario, gmail, telefono, password
    }).subscribe({
      next: () => {
        this.router.navigate(['/login']); // Si todo salió bien, mandamos al usuario al login
      },
      error: (err) => {
        // err.error es el cuerpo de la respuesta de error del backend
        // .error es el campo "error" dentro de ese cuerpo (lo que mandamos con res.status(400).json({ error: '...' }))
        this.error = err.error.error;
      }
    });
  }
}
