const { Types }   = require('mongoose');
const Mensaje     = require('../models/Mensaje');

/* ================= CREAR MENSAJE ================= */
async function crearMensaje (req, res) {
  try {
    /* si el middleware no adjuntó el usuario → 401 */
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Token faltante o inválido' });
    }

    const { mensaje, rol, emisor, usuarioId } = req.body;
    const { _id: tId, rol: tRol }            = req.usuario;

    const _mensaje   = (mensaje || '').trim();
    const _rol       = (rol || tRol || '').trim();
    const _emisor    = emisor    || tId;          // SIEMPRE hay emisor
    let   _usuarioId = usuarioId || tId;          // dueño del hilo

    /* cocina debe indicar a qué cliente escribe */
    if (_rol === 'cocina' && !usuarioId) {
      return res.status(400).json({ mensaje: 'Falta usuarioId para cocina' });
    }

    /* validaciones mínimas */
    if (!_mensaje || !_rol || !_emisor || !_usuarioId) {
      return res.status(400).json({ mensaje: '❌ Faltan campos obligatorios' });
    }

    /* aseguramos que sean ObjectId válidos */
    if (!Types.ObjectId.isValid(_emisor) || !Types.ObjectId.isValid(_usuarioId)) {
      return res.status(400).json({ mensaje: 'IDs inválidos' });
    }

    const nuevo = await Mensaje.create({
      mensaje  : _mensaje,
      rol      : _rol,
      emisor   : _emisor,
      usuarioId: _usuarioId,
      fecha    : new Date()
    });

    res.status(201).json(nuevo);
  } catch (err) {
    console.error('❌ Error al crear mensaje:', err);
    res.status(500).json({ mensaje: 'Error interno', err });
  }
}

/* ============ OBTENER MENSAJES (usuario / cocina) ============ */
async function getMensajes (req, res) {
  try {
    if (!req.usuario) {
      return res.status(401).json({ mensaje: 'Token faltante o inválido' });
    }

    const { _id: uid, rol } = req.usuario;

    const filtro = (rol === 'cocina' || rol === 'admin')
    ? { usuarioId: req.query.uid, rol: { $in: ['usuario', 'cocina'] } }
    : { usuarioId: uid };
  

    const mensajes = await Mensaje.find(filtro).sort({ fecha: 1 });
    res.json(mensajes);
  } catch (err) {
    console.error('❌ Error al obtener mensajes:', err);
    res.status(500).json({ mensaje: 'Error interno', err });
  }
}

/* ============ RESPONDER MENSAJE ============ */
async function responderMensaje (req, res) {
  try {
    const { id } = req.params;
    const { respuesta } = req.body;

    const actualizado = await Mensaje.findByIdAndUpdate(
      id,
      { respuesta, respondido: true },
      { new: true }
    );
    res.json(actualizado);
  } catch (err) {
    console.error('❌ Error al responder mensaje:', err);
    res.status(500).json({ mensaje: 'Error interno', err });
  }
}

/* ============ BORRAR MENSAJES de un usuario (logout) ============ */
async function borrarMensajesUsuario (req, res) {
  try {
    if (!req.usuario) return res.status(401).json({ mensaje: 'Token inválido' });
    await Mensaje.deleteMany({ usuarioId: req.usuario._id });
    res.json({ mensaje: 'Mensajes eliminados' });
  } catch (err) {
    console.error('❌ Error al borrar mensajes:', err);
    res.status(500).json({ mensaje: 'Error interno', err });
  }
}

/* ============ LISTA DE HILOS (solo cocina/admin) ============ */
async function getHilos (req, res) {
  try {
    if (!req.usuario || !['cocina', 'admin'].includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'Solo cocina/admin' });
    }

    const hilos = await Mensaje.aggregate([
      { $match: { rol: { $in: ['usuario', 'cocina'] } } },
      { $sort : { fecha: -1 } },
      { $group: {
          _id          : '$usuarioId',
          ultimoMensaje: { $first: '$mensaje' },
          fecha        : { $first: '$fecha' },
          sinLeer      : {
            $sum: {
              $cond: [
                { $and: [ { $eq: ['$rol', 'usuario'] }, { $eq: ['$respondido', false] } ] },
                1, 0
              ]
            }
          }
        }
      },
      { $lookup: {
          from        : 'usuarios',
          localField  : '_id',
          foreignField: '_id',
          as          : 'usuario'
        }
      },
      { $unwind: '$usuario' },
      { $project: {
          usuarioId: '$_id',
          nombre   : '$usuario.nombre_completo',
          ultimoMensaje: 1,
          fecha    : 1,
          sinLeer  : 1,
          _id      : 0
        }
      },
      { $sort: { fecha: -1 } }
    ]);

    res.json(hilos);
  } catch (err) {
    console.error('❌ Error al obtener hilos:', err);
    res.status(500).json({ mensaje: 'Error interno', err });
  }
}

/* ============ MENSAJES DE UN HILO ESPECÍFICO ============ */
async function getHiloPorUsuario (req, res) {
  try {
    if (!req.usuario) return res.status(401).json({ mensaje: 'Token inválido' });

    const { _id: uid, rol } = req.usuario;
    const { usuarioId }     = req.params;

    if (!Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ mensaje: 'usuarioId inválido' });
    }
    if (rol === 'usuario' && (!uid || uid.toString() !== usuarioId)) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }

    const mensajes = await Mensaje.find({
      usuarioId,
      rol: { $in: ['usuario', 'cocina'] }
    }).sort({ fecha: 1 });

    res.json(mensajes);
  } catch (err) {
    console.error('❌ Error al obtener hilo:', err);
    res.status(500).json({ mensaje: 'Error interno', err });
  }
}

/* -------------------------------------------------- */
module.exports = {
  crearMensaje,
  getMensajes,
  responderMensaje,
  borrarMensajesUsuario,
  getHilos,
  getHiloPorUsuario
};
