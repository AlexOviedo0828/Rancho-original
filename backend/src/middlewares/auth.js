// middlewares/verificarToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Asegúrate de que esté presente para cargar el .env
const JWT_SECRET = process.env.JWT_SECRET;

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // Verifica que el header Authorization exista
  if (!authHeader) {
    console.warn('🚫 Token no proporcionado');
    return res.status(403).json({ mensaje: 'Token no proporcionado' });
  }

  // Extrae el token del header
  const token = authHeader.split(' ')[1];

  if (!token) {
    console.warn('⚠️ Token mal formado');
    return res.status(403).json({ mensaje: 'Token mal formado' });
  }

  try {
    // Verifica el token con el secreto
    const decoded = jwt.verify(token, JWT_SECRET);

    // Puedes imprimir el usuario decodificado para debug
    console.log('✅ Token válido, usuario:', decoded);

    req.usuario = decoded;
    next();
  } catch (err) {
    console.error('❌ Error al verificar token:', err.message);
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};
