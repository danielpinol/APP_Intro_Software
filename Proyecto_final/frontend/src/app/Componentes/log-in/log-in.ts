import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-log-in',
  imports: [Navbar],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css',
  changeDetection: ChangeDetectionStrategy.OnPush // Revisa si hubo algun cambio en los datos dinamicos en el html y lo actualiza
})
export class LogIn {
  mostrarPassword = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
}
