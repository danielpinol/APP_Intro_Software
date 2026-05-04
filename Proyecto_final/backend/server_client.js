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

// POST /api/registro → recibe los datos del formulario y guarda el usuario nuevo
app.post('/api/registro', (req, res) => {
  // Leemos el archivo de usuarios y lo convertimos a array
  const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));

  // Buscamos si ya existe alguien con ese gmail (find devuelve el objeto o undefined)
  const existe = usuarios.find(u => u.gmail === req.body.gmail);
  if (existe) {
    // status(400) = Bad Request, le decimos al frontend que hubo un error
    return res.status(400).json({ error: 'Ya existe una cuenta con ese gmail' });
  }

  // Armamos el objeto del nuevo usuario con los datos que llegaron en req.body
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

// POST /api/login → recibe gmail y password, verifica si existe ese usuario
app.post('/api/login', (req, res) => {
  const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));

  // Buscamos un usuario que tenga ese gmail Y esa password al mismo tiempo
  const usuario = usuarios.find(
    u => u.gmail === req.body.gmail && u.password === req.body.password
  );

  if (!usuario) {
    // status(401) = Unauthorized, las credenciales son incorrectas
    return res.status(401).json({ error: 'Gmail o contraseña incorrectos' });
  }

  // Si lo encontramos, respondemos con el nombre para mostrarlo en el frontend
  res.json({ mensaje: 'Login exitoso', nombre: usuario.nombre });
});

// Puerto
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/api/pedidos`);
});