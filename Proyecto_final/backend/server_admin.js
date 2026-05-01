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

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Servidor admin corriendo en http://localhost:${PORT}`);
});
