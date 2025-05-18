
const Usuario  = require('../models/Usuario');
const Rol      = require('../models/Rol');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto-super-rancho';

exports.login = async (req, res) => {
  console.log('➡️ Iniciando login');
  console.log('🔍 Body recibido:', req.body);

  try {
    const { correo, contrasena } = req.body;

    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'Faltan credenciales' });
    }

    const usuario = await Usuario
      .findOne({ correo })
      .select('+contrasena')
      .populate('rol');

    console.log(' Usuario encontrado:', usuario);

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Correo no registrado' });
    }

    const hash = usuario.contrasena;
    if (!hash) {
      return res.status(400).json({ mensaje: 'Usuario sin contraseña válida' });
    }

    const valido = await bcrypt.compare(contrasena, hash);
    console.log('🔍 Contraseña válida?', valido);

    if (!valido) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      {
        _id: usuario._id, // Usa _id en lugar de id
        rol: usuario.rol.nombre,
        nombre_completo: usuario.nombre_completo
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );
    

    console.log('✅ Token generado');
    res.json({ token, usuario: { _id: usuario._id, rol: usuario.rol.nombre } });

  } catch (err) {
    console.error('❌ Error en login:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


exports.crearUsuario = async (req, res) => {
  try {
    let { nombre_completo, correo, contrasena, contraseña, rol } = req.body;
    const passwordPlain = contrasena ?? contraseña;
    if (!passwordPlain) return res.status(400).json({ mensaje: 'La contraseña es obligatoria' });

  
    if (typeof rol === 'string' && !rol.match(/^[0-9a-fA-F]{24}$/)) {
      const rolDoc = await Rol.findOne({ nombre: rol });
      if (!rolDoc) return res.status(400).json({ mensaje: 'Rol no válido' });
      rol = rolDoc._id;
    }

   
    const hash = await bcrypt.hash(passwordPlain, 10);

    
    const nuevoUsuario = new Usuario({
      nombre_completo,
      correo,
      contrasena: hash,
      rol
    });

    await nuevoUsuario.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario', detalle: error.message });
  }
};


exports.getUsuarios = async (_req, res) => {
  try {
    const usuarios = await Usuario.find().populate('rol');
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).populate('rol');
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.actualizarUsuario = async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.contrasena || data.contraseña) {
      const nueva = data.contrasena || data.contraseña;
      data.contrasena = await bcrypt.hash(nueva, 10);
      delete data.contraseña;
    }

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.crearDesdeAdmin = async (req, res) => {
  try {
    const { nombre_completo, correo, contrasena, contraseña, rol } = req.body;
    const password = contrasena ?? contraseña;

    if (!nombre_completo || !correo || !password || !rol) {
      return res.status(400).json({ mensaje: 'Campos incompletos' });
    }

   
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(409).json({ mensaje: 'Correo ya registrado' });

  
    let rolFinal = rol;
    if (typeof rol === 'string' && !rol.match(/^[0-9a-fA-F]{24}$/)) {
      const rolDoc = await Rol.findOne({ nombre: rol });
      if (!rolDoc) return res.status(400).json({ mensaje: 'Rol no válido' });
      rolFinal = rolDoc._id;
    }

    
    const hash = await bcrypt.hash(password, 10);

   
    const nuevoUsuario = new Usuario({
      nombre_completo,
      correo,
      contrasena: hash,
      rol: rolFinal
    });

    const guardado = await nuevoUsuario.save();
    res.status(201).json(guardado);

  } catch (error) {
    console.error('❌ Error al crear usuario desde admin:', error);
    res.status(500).json({ mensaje: 'Error interno', error });
  }
};
exports.registrar = async (req, res) => {
  try {
    const { nombre_completo, correo, contrasena } = req.body;

    const hash = await bcrypt.hash(contrasena, 10);

    const nuevo = new Usuario({
      nombre_completo,
      correo,
      contrasena: hash, 
    });

    await nuevo.save();
    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('❌ Error al registrar:', error);
    res.status(500).json({ mensaje: 'Error interno' });
  }
};