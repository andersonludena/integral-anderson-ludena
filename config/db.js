const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/restauranteDB";
    await mongoose.connect(mongoURI);
    console.log('✅ Conectado exitosamente a MongoDB Compass');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
  }
};

module.exports = connectDB;