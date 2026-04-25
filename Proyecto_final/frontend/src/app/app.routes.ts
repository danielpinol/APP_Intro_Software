import { Routes } from '@angular/router';
import { Inicio } from './Componentes/inicio/inicio';
import { SolicitarLavado } from './Componentes/solicitar-lavado/solicitar-lavado';
import { MisPedidos } from './Componentes/mis-pedidos/mis-pedidos';
import { Admin } from './Componentes/admin/admin';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'solicitar', component: SolicitarLavado },
  { path: 'mi-orden', component: MisPedidos },
  { path: 'admin', component: Admin },
  { path: '**', redirectTo: '' }
];