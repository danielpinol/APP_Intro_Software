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