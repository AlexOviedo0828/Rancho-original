const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  emisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  rol: {
    type: String,
    enum: ['usuario', 'cocina', 'admin'],
    required: true
  },
  mensaje:    { type: String,  required: true },
  respuesta:  { type: String,  default: '' },
  respondido: { type: Boolean, default: false },
  fecha:      { type: Date,    default: Date.now }
});

module.exports = mongoose.model('Mensaje', mensajeSchema);

