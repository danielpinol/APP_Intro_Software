const express = require('express');                  // Framework para crear el servidor y definir rutas
const cors = require('cors');                        // Permite que el frontend se comunique con este servidor
const { Pedido, Usuario } = require('./models');     // Modelos de la base de datos

const app = express();
app.use(cors());         // Acepta peticiones desde cualquier origen (sin esto el navegador las bloquea)
app.use(express.json()); // Entiende JSON en el body — sin esto req.body llegaría vacío

// GET — devuelve todos los pedidos para que el cliente rastree su lavado
// async/await: pausa la función hasta que MongoDB responda — sin await, pedidos llegaría vacío
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find(); // find() sin filtros trae todos los documentos
    res.json(pedidos);                   // res.json() envía la respuesta al frontend en formato JSON
  } catch (error) {
    // catch atrapa cualquier error del try — así el servidor no se rompe, sino que responde con un mensaje controlado
    // res.status(500) define el código HTTP: 500 = error del servidor, 400 = datos incorrectos, 401 = no autorizado, 404 = no encontrado
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

const PORT = process.env.PORT_CLIENT || 3000; // Lee el puerto del .env, si no existe usa 3000 por defecto

app.listen(PORT, () => {
  console.log(`Servidor cliente corriendo en http://localhost:${PORT}\n`);

  console.log('Endpoints disponibles:');
  console.log(`GET     http://localhost:${PORT}/api/pedidos`);
  console.log(`POST    http://localhost:${PORT}/api/pedidos`);
  console.log(`POST    http://localhost:${PORT}/api/registro`);
  console.log(`POST    http://localhost:${PORT}/api/login`);
});