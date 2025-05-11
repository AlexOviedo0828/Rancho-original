// Middleware para permitir acceso según el rol
exports.permitirRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
      const rolUsuario = req.usuario?.rol;
  
      if (!rolesPermitidos.includes(rolUsuario)) {
        return res.status(403).json({ mensaje: 'No tienes permiso para esta acción' });
      }
  
      next();
    };
  };
  