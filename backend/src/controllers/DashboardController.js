const Usuario = require('../models/Usuario');
const Producto = require('../models/Producto');
const Pedido = require('../models/Pedido');
const Reserva = require('../models/Reserva');
const Boleta = require('../models/Boleta');
const DetallePedido = require('../models/DetallePedido');

exports.getResumen = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.countDocuments();
    const totalProductos = await Producto.countDocuments({ activo: true });
    const totalPedidos = await Pedido.countDocuments();
    const pedidosPorEstado = await Pedido.aggregate([
      { $group: { _id: '$estado', total: { $sum: 1 } } }
    ]);

    const totalReservas = await Reserva.countDocuments();
    const reservasPorEstado = await Reserva.aggregate([
      { $group: { _id: '$estado', total: { $sum: 1 } } }
    ]);

    const totalRecaudado = await Boleta.aggregate([
      { $group: { _id: null, total: { $sum: '$total_final' } } }
    ]);

    const productoMasVendido = await DetallePedido.aggregate([
      {
        $group: {
          _id: '$producto',
          totalVendidos: { $sum: '$cantidad' }
        }
      },
      { $sort: { totalVendidos: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'productos',
          localField: '_id',
          foreignField: '_id',
          as: 'producto'
        }
      },
      { $unwind: '$producto' },
      {
        $project: {
          _id: 0,
          nombre: '$producto.nombre',
          totalVendidos: 1
        }
      }
    ]);

    res.json({
      totalUsuarios,
      totalProductos,
      totalPedidos,
      pedidosPorEstado,
      totalReservas,
      reservasPorEstado,
      totalRecaudado: totalRecaudado[0]?.total || 0,
      productoMasVendido: productoMasVendido[0] || 'No hay ventas registradas'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
