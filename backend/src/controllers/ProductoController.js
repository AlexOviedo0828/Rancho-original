const Producto = require('../models/Producto');

// Listar (solo activos)
exports.getAll = async (req, res) => {
  try {
    const productos = await Producto.find({ activo: true });
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear producto
exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria } = req.body;

    // ⚠️  Sin “/” inicial para evitar //uploads/
    const imagen = req.file ? `uploads/${req.file.filename}` : '';

    const producto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      imagen
    });

    await producto.save();
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar producto
exports.actualizarProducto = async (req, res) => {
  try {
    const actualizacion = {
      nombre:      req.body.nombre,
      descripcion: req.body.descripcion,
      precio:      req.body.precio,
      categoria:   req.body.categoria,
      activo:      req.body.activo === 'true' || req.body.activo === true
    };

    if (req.file) {
      actualizacion.imagen = `uploads/${req.file.filename}`; // misma corrección
    }

    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      actualizacion,
      { new: true }
    );

    res.json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar
exports.eliminarProducto = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener por ID
exports.getProductoPorId = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
    res.json(producto);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
};
