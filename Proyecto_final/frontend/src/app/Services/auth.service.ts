// Injectable convierte esta clase en un servicio que Angular puede inyectar en otros componentes
// signal es la función de Angular para crear variables reactivas (cuando cambian, la UI se actualiza sola)
import { Injectable, signal } from '@angular/core';

// providedIn: 'root' significa que este servicio es un SINGLETON — existe una sola instancia en toda la app
// Eso es clave: si el navbar y el login comparten este servicio, ambos ven el mismo dato
@Injectable({ providedIn: 'root' })
export class AuthService {

  // signal<string | null> = puede ser un string (el nombre) o null (no hay usuario logueado)
  // Se inicializa leyendo localStorage por si el usuario ya había hecho login antes (sesión persistente)
  usuario = signal<string | null>(localStorage.getItem('usuario'));

  // Se llama cuando el usuario hace login exitosamente
  login(nombre: string) {
    localStorage.setItem('usuario', nombre); // Guarda el nombre en el navegador (sobrevive al recargar)
    this.usuario.set(nombre);               // Actualiza el signal → el navbar se actualiza en tiempo real
  }

  // Se llama cuando el usuario hace clic en "Sign out"
  logout() {
    localStorage.removeItem('usuario'); // Borra el nombre del navegador
    this.usuario.set(null);             // Pone el signal en null → el navbar vuelve a mostrar el botón Login
  }
}
