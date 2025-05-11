const { check } = require('express-validator');

exports.validarRegistro = [
  check('nombre_completo')
    .notEmpty().withMessage('El nombre completo es obligatorio'),

  check('correo')
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Debe ser un correo válido'),

  check('contraseña')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('Debe tener al menos 6 caracteres'),

  check('rol')
    .notEmpty().withMessage('El rol es obligatorio'),
];
