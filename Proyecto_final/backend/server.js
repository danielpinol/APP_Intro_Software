const express = require('express');
const cors = require('cors');
const { Pedido, Usuario } = require('./models');

const app = express();
app.use(cors());         // Permite peticiones desde el frontend
app.use(express.json()); // Lee el body como JSON

// ── CLIENTE ────────────────────────────────────────────────────

// Devuelve todos los pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo pedidos' });
  }
});

// Crea un pedido nuevo con estado "Recibido"
app.post('/api/pedidos', async (req, res) => {
  try {
    const nuevoPedido = new Pedido({
      ...req.body,
      estado: 'Recibido',
      fecha: new Date().toISOString().split('T')[0], // Fecha de hoy YYYY-MM-DD
    });
    await nuevoPedido.save();
    res.json({ mensaje: 'Pedido guardado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error guardando pedido' });
  }
});

// Registra un usuario nuevo (verifica que el gmail no exista antes)
app.post('/api/registro', async (req, res) => {
  try {
    const existe = await Usuario.findOne({ gmail: req.body.gmail });
    if (existe) return res.status(400).json({ error: 'Ya existe una cuenta con ese gmail' });
    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error creando usuario' });
  }
});

// Verifica gmail y contraseña, devuelve el nombre del usuario
app.post('/api/login', async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ gmail: req.body.gmail, password: req.body.password });
    if (!usuario) return res.status(401).json({ error: 'Gmail o contraseña incorrectos' });
    res.json({ mensaje: 'Login exitoso', nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
});

// ── ADMIN ──────────────────────────────────────────────────────

// Cambia el estado de un pedido (Recibido → En proceso → Finalizado)
app.patch('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: req.body.estado },
      { new: true } // Devuelve el pedido ya actualizado
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando pedido' });
  }
});

// Elimina un pedido por ID
app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ mensaje: 'Pedido eliminado', pedido });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando pedido' });
  }
});

// ── INICIO ─────────────────────────────────────────────────────

// Solo escucha en un puerto cuando se corre localmente (no en Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports = app; // Vercel importa el app en vez de llamar app.listen()
