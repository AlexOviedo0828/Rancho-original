const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// Registro de usuario
exports.registrar = async (req, res) => {
  try {
    const { nombre_completo, correo, contraseña, rol } = req.body;

    // Validar si el correo ya existe
    const existeUsuario = await Usuario.findOne({ correo });
    if (existeUsuario) return res.status(400).json({ mensaje: 'Correo ya registrado' });

    // Encriptar contraseña
    const contraseñaHash = await bcrypt.hash(contraseña, 10);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre_completo,
      correo,
      contraseña: contraseñaHash,
      rol
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login de usuario
exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({ correo }).populate('rol');
    if (!usuario) return res.status(400).json({ mensaje: 'Correo no registrado' });

    // Comparar contraseña
    const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
    if (!esValida) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol.nombre },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre_completo,
        correo: usuario.correo,
        rol: usuario.rol.nombre
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
