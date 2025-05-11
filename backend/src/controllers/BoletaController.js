const Boleta = require('../models/Boleta');
const Contador = require('../models/Contador');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const Pedido = require('../models/Pedido');
const Detalle = require('../models/DetallePedido');
const Producto = require('../models/Producto');
const Usuario = require('../models/Usuario');
const Mesa = require('../models/Mesa');
const Reserva = require('../models/Reserva');

const getNextBoleta = async () => {
  const result = await Contador.findOneAndUpdate(
    { nombre: 'boleta' },
    { $inc: { valor: 1 } },
    { new: true, upsert: true }
  );
  return result.valor;
};

exports.crearBoleta = async (req, res) => {
  try {
    const numero = await getNextBoleta();
    const { total_neto, pedido } = req.body;
    const iva = total_neto * 0.19;
    const total_final = total_neto + iva;

    const boleta = new Boleta({
      pedido,
      total_neto,
      iva,
      total_final,
      numero_boleta: numero
    });

    await boleta.save();
    res.status(201).json(boleta);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBoletas = async (req, res) => {
  try {
    const boletas = await Boleta.find().populate('pedido');
    res.json(boletas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.descargarBoleta = async (req, res) => {
  try {
    const boleta = await Boleta.findById(req.params.id).populate('pedido');
    if (!boleta) return res.status(404).json({ mensaje: 'Boleta no encontrada' });

    const pedido = await Pedido.findById(boleta.pedido._id).populate('usuario mesa');
    const usuario = pedido.usuario;
    const mesa = pedido.mesa;
    const detalles = await Detalle.find({ pedido: pedido._id }).populate('producto');

    const doc = new PDFDocument({ margin: 50 });
    const nombreArchivo = `boleta_${boleta.numero_boleta}.pdf`;
    const rutaArchivo = path.join(__dirname, '../uploads', nombreArchivo);

    const stream = fs.createWriteStream(rutaArchivo);
    doc.pipe(stream);

    doc.font('Helvetica').fontSize(20).text('Boleta de Compra - El Rancho', { align: 'center' }).moveDown();

    doc.fontSize(12).text(`Cliente: ${usuario.nombre_completo}`);
    doc.text(`Correo: ${usuario.correo}`);

    if (mesa) {
      doc.text(`Mesa: ${mesa.numero} - Sector: ${mesa.sector || 'No definido'}`);
    }

    doc.text(`Fecha Pedido: ${new Date(pedido.fecha).toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(14).text('Detalle de Productos:', { underline: true }).moveDown(0.5);
    detalles.forEach((item, index) => {
      const subtotal = item.producto.precio * item.cantidad;
      doc.fontSize(12).text(`${index + 1}. ${item.producto.nombre} - Cantidad: ${item.cantidad} - Subtotal: $${subtotal}`);
    });

    doc.moveDown();
    doc.fontSize(12).text(`Total Neto: $${boleta.total_neto}`);
    doc.text(`IVA (19%): $${boleta.iva}`);
    doc.text(`Total Final: $${boleta.total_final}`);

    doc.end();

    stream.on('finish', () => {
      res.download(rutaArchivo, nombreArchivo);
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getBoletaPorId = async (req, res) => {
  const { id } = req.params;

  // ① validar ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ mensaje: 'ID de boleta inválido' });
  }

  try {
    const boleta = await Boleta.findById(id).populate({
      path: 'pedido',
      populate: { path: 'usuario', select: 'nombre_completo correo' }
    });

    if (!boleta) return res.status(404).json({ mensaje: 'Boleta no encontrada' });

    res.json(boleta);

  } catch (e) {
    console.error(e);
    res.status(500).json({ mensaje: 'Error interno', error: e.message });
  }
};