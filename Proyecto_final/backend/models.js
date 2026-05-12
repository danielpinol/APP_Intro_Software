const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

// Guardamos la promesa de conexión en global para reutilizarla entre requests en Vercel
// Sin esto, cada request en cold start falla porque MongoDB todavía no está listo
let connectionPromise = global._mongoPromise ?? null;

function connectDB() {
  // readyState 1 = ya conectado, no hace falta reconectar
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  // Si ya hay una conexión en progreso, reutilizamos esa misma promesa
  if (!connectionPromise) {
    connectionPromise = global._mongoPromise = mongoose.connect(MONGO_URI)
      .then(() => console.log('Conectado a MongoDB Atlas'))
      .catch(err => { console.error('Error conectando:', err); connectionPromise = global._mongoPromise = null; });
  }
  return connectionPromise;
}

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
  versionKey: false,  // Evita que Mongoose guarde __v en MongoDB
  timestamps: true,   // Agrega createdAt y updatedAt automáticamente
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id; // Renombra _id a id para el frontend
      delete ret._id;
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
}, {
  versionKey: false,  // Evita que Mongoose guarde __v en MongoDB
  timestamps: true,   // Agrega createdAt y updatedAt automáticamente
});

// model() registra el schema y crea la colección en MongoDB si no existe
const Pedido  = mongoose.model('Pedido',  pedidoSchema);
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Exportamos los modelos Y connectDB para que server.js pueda esperar la conexión
module.exports = { Pedido, Usuario, connectDB };
