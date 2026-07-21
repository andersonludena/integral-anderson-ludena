const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  rol: { type: String, enum: ['mozo', 'cocinero'], required: true }
});

module.exports = mongoose.model('User', UserSchema);