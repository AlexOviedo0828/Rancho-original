const mongoose = require('mongoose');

const boletaSchema = new mongoose.Schema({
  pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
  total_neto: { type: Number, required: true },
  iva: { type: Number, default: 0.19 },
  total_final: { type: Number, required: true },
  fecha_emision: { type: Date, default: Date.now },
  archivo_pdf: { type: String },
  numero_boleta: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model('Boleta', boletaSchema);
