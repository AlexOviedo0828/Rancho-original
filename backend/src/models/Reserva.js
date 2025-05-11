const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  mesa: { type: mongoose.Schema.Types.ObjectId, ref: 'Mesa', required: true },
  fecha_reserva: { type: Date, required: true },
  duracion: { type: Number, required: true }, // En minutos
  detalle_entrega: [{ 
    descripcion: String, 
    tiempo: Number // en minutos desde la llegada
  }],
  estado: { type: String, default: 'activa' },
  numero_reserva: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model('Reserva', reservaSchema);
