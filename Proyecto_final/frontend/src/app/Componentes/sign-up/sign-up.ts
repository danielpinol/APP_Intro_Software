import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-sign-up',
  imports: [Navbar, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignUp {
  mostrarPassword = false;
  mostrarConfirmar = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  toggleConfirmar() {
    this.mostrarConfirmar = !this.mostrarConfirmar;
  }
}
