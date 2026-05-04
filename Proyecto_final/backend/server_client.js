// Importamos los módulos necesarios
const express = require('express');  // Framework para crear el servidor y definir rutas
const cors = require('cors');        // Permite que el frontend (en otro puerto) pueda hablar con este servidor
const fs = require('fs');            // Módulo de Node para leer y escribir archivos del disco

const app = express();

// Middlewares — código que corre en cada petición antes de llegar a las rutas
app.use(cors());          // Sin esto el navegador bloquea las peticiones del frontend
app.use(express.json());  // Le decimos al servidor que entienda JSON en el cuerpo de las peticiones

// GET /api/pedidos — devuelve todos los pedidos (el cliente los usa para rastrear su lavado)
app.get('/api/pedidos', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8'); // Leemos el archivo como texto
    const pedidos = JSON.parse(data); // Convertimos el texto a array de objetos
    res.json(pedidos); // Enviamos el array al frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error leyendo pedidos' });
  }
});

// POST /api/pedidos — crea un pedido nuevo cuando el cliente llena el formulario de solicitar lavado
app.post('/api/pedidos', (req, res) => {
  try {
    const data = fs.readFileSync('pedidos.json', 'utf-8');
    const pedidos = JSON.parse(data);

    const nuevoPedido = {
      id: pedidos.length + 1, // El id es simplemente el siguiente número en la lista
      ...req.body,             // ... (spread) copia todos los campos que mandó el frontend (nombre, marca, modelo, etc.)
      estado: 'Recibido',      // El estado inicial siempre es "Recibido"
      fecha: new Date().toISOString().split('T')[0] // Fecha de hoy en formato YYYY-MM-DD (split corta en la T y toma la parte de la fecha)
    };

    pedidos.push(nuevoPedido); // Agregamos el nuevo pedido al final del array

    fs.writeFileSync('pedidos.json', JSON.stringify(pedidos, null, 2)); // Guardamos el archivo con formato bonito

    res.json({ mensaje: 'Pedido guardado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error guardando pedido' });
  }
});

// GET /api/paquetes — devuelve los paquetes disponibles (Básico, Medium, Premium)
app.get('/api/paquetes', (req, res) => {
  try {
    const data = fs.readFileSync('paquetes.json', 'utf-8');
    const paquetes = JSON.parse(data);
    res.json(paquetes);
  } catch (error) {
    res.status(500).json({ error: 'Error leyendo paquetes' });
  }
});

// POST /api/registro — recibe los datos del formulario y guarda el usuario nuevo
app.post('/api/registro', (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8')); // Leemos el archivo de usuarios

  // find() busca el primer usuario con ese gmail — devuelve el objeto si lo encuentra, o undefined si no existe
  const existe = usuarios.find(u => u.gmail === req.body.gmail);
  if (existe) {
    return res.status(400).json({ error: 'Ya existe una cuenta con ese gmail' }); // 400 = Bad Request
  }

  const nuevoUsuario = {
    id: usuarios.length + 1,
    nombre: req.body.nombre,
    usuario: req.body.usuario,
    gmail: req.body.gmail,
    telefono: req.body.telefono,
    password: req.body.password
  };

  usuarios.push(nuevoUsuario); // Lo agregamos al array
  fs.writeFileSync('usuarios.json', JSON.stringify(usuarios, null, 2)); // Guardamos el archivo

  res.json({ mensaje: 'Usuario creado correctamente' });
});

// POST /api/login — verifica si el gmail y la contraseña son correctos
app.post('/api/login', (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));

  // find() busca un usuario que tenga ese gmail Y esa password al mismo tiempo (ambas deben coincidir)
  const usuario = usuarios.find(
    u => u.gmail === req.body.gmail && u.password === req.body.password
  );

  if (!usuario) {
    return res.status(401).json({ error: 'Gmail o contraseña incorrectos' }); // 401 = Unauthorized (credenciales incorrectas)
  }

  // Si lo encontramos, mandamos el nombre para mostrarlo en el frontend
  res.json({ mensaje: 'Login exitoso', nombre: usuario.nombre });
});

const PORT = 3000; // Puerto del servidor cliente

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}\n`);

  console.log('Endpoints disponibles:');
  console.log(`GET     http://localhost:${PORT}/api/pedidos`);
  console.log(`GET     http://localhost:${PORT}/api/paquetes`);

  console.log(`POST    http://localhost:${PORT}/api/pedidos`);
  console.log(`POST    http://localhost:${PORT}/api/registro`);
  console.log(`POST    http://localhost:${PORT}/api/login`);
});
