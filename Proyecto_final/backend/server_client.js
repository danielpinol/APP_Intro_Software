const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// RUTA
app.get('/api/pedidos', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    const pedidos = JSON.parse(data);

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error leyendo pedidos' });
  }
});


app.post('/api/pedidos', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    const pedidos = JSON.parse(data);

    const nuevoPedido = {
      id: pedidos.length + 1,
      ...req.body,
      estado: 'Recibido',
      fecha: new Date().toISOString().split('T')[0]
    };

    pedidos.push(nuevoPedido);

    fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 2));

    res.json({ mensaje: 'Pedido guardado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando pedido' });
  }
});

app.get('/api/paquetes', (req, res) => {
  try {
    const data = fs.readFileSync('paquetes.json', 'utf-8');
    const paquetes = JSON.parse(data);
    res.json(paquetes);
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo paquetes' });
  }
});

// Puerto
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/api/pedidos`);
});