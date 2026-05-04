# Backend

El backend está dividido en **dos servidores independientes**:

---

## 1. `server_client.js`
Puerto: `3000`

Servidor usado por el cliente (frontend).

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pedidos` | Obtener todos los pedidos |
| `POST` | `/api/pedidos` | Crear un nuevo pedido |
| `GET` | `/api/paquetes` | Obtener paquetes de lavado |
| `POST` | `/api/registro` | Registrar usuario |
| `POST` | `/api/login` | Iniciar sesión |

---

## 2. `server_admin.js`
Puerto: `3001`

Servidor para administración.

### Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/pedidos` | Obtener todos los pedidos |
| `PATCH` | `/api/pedidos/:id` | Actualizar estado del pedido |
| `DELETE` | `/api/pedidos/:id` | Eliminar un pedido |
| `GET` | `/api/usuarios` | Obtener todos los usuarios |

---

# Base de datos (simulada)

Se utilizan archivos JSON:

- `pedidos.json`
- `paquetes.json`
- `usuarios.json`

---
