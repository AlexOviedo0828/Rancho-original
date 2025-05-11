const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
  numero: { type: Number, required: true, unique: true },
  capacidad: { type: Number, required: true },
  estado: { type: String, default: 'disponible' },
  ubicacion: { type: String }
});

module.exports = mongoose.model('Mesa', mesaSchema);
