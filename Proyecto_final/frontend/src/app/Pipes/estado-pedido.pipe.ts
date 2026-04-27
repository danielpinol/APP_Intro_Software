import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'estadoPedido' })
export class EstadoPedidoPipe implements PipeTransform {
  transform(estado: string): string {
    if (estado === 'Recibido')   return 'Pendiente de inicio';
    if (estado === 'En proceso') return 'En lavado ahora';
    if (estado === 'Finalizado') return 'Listo para recoger';
    return estado;
  }
}
