const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db.js');
const Order = require('./models/Order.js');

console.log('⏳ Iniciando servidor Node.js...');

// Initialize Express & HTTP Server
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Endpoint usando Async/Await
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await Order.find().sort({ fecha: -1 });
    res.json(pedidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('⚡ Nuevo cliente conectado via WebSocket ID:', socket.id);

  socket.on('nuevo-pedido', async (datosPedido) => {
    try {
      const nuevoPedido = new Order(datosPedido);
      await nuevoPedido.save();
      io.emit('recibir-pedido', nuevoPedido);
      console.log(`📦 Nuevo pedido recibido para ${nuevoPedido.mesa}`);
    } catch (err) {
      console.error('Error al guardar pedido:', err);
    }
  });

  socket.on('cambiar-estado', async ({ pedidoId, nuevoEstado }) => {
    try {
      const pedidoActualizado = await Order.findByIdAndUpdate(
        pedidoId, 
        { estado: nuevoEstado }, 
        { new: true }
      );
      io.emit('estado-actualizado', pedidoActualizado);
      console.log(`🔄 Pedido ${pedidoId} cambió a estado: ${nuevoEstado}`);
    } catch (err) {
      console.error('Error al actualizar estado:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Cliente desconectado ID:', socket.id);
  });
});

// Iniciar servidor inmediatamente
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  // Conectar a la BD justo después
  connectDB();
});