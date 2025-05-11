const express = require('express');
const router  = express.Router();
const UsuarioController = require('../controllers/UsuarioController');
const { verificarToken } = require('../middlewares/auth');
const { permitirRoles }  = require('../middlewares/roles');

/* Rutas públicas */
router.post('/login',    UsuarioController.login);
router.post('/registro', UsuarioController.crearUsuario);

/* Rutas protegidas */
router.get('/',        verificarToken, permitirRoles('admin'), UsuarioController.getUsuarios);
router.get('/:id',     verificarToken, UsuarioController.getUsuarioPorId);
router.put('/:id',     verificarToken, UsuarioController.actualizarUsuario);
router.delete('/:id',  verificarToken, permitirRoles('admin'), UsuarioController.eliminarUsuario);
router.post('/crear-desde-admin', verificarToken, permitirRoles('admin'), UsuarioController.crearDesdeAdmin);

module.exports = router;
