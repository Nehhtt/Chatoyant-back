import http from 'http';
import debug from 'debug';
import { config } from 'dotenv';
import socketioJwt from 'socketio-jwt';
import app from './app';
import './db/mongoose';

config();

const DEBUG = debug('dev');
const PORT = process.env.PORT || 8080;
const jwtPublicSecret = process.env.JWT_PUBLIC_SECRET.replace(/\\n/g, '\n');

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
  socket.on('chat message', (message) => {
    //const message = req.message;
    console.log(message)
    socket.broadcast.emit('received message', message);
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
