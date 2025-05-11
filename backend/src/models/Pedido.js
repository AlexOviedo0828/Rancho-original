const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [{
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
    cantidad: Number,
    precio_unitario: Number
  }],
  mesa: { type: mongoose.Schema.Types.ObjectId, ref: 'Mesa', required: true },
  reserva: { type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }, // ← NUEVO
  total: Number,
  metodo_pago: String,
  estado: { type: String, default: 'pendiente' },
  fecha: { type: Date, default: Date.now },
  contador_pedido: { type: Number, required: true, unique: true }
});

module.exports = mongoose.model('Pedido', pedidoSchema);
