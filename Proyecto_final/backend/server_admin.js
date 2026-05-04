const express = require('express');
const cors = require('cors');
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

app.listen(3001, () => console.log('Servidor admin corriendo en http://localhost:3001'));
