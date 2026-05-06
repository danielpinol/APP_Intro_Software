import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  auth = inject(AuthService);
  menuAbierto = signal(false); // controla el menú desplegable en mobile

  toggleMenu() { this.menuAbierto.update(v => !v); }
}
