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

    res.send(JSON.stringify(pedidos, null, 2));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error leyendo pedidos' });
  }
});

// Puerto
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/api/pedidos`);
});