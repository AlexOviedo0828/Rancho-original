const Pedido = require('../models/Pedido');
const Contador = require('../models/Contador');
const mongoose = require('mongoose');
const Reserva = require('../models/Reserva');

async function generarContador(nombre) {
  const contador = await Contador.findOneAndUpdate(
    { nombre },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return contador.valor;
}


exports.crearPedido = async (req, res) => {
  try {
    const {
      usuario,
      mesa,
      productos,
      total,
      metodo_pago,
      fecha_reserva,
      duracion,
      detalle_entrega
    } = req.body;

    if (!usuario || !mesa || !productos || !fecha_reserva || !duracion || productos.length === 0) {
      return res.status(400).json({ mensaje: '❌ Datos incompletos para crear el pedido con reserva' });
    }

    // Generar número de reserva único
    const numeroReserva = await generarContador('reserva');

    // Crear reserva automáticamente
    const nuevaReserva = new Reserva({
      usuario,
      mesa,
      fecha_reserva,
      duracion,
      detalle_entrega,
      numero_reserva: numeroReserva
    });

    const reservaGuardada = await nuevaReserva.save();

    // Generar contador de pedido
    const numeroPedido = await generarContador('pedido');

    // Crear el pedido con el ID de la reserva
    const pedido = new Pedido({
      usuario,
      mesa,
      productos,
      detalle_entrega,
      total,
      metodo_pago,
      fecha_reserva,
      duracion,
      reserva: reservaGuardada._id,
      contador_pedido: numeroPedido
    });

    await pedido.save();

    const pedidoCompleto = await Pedido.findById(pedido._id)
      .populate('usuario', 'nombre_completo correo')
      .populate({
        path: 'productos.producto',
        select: 'nombre precio descripcion'
      })
      .populate({
        path: 'reserva',
        populate: {
          path: 'mesa',
          select: 'numero ubicacion capacidad'
        }
      })
      .populate('mesa', 'numero ubicacion capacidad');

    res.status(201).json(pedidoCompleto);

  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    res.status(500).json({ mensaje: '❌ Error interno al crear pedido', error });
  }
};

// Obtener todos los pedidos
exports.getPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('usuario', 'nombre_completo correo')
      .populate({
        path: 'productos.producto',
        select: 'nombre precio descripcion'
      })
      .populate({
        path: 'reserva',
        select: 'numero_reserva', // ← AÑADIDO
        populate: {
          path: 'mesa',
          select: 'numero ubicacion capacidad'
        }
      })
      .populate('mesa', 'numero ubicacion capacidad');

    res.json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener pedidos' });
  }
};

// Actualizar pedido agregando una reserva (ejemplo)
exports.actualizarPedidoConReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { reservaId } = req.body;

    if (!reservaId) {
      return res.status(400).json({ mensaje: '❌ ID de reserva requerido' });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { reserva: reservaId },
      { new: true }
    )
      .populate('usuario', 'nombre_completo correo')
      .populate('mesa')
      .populate('productos.producto');

    if (!pedido) {
      return res.status(404).json({ mensaje: '❌ Pedido no encontrado' });
    }

    res.status(200).json(pedido);

  } catch (error) {
    console.error('❌ Error al actualizar pedido:', error);
    res.status(500).json({ mensaje: '❌ Error interno al actualizar pedido', error });
  }
};
exports.actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ mensaje: '❌ Estado es requerido' });
    }

    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      id,
      { estado },
      { new: true }
    );

    if (!pedidoActualizado) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    if (pedidoActualizado.reserva) {
      await Reserva.findByIdAndUpdate(
        pedidoActualizado.reserva,
        { estado },
        { new: true }
      );
    }

    res.status(200).json(pedidoActualizado);
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    res.status(500).json({ mensaje: 'Error interno al actualizar el estado del pedido', error });
  }
};
exports.getPedidoPorId = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('usuario', 'nombre_completo correo')
      .populate({
        path: 'productos.producto',
        select: 'nombre precio descripcion'
      })
      .populate({
        path: 'reserva',
        populate: {
          path: 'mesa',
          select: 'numero ubicacion capacidad'
        }
      })
      .populate('mesa', 'numero ubicacion capacidad');

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    res.status(200).json(pedido);
  } catch (error) {
    console.error('❌ Error al obtener pedido por ID:', error);
    res.status(500).json({ mensaje: 'Error al obtener el pedido', error });
  }
};
exports.eliminarPedido = async (req, res) => {
  try {
    const eliminado = await Pedido.findByIdAndDelete(req.params.id);
    if (!eliminado) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json({ mensaje: 'Pedido eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar pedido:', error);
    res.status(500).json({ mensaje: 'Error al eliminar pedido', error });
  }
};
exports.actualizarPedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }
    res.status(200).json(pedido);
  } catch (error) {
    console.error('❌ Error al actualizar pedido:', error);
    res.status(500).json({ mensaje: 'Error al actualizar pedido', error });
  }
};
