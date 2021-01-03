import http from 'http';
import debug from 'debug';
import { config } from 'dotenv';
import socketioJwt from 'socketio-jwt';
import chatController from './controllers/chat.controller';
import app from './app';
import './db/mongoose';

config();

const {
  newChatMessage,
} = chatController;
const DEBUG = debug('dev');
const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DEL'],
  },
});

// io.use(socketioJwt.authorize({
//   secret: jwtPublicSecret,
//   handshake: true,
//   callback: false,
// }));

io.on('connection', (socket) => {
  DEBUG('User connected to the socket');
  socket.on('connect room', (room) => {
    socket.join(room);
    socket.on('chat message', (message) => {
      console.log(message);
      newChatMessage(message).then((userMessage) => {
        if (userMessage !== undefined) {
          socket.to(room).emit('received message', userMessage);
        }
      });
    });
  });

  socket.on('leave room', (room) => {
    socket.leave(room);
  });

  socket.on('disconnect', (reason) => {
    DEBUG(`User disconnected from socket: ${reason}`);
  });
});

process.on('uncaughtException', (error) => {
  DEBUG(`uncaught exception: ${error.message}`);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  DEBUG(err);
  DEBUG('Unhandled Rejection:', {
    name: err.name,
    message: err.message || err,
  });
  process.exit(1);
});

server.listen(PORT, () => {
  DEBUG(
    `server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
  );
});
