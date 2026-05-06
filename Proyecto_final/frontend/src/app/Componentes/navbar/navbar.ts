import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service'; // Importamos el servicio de autenticación

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  // OnPush = Angular solo redibuja este componente cuando cambia un signal o un input
  // Es más eficiente que el modo por defecto, y funciona perfecto con signals
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  // inject() trae la instancia singleton de AuthService
  // Como es singleton, el mismo objeto que actualizó el login es el que lee el navbar
  // Por eso el nombre aparece instantáneamente sin recargar la página
  auth = inject(AuthService);
}
