import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, Navbar],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {}
