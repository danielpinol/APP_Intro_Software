import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Navbar } from '../navbar/navbar';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-log-in',       // Así se llama este componente en el HTML: <app-log-in />
  imports: [Navbar, RouterLink], // Componentes y directivas que usa el HTML de este componente
  templateUrl: './log-in.html',  // Archivo HTML que dibuja la pantalla
  styleUrl: './log-in.css'       // Archivo CSS con los estilos
})
export class LogIn {

  // inject() le pide a Angular que nos dé una instancia lista para usar de cada herramienta
  // "this" se refiere a este mismo componente — es como decir "yo" dentro de la clase
  private http = inject(HttpClient);   // Para enviar peticiones al servidor (POST, GET, etc.)
  private router = inject(Router);     // Para cambiar de página sin recargar el navegador
  private auth = inject(AuthService);  // Servicio propio que guarda quién está logueado

  // Variables que el HTML puede leer y mostrar en pantalla
  mostrarPassword = false; // true = la contraseña se ve como texto, false = se ve como ••••
  error = '';              // Si el login falla, aquí guardamos el mensaje de error para mostrarlo
  bienvenida = '';         // Si el login es exitoso, aquí guardamos el mensaje de bienvenida

  // Esta función se llama cuando el usuario hace clic en "Mostrar / Ocultar"
  // El signo "!" invierte el valor: si era false lo pone en true, y viceversa
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  // Esta función se llama cuando el usuario hace clic en "Iniciar sesión"
  // Recibe gmail y password que vienen directamente de los inputs del HTML
  login(gmail: string, password: string) {

    // post() envía gmail y password al backend (servidor) en formato JSON
    // <{ nombre: string }> le dice a TypeScript que el servidor nos va a responder con un objeto { nombre: "..." }
    this.http.post<{ nombre: string }>('https://uwash-backend.vercel.app/api/login', { gmail, password })

      // subscribe() espera la respuesta del servidor — como escuchar el resultado de una llamada
      .subscribe({

        // next se ejecuta si el servidor respondió bien (login correcto)
        // "res" es la respuesta del servidor, contiene res.nombre
        next: (res) => {
          // auth.login() guarda el nombre en localStorage Y actualiza el signal del navbar
          // Ya no usamos localStorage.setItem directamente — el servicio lo hace por nosotros
          this.auth.login(res.nombre);
          this.bienvenida = `Bienvenido ${res.nombre}!`; // Muestra mensaje de bienvenida en pantalla

          // setTimeout espera 3000 milisegundos (3 segundos) y luego ejecuta lo que está adentro
          // navigate(['/']) lleva al usuario a la página de inicio
          setTimeout(() => this.router.navigate(['/']), 3000);
        },

        // error se ejecuta si el servidor respondió con fallo (credenciales incorrectas)
        error: () => {
          this.error = 'Gmail o contraseña incorrectos'; // Muestra el error en pantalla
        }
      });
  }
}
