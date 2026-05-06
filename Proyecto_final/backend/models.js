const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config(); // Carga las variables del archivo .env para usarlas con process.env

// Usamos el DNS de Google porque algunos routers bloquean las consultas que necesita MongoDB
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Leemos la dirección de conexión desde el archivo .env — así la contraseña no queda en el código
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error conectando:', err));

// Schema = estructura que deben tener los documentos en la colección "pedidos"
const pedidoSchema = new mongoose.Schema({
  nombre:  String,
  marca:   String,
  modelo:  String,
  anio:    Number,
  placa:   String,
  tipo:    String,
  precio:  Number,
  estado:  String,
  fecha:   String,
}, {
  toJSON: {
    // Cada documento en MongoDB tiene un campo "_id" — aquí lo renombramos a "id"
    // para que el frontend lo reciba igual que antes
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v; // __v es un campo interno de mongoose que no necesitamos
    }
  }
});

// Schema de usuarios
const usuarioSchema = new mongoose.Schema({
  nombre:   String,
  usuario:  String,
  gmail:    String,
  telefono: String,
  password: String,
});

// model() registra el schema y crea la colección en MongoDB si no existe
const Pedido  = mongoose.model('Pedido',  pedidoSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Exportamos los modelos para usarlos en los servidores
module.exports = { Pedido, Usuario };
