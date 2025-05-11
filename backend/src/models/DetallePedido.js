const mongoose = require('mongoose');

const detalleSchema = new mongoose.Schema({
  pedido: { type: mongoose.Schema.Types.ObjectId, ref: 'Pedido', required: true },
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
  cantidad: { type: Number, required: true },
  tiempo_entrega: { type: Number } // minutos desde la llegada del cliente
});

module.exports = mongoose.model('DetallePedido', detalleSchema);
