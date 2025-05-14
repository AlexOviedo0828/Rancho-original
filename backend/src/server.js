// Importaciones
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Inicializar variables de entorno
dotenv.config();

// App Express
const app = express();

app.use(cors({
  origin: ['https://el-rancho-ten.vercel.app', 'https://el-rancho-2.onrender.com','http://localhost:4200'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error en MongoDB:', err));

// Importar rutas
const usuarioRoutes = require('./routes/Usuario.routes');
const rolRoutes = require('./routes/Rol.routes');
const productoRoutes = require('./routes/Producto.routes');
const reservaRoutes = require('./routes/Reserva.routes');
const pedidoRoutes = require('./routes/Pedido.routes');
const boletaRoutes = require('./routes/Boleta.routes');
const mesaRoutes = require('./routes/Mesa.routes');
const chatRoutes = require('./routes/chat.routes');

// Rutas base
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/boletas', boletaRoutes);
app.use('/api/mesas', mesaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mensajes', chatRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('🔥 Bienvenido a El Rancho API Backend');
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
});
