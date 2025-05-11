const express           = require('express');
const router            = express.Router();
const ChatCtrl          = require('../controllers/ChatController');
const { verificarToken }= require('../middlewares/auth');

/* ==== Rutas CRUD de mensajes ==== */
router.post('/',               verificarToken, ChatCtrl.crearMensaje);
router.get ('/',               verificarToken, ChatCtrl.getMensajes);
router.put ('/:id/responder',  verificarToken, ChatCtrl.responderMensaje);
router.delete('/limpiar',      verificarToken, ChatCtrl.borrarMensajesUsuario);

/* ==== Hilos para vista de cocina ==== */
router.get('/hilos',                 verificarToken, ChatCtrl.getHilos);
router.get('/hilos/:usuarioId',      verificarToken, ChatCtrl.getHiloPorUsuario);

module.exports = router;
