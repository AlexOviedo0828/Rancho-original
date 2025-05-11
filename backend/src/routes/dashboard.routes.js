const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { verificarToken } = require('../middlewares/auth');
const { permitirRoles } = require('../middlewares/roles');

router.get('/', verificarToken, permitirRoles('admin'), DashboardController.getResumen);

module.exports = router;
