import { Component } from '@angular/core';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [],
  templateUrl: './log-in.html',
  styleUrl: './log-in.css'
})
export class LogIn {

   mostrarPassword: boolean = false;

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  
}
