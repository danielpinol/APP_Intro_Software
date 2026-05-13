# uWash — Car Wash para estudiantes de UFM

> Tu carro, limpio cuando quieras. Sin filas. Sin efectivo.

Uwash: Es una aplicación web pensada para estudiantes de la UFM que quieren un servicio de lavado de carros rápido, moderno y sin complicaciones.

---

## ¿Qué incluye el proyecto?

El repositorio está dividido en tres partes:

```
APP_Intro_Software/
├── Landing Page/       # Página de presentación del negocio
└── Proyecto_final/
    ├── frontend/       # Aplicación web (Angular)
    └── backend/        # Servidor y base de datos (Node.js + MongoDB)
```

### Landing Page
Una página de una sola pantalla hecha con HTML (utilizamos tailwind), CSS y JavaScript puro — sin frameworks ni dependencias externas. Sirve como vitrina del negocio: presenta la propuesta de valor, datos de validación de mercado, cómo funciona el servicio y un botón para entrar a la app.

### Frontend (Angular)
La aplicación en sí. Permite a los usuarios registrarse, iniciar sesión, elegir su tipo de lavado y ver el estado de su pedido en tiempo real. También cuenta con un panel de administración para gestionar todos los pedidos entrantes.

Las páginas disponibles son:

| Ruta | Qué hace |
|---|---|
| `/` | Pantalla de inicio con acceso rápido al servicio |
| `/paquetes` | Muestra los paquetes de lavado disponibles y sus precios |
| `/solicitar` | Formulario para pedir un lavado llenando los datos del vehículo |
| `/mi-orden` | El cliente puede ver el estado actual de su pedido |
| `/login` | Inicio de sesión |
| `/signup` | Registro de cuenta nueva |
| `/admin` | Panel para los empleados: ver, actualizar y eliminar pedidos |

### Backend (Node.js + Express)
El servidor que conecta el frontend con la base de datos. Maneja el registro de usuarios, el inicio de sesión y todo el ciclo de vida de los pedidos (crear, actualizar estado, eliminar). La base de datos vive en MongoDB Atlas en la nube.

---

## ¿Cómo funciona el flujo principal?

1. El cliente entra a la app y elige un paquete de lavado.
2. Llena un formulario con los datos de su vehículo (marca, modelo, año, placa).
3. El pedido queda registrado con estado **"Recibido"**.
4. El equipo de uWash ve el pedido en el panel admin y lo mueve a **"En proceso"** y luego a **"Finalizado"**.
5. El cliente puede revisar el estado en la sección **"Mi Orden"** en cualquier momento.

---

## Que usamos ?

| Área | Tecnología |
|---|---|
| Frontend | Angular 21 + Tailwind CSS 4 |
| Backend | Node.js + Express |
| Base de datos | MongoDB Atlas (via Mongoose) |
| Deploy | Vercel (frontend y backend por separado) |
| Lenguaje | TypeScript (frontend) · JavaScript (backend) |

