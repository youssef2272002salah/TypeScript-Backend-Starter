import { Server as SocketIOServer, Socket } from 'socket.io';
import { ChatService } from './chat.service';

export class ChatGateway {
  private io: SocketIOServer;

  constructor(
    io: SocketIOServer,
    private chatService: ChatService,
  ) {
    this.io = io;
    this.setupListeners();
  }

  private setupListeners() {
    this.io.on('connection', (socket: Socket) => {
      // console.log(`🔌 User connected: ${socket.id}`);

      // User joins a chat room
      socket.on('join chat', (room: string) => {
        socket.join(room);
        console.log(`📢 User joined room: ${room}`);
      });

      // Typing events
      socket.on('typing', (room: string) => {
        console.log(`📢 User is typing in room: ${room}`);
        socket.to(room).emit('typing');
      });

      socket.on('stop typing', (room: string) => {
        socket.to(room).emit('stop typing');
      });

      // New message event
      socket.on('new message', (newMessage) => {
        console.log('📢 New message:', newMessage);
        const chat = newMessage.chat;
        if (!chat?.users) return console.log('⚠️ chat.users not defined');

        const room = chat._id; // Chat ID as room
        socket.to(room).emit('message received', newMessage); // Send to everyone in the chat (except sender)

        // Send to sender explicitly
        socket.emit('message received', newMessage);
      });

      socket.on('disconnect', () => {
        // console.log(`❌ User disconnected: ${socket.id}`);
      });
    });
  }
}
