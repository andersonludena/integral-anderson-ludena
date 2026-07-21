const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  mesa: { type: String, required: true },
  platos: [{ type: String, required: true }],
  estado: { 
    type: String, 
    enum: ['Pendiente', 'En Preparación', 'Listo para Servir'], 
    default: 'Pendiente' 
  },
  mozoNombre: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);