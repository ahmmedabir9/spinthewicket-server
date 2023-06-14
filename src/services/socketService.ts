import { Server, Socket } from 'socket.io';

export class SocketService {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public broadcastToGroup(groupName: string, event: string, payload: any): void {
    this.io.to(groupName).emit(event, payload);
  }

  public handleConnection(socket: Socket): void {
    console.log('A user connected.');

    socket.on('disconnect', () => {
      console.log('A user disconnected.');
    });
  }
}
