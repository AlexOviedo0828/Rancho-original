const express = require('express');
const router = express.Router();
const PedidoController = require('../controllers/PedidoController');
const { verificarToken } = require('../middlewares/auth');

// Crear pedido
router.post('/', verificarToken, PedidoController.crearPedido);

// Obtener todos los pedidos
router.get('/', verificarToken, PedidoController.getPedidos);
// Obtener un pedido por ID
router.get('/:id', verificarToken, PedidoController.getPedidoPorId);

// 🔥 Agrega esta ruta
router.put('/:id', verificarToken, PedidoController.actualizarPedido);
// ✅ Actualizar pedido con ID (por ejemplo para agregar la reserva)
router.patch('/:id', verificarToken, PedidoController.actualizarPedidoConReserva);
router.patch('/:id/estado', verificarToken, PedidoController.actualizarEstadoPedido);
// Eliminar pedido
router.delete('/:id', verificarToken, PedidoController.eliminarPedido);

module.exports = router;
