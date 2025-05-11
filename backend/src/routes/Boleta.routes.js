const express = require('express');
const router = express.Router();
const BoletaController = require('../controllers/BoletaController');
const { verificarToken } = require('../middlewares/auth');

// Esta ruta debe ir antes que la de '/:id/descargar'
//router.get('/pedido/:pedidoId', verificarToken, BoletaController.getBoletaPorPedido);

// Rutas
router.post('/', verificarToken, BoletaController.crearBoleta);
router.get('/', verificarToken, BoletaController.getBoletas);
router.get('/:id/descargar', verificarToken, BoletaController.descargarBoleta);
router.get('/:id', verificarToken, BoletaController.getBoletaPorId);        
module.exports = router;
