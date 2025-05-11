const Rol = require('../models/Rol');

exports.getRoles = async (req, res) => {
  try {
    const roles = await Rol.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearRol = async (req, res) => {
  try {
    const rol = new Rol(req.body);
    await rol.save();
    res.status(201).json(rol);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// GET /api/roles/usuario
exports.obtenerRolPorNombre = async (req, res) => {
  try {
    const rol = await Rol.findOne({ nombre: req.params.nombre });
    if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' });
    res.json(rol);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

