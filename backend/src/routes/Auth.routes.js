const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validarRegistro } = require('../Validations/usuarioValidator');
const validarCampos = require('../middlewares/validarCampos');

router.post('/registro', validarRegistro, validarCampos, AuthController.registrar);
router.post('/login', AuthController.login);

module.exports = router;
