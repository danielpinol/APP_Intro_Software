// Importamos los módulos necesarios
const express = require('express');  // Framework para crear el servidor y definir rutas
const cors = require('cors');        // Permite que el frontend (en otro puerto) pueda hablar con este servidor
const fs = require('fs');            // Módulo de Node para leer y escribir archivos del disco

const app = express(); // Creamos el servidor

app.use(cors());          // Sin esto el navegador bloquea las peticiones del frontend
app.use(express.json());  // Le decimos al servidor que entienda JSON en el cuerpo de las peticiones

// GET /api/pedidos — devuelve la lista completa de pedidos al panel de admin
app.get('/api/pedidos', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8'); // Leemos el archivo como texto
    res.json(JSON.parse(data)); // Convertimos el texto a objeto JSON y lo enviamos
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo pedidos' }); // 500 = error interno del servidor
  }
});

// PATCH /api/pedidos/:id — cambia el estado de un pedido (Recibido → En proceso → Finalizado)
// :id es un parámetro dinámico en la URL, por ejemplo: /api/pedidos/2
app.patch('/api/pedidos/:id', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    const pedidos = JSON.parse(data);
    const id = parseInt(req.params.id); // Convertimos el id de texto a número entero

    // findIndex() busca en qué posición está el pedido — devuelve -1 si no lo encuentra
    const index = pedidos.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' }); // 404 = no encontrado
    }

    pedidos[index].estado = req.body.estado; // Actualizamos solo el estado, sin tocar lo demás

    // JSON.stringify con (null, 2) guarda el archivo con formato bonito — 2 espacios de sangría
    fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 2));
    res.json(pedidos[index]); // Devolvemos el pedido ya actualizado
  } catch (error) {
    res.status(500).json({ error: 'Error actualizando pedido' });
  }
});

// DELETE /api/pedidos/:id — elimina un pedido del archivo
app.delete('/api/pedidos/:id', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    let pedidos = JSON.parse(data);

    const id = parseInt(req.params.id);
    const index = pedidos.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }

    // splice(index, 1) elimina 1 elemento en esa posición del array
    // devuelve un array con los elementos eliminados, por eso tomamos [0] para obtener el pedido
    const pedidoEliminado = pedidos.splice(index, 1)[0];

    fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 2));
    res.json({ mensaje: 'Pedido eliminado correctamente', pedido: pedidoEliminado });
  } catch (error) {
    res.status(500).json({ error: 'Error eliminando pedido' });
  }
});

const PORT = 3001; // Puerto separado del servidor cliente para que no se pisen

app.listen(PORT, () => {
  console.log(`Servidor admin corriendo en http://localhost:${PORT}`);
});
