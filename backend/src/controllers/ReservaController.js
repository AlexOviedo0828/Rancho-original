const Reserva = require('../models/Reserva');
const Contador = require('../models/Contador');

// Crear una nueva reserva con número incremental único
exports.crearReserva = async (req, res) => {
  try {
    let contador = await Contador.findOneAndUpdate(
      { nombre: 'reserva' },
      { $inc: { valor: 1 } },
      { new: true, upsert: true }
    );

    let numero = contador.valor;

    // Validar que el número de reserva no se repita
    while (await Reserva.findOne({ numero_reserva: numero })) {
      numero++;
    }

    const nuevaReserva = new Reserva({
      usuario: req.body.usuario,
      mesa: req.body.mesa,
      fecha_reserva: req.body.fecha_reserva,
      duracion: req.body.duracion,
      detalle_entrega: req.body.detalle_entrega || [],
      numero_reserva: numero
    });

    await nuevaReserva.save();
    res.status(201).json(nuevaReserva);
  } catch (err) {
    res.status(400).json({ mensaje: 'Error al crear la reserva', error: err.message });
  }
};

// Obtener todas las reservas con detalles de usuario y mesa
exports.getReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find().populate('usuario mesa');
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener reservas', error: error.message });
  }
};

// Cambiar el estado de una reserva (activa, cancelada, finalizada, etc.)
exports.cambiarEstadoReserva = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const actualizada = await Reserva.findByIdAndUpdate(id, { estado }, { new: true });
    if (!actualizada) return res.status(404).json({ mensaje: 'Reserva no encontrada' });

    res.json(actualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar estado', error: error.message });
  }
};
