const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  imagen: { type: String },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model('Producto', productoSchema);
