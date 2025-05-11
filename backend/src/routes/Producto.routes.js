const express = require('express');
const router  = express.Router();

const ProductoController = require('../controllers/ProductoController');
const { verificarToken } = require('../middlewares/auth');
const { permitirRoles  } = require('../middlewares/roles');
const upload             = require('../middlewares/upload');
const { validarProducto } = require('../Validations/ProductoValidator');
const validarCampos       = require('../middlewares/validarCampos');

// Crear
router.post(
  '/',
  verificarToken,
  permitirRoles('admin'),
  upload.single('imagen'),
  validarProducto,
  validarCampos,
  ProductoController.crearProducto
);

// Listar todos (activos)
router.get('/', ProductoController.getAll);

// Obtener uno
router.get('/:id', ProductoController.getProductoPorId);

// Actualizar
router.put(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  upload.single('imagen'),
  ProductoController.actualizarProducto
);

// Eliminar
router.delete(
  '/:id',
  verificarToken,
  permitirRoles('admin'),
  ProductoController.eliminarProducto
);
router.patch('/pedidos/:id', async (req, res) => {
  try {
    const pedidoActualizado = await Pedido.findByIdAndUpdate(
      req.params.id,
      { reserva: req.body.reserva },
      { new: true }
    );
    res.json(pedidoActualizado);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar pedido' });
  }
});

module.exports = router;
