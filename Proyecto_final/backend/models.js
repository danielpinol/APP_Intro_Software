const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

// Cache global: Vercel reutiliza instancias calientes, así evitamos reconectar en cada request
let cachedConn = global._mongoConn ?? null;

if (!cachedConn) {
  cachedConn = global._mongoConn = mongoose.connect(MONGO_URI)
    .then(() => { console.log('Conectado a MongoDB Atlas'); })
    .catch(err => { console.error('Error conectando:', err); global._mongoConn = null; });
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

// Exportamos los modelos para usarlos en los servidores
module.exports = { Pedido, Usuario };
