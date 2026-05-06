const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Carga las variables del archivo .env para usarlas con process.env
const { Pedido } = require('./models');

const app = express();
app.use(cors());         // Permite que el frontend se comunique con este servidor
app.use(express.json()); // Permite recibir datos en formato JSON

// GET — devuelve todos los pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find(); // find() sin filtros trae todos los documentos
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo pedidos' });
  }
});

// PATCH — cambia el estado de un pedido (Recibido → En proceso → Finalizado)
app.patch('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,        // ID del pedido que viene en la URL
      { estado: req.body.estado }, // Solo actualizamos el estado
      { new: true }         // new: true = devuelve el pedido ya actualizado
    );
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json(pedido);
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando pedido' });
  }
});

// DELETE — elimina un pedido
app.delete('/api/pedidos/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) return res.status(404).json({ error: 'Pedido no encontrado' });
    res.json({ mensaje: 'Pedido eliminado', pedido });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando pedido' });
  }
});

const PORT = process.env.PORT_ADMIN || 3001; // Lee el puerto del .env, si no existe usa 3001 por defecto

app.listen(PORT, () => {
  console.log(`Servidor admin corriendo en http://localhost:${PORT}\n`);

  console.log('Endpoints disponibles:');
  console.log(`GET     http://localhost:${PORT}/api/pedidos`);
  console.log(`PATCH   http://localhost:${PORT}/api/pedidos/:id`);
  console.log(`DELETE  http://localhost:${PORT}/api/pedidos/:id`);
});