const PedidoReserva = require('../models/PedidoReserva');
const Contador = require('../models/Contador');

// 🔢 Función para generar el siguiente número único
const obtenerSiguienteContador = async (nombre) => {
  const contador = await Contador.findOneAndUpdate(
    { nombre },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return contador.valor;
};

exports.crearPedidoReserva = async (req, res) => {
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

    // Validación mínima
    if (!usuario || !mesa || !productos || !fecha_reserva || !duracion) {
      return res.status(400).json({ mensaje: 'Datos incompletos para crear el pedido con reserva' });
    }

    // Generar número de pedido y número de reserva
    const contador_pedido = await obtenerSiguienteContador('pedido');
    const numero_reserva = await obtenerSiguienteContador('reserva');

    const nuevoPedidoReserva = new PedidoReserva({
      usuario,
      mesa,
      productos,
      total,
      metodo_pago,
      fecha_reserva,
      duracion,
      detalle_entrega,
      contador_pedido,
      numero_reserva
    });

    await nuevoPedidoReserva.save();

    res.status(201).json({ mensaje: 'Pedido con reserva creado correctamente', pedidoReserva: nuevoPedidoReserva });
  } catch (error) {
    console.error('❌ Error al crear pedido con reserva:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor', error });
  }
};
