const express = require('express');
const cors = require('cors');
const { Pedido, Usuario } = require('./models');

const app = express();
app.use(cors());         // Permite que el frontend se comunique con este servidor
app.use(express.json()); // Permite recibir datos en formato JSON

// GET — devuelve todos los pedidos (para que el cliente rastree su lavado)
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find();
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo pedidos' });
  }
});

// POST — crea un pedido nuevo
app.post('/api/pedidos', async (req, res) => {
  try {
    const nuevoPedido = new Pedido({
      ...req.body,        // Copia todos los campos que mandó el frontend (nombre, marca, etc.)
      estado: 'Recibido', // El estado inicial siempre es "Recibido"
      fecha: new Date().toISOString().split('T')[0] // Fecha de hoy en formato YYYY-MM-DD
    });
    await nuevoPedido.save();
    res.json({ mensaje: 'Pedido guardado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error guardando pedido' });
  }
});

// GET — devuelve los paquetes disponibles (son fijos, no necesitan base de datos)
app.get('/api/paquetes', (req, res) => {
  res.json([
    { nombre: 'Básico',  precio: 65,  descripcion: 'Lavado exterior básico' },
    { nombre: 'Medium',  precio: 110, descripcion: 'Lavado exterior e interior' },
    { nombre: 'Premium', precio: 170, descripcion: 'Lavado completo + encerado' },
  ]);
});

// POST — registra un usuario nuevo
app.post('/api/registro', async (req, res) => {
  try {
    // Verificamos que no exista ya una cuenta con ese gmail
    const existe = await Usuario.findOne({ gmail: req.body.gmail });
    if (existe) return res.status(400).json({ error: 'Ya existe una cuenta con ese gmail' });

    const nuevoUsuario = new Usuario(req.body);
    await nuevoUsuario.save();
    res.json({ mensaje: 'Usuario creado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error creando usuario' });
  }
});

// POST — verifica las credenciales del usuario
app.post('/api/login', async (req, res) => {
  try {
    // Busca un usuario que tenga ese gmail Y esa contraseña al mismo tiempo
    const usuario = await Usuario.findOne({ gmail: req.body.gmail, password: req.body.password });
    if (!usuario) return res.status(401).json({ error: 'Gmail o contraseña incorrectos' });
    res.json({ mensaje: 'Login exitoso', nombre: usuario.nombre });
  } catch (error) {
    res.status(500).json({ error: 'Error en el login' });
  }
});

app.listen(3000, () => console.log('Servidor cliente corriendo en http://localhost:3000'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}\n`);

  console.log('Endpoints disponibles:');
  console.log(`GET     http://localhost:${PORT}/api/pedidos`);
  console.log(`GET     http://localhost:${PORT}/api/paquetes`);

  console.log(`POST    http://localhost:${PORT}/api/pedidos`);
  console.log(`POST    http://localhost:${PORT}/api/registro`);
  console.log(`POST    http://localhost:${PORT}/api/login`);
});
