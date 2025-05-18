const Mesa = require('../models/Mesa');


exports.getMesas = async (req, res) => {
  try {
    const mesas = await Mesa.find();
    res.json(mesas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getMesasDisponibles = async (req, res) => {
  try {
    const mesas = await Mesa.find({ estado: 'disponible' });
    res.json(mesas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener mesas disponibles' });
  }
};

exports.crearMesa = async (req, res) => {
  try {
    const { numero, capacidad, estado, ubicacion } = req.body;
    const mesa = new Mesa({ numero, capacidad, estado, ubicacion });
    await mesa.save();
    res.status(201).json(mesa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.actualizarMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const mesa = await Mesa.findByIdAndUpdate(id, req.body, { new: true });
    if (!mesa) return res.status(404).json({ mensaje: 'Mesa no encontrada' });
    res.json(mesa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.eliminarMesa = async (req, res) => {
  try {
    const { id } = req.params;
    const mesa = await Mesa.findByIdAndDelete(id);
    if (!mesa) return res.status(404).json({ mensaje: 'Mesa no encontrada' });
    res.json({ mensaje: 'Mesa eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
