const express = require('express');
const router = express.Router();
const RolController = require('../controllers/RolController');
// const { verificarToken } = require('../middlewares/auth');
// const { permitirRoles } = require('../middlewares/roles');

// ⚠️ Temporalmente sin token ni permisos:
router.post('/', RolController.crearRol);

router.get('/', RolController.getRoles); // también se puede usar sin token al principio
router.get('/:nombre', RolController.obtenerRolPorNombre);

module.exports = router;
