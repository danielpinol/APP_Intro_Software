import { Routes } from '@angular/router';
import { Inicio } from './Componentes/inicio/inicio';
import { SolicitarLavado } from './Componentes/solicitar-lavado/solicitar-lavado';
import { MisPedidos } from './Componentes/mis-pedidos/mis-pedidos';
import { Paquetes } from './Componentes/paquetes/paquetes';
import { LogIn } from './Componentes/log-in/log-in';
import { Admin } from './Componentes/admin/admin';
import { SignUp } from './Componentes/sign-up/sign-up';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'solicitar', component: SolicitarLavado },
  { path: 'mi-orden', component: MisPedidos },
  { path: 'admin', component: Admin },
  { path: 'paquetes', component: Paquetes },
  { path: 'login', component: LogIn },
  { path: 'signup', component: SignUp },

  { path: '**', redirectTo: '' },
];