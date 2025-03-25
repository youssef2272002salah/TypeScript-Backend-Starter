import dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import process from 'process';
import app from './app';
import dbConnect from './config/database';
import { Server as SocketIOServer } from 'socket.io';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatService } from './modules/chat/chat.service';

// // Cluster Mode (Only in the primary process)

// import cluster from 'cluster';
// import os from 'os';
// const numCPUs = os.cpus().length;

// if (cluster.isPrimary) {
//   console.log(`Primary process ${process.pid} is running`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.error(`Worker ${worker.process.pid} died. Restarting...`);
//     cluster.fork();
//   });
// } else
{
  dbConnect();

  const PORT = process.env.PORT || 3001;

  const httpServer = http.createServer(app);

  // Initialize Socket.IO
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // Initialize Chat Gateway
  const chatService = new ChatService();
  new ChatGateway(io, chatService);

  httpServer.listen(PORT, () => {
    console.log(`🚀 Worker ${process.pid} running on port ${PORT}`);
  });

  module.exports = { io };
}
