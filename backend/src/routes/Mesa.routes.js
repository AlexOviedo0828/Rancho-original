const express = require('express');
const router = express.Router();
const MesaCtrl = require('../controllers/MesaController');

// listar
router.get('/', MesaCtrl.getMesas);

// crear
router.post('/', MesaCtrl.crearMesa);

// actualizar
router.put('/:id', MesaCtrl.actualizarMesa);

// eliminar
router.delete('/:id', MesaCtrl.eliminarMesa);
// mesas disponibles
router.get('/disponibles', MesaCtrl.getMesasDisponibles);

module.exports = router;
