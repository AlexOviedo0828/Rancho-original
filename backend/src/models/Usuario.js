const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre_completo: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  telefono: { type: String },
  direccion: { type: String },
  contrasena: { type: String, required: true, select: false }, // ✅ este es el fix
  estado: { type: String, default: 'activo' },
  fecha_registro: { type: Date, default: Date.now },
  rol: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rol',
    required: true
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
