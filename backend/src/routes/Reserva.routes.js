const express = require('express');
const router = express.Router();
const ReservaController = require('../controllers/ReservaController');
const { verificarToken } = require('../middlewares/auth');
const { permitirRoles } = require('../middlewares/roles');

// Crear reserva
router.post('/', verificarToken, permitirRoles('usuario'), ReservaController.crearReserva);

// Obtener todas las reservas (admin)
router.get('/', verificarToken, permitirRoles('admin'), ReservaController.getReservas);

// Cambiar estado de una reserva
router.put('/:id/estado', verificarToken, permitirRoles('admin'), ReservaController.cambiarEstadoReserva);

module.exports = router;
