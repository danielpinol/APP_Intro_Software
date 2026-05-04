const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// GET todos los pedidos
app.get('/api/pedidos', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo pedidos' });
  }
});

// PATCH cambiar estado de un pedido
app.patch('/api/pedidos/:id', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    const pedidos = JSON.parse(data);
    const id = parseInt(req.params.id);
    const index = pedidos.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    pedidos[index].estado = req.body.estado;
    fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 2));
    res.json(pedidos[index]);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando pedido' });
  }
});

// DELETE eliminar un pedido
app.delete('/api/pedidos/:id', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    let pedidos = JSON.parse(data);

    const id = parseInt(req.params.id);
    const index = pedidos.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // splice(index, 1) elimina 1 elemento en esa posición y lo devuelve
    const pedidoEliminado = pedidos.splice(index, 1)[0];

    fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 2));
    res.json({ mensaje: 'Pedido eliminado correctamente', pedido: pedidoEliminado });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando pedido' });
  }
});

app.get('/api/usuarios', (req, res) => {
  try {
    const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));

    // Quitamos password
    const usuariosSeguros = usuarios.map(u => ({
      id: u.id,
      nombre: u.nombre,
      usuario: u.usuario,
      gmail: u.gmail,
      telefono: u.telefono
    }));

    res.json(usuariosSeguros);

  } catch (error) {
    res.status(500).json({ error: 'Error leyendo usuarios' });
  }
});

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}\n`);

  console.log('Endpoints disponibles:');

  console.log(`GET     http://localhost:${PORT}/api/pedidos`);
  console.log(`GET     http://localhost:${PORT}/api/paquetes`);
  console.log(`GET     http://localhost:${PORT}/api/usuarios`);

  console.log(`PATCH   http://localhost:${PORT}/api/pedidos/:id`);
  console.log(`DELETE  http://localhost:${PORT}/api/pedidos/:id\n`);
});