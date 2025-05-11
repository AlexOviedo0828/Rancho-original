const { check } = require('express-validator');

exports.validarProducto = [
  check('nombre')
    .notEmpty().withMessage('El nombre del producto es obligatorio'),

  check('precio')
    .notEmpty().withMessage('El precio es obligatorio')
    .isNumeric().withMessage('El precio debe ser un número'),

  check('categoria')
    .notEmpty().withMessage('La categoría es obligatoria')
];
