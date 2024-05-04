import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Logger } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  cors: {
    origin: '*', // Allowing all origins for CORS
  },
})

export class MessagesGateway {
    @WebSocketServer()
    server: Server;


    constructor(
        private readonly messagesService: MessagesService,
        private readonly redisSerice: RedisService,
    ) {
    }


    private readonly logger = new Logger(MessagesGateway.name);

    afterInit(): void {
        this.logger.log('WebSocket Gateway Initialized');
    }

    async handleConnection(client: Socket): Promise<void> {
        const userId = client.handshake.query.userId;
        if (!userId) {
            client.disconnect();
            return;
        } else {
            await this.redisSerice.addConnection(userId.toString(), client.id);

        }

    }
  
    handleDisconnect(client: Socket): void {
        const userId = client.handshake.query.userId;
        this.redisSerice.removeConnection(userId.toString(), client.id);
    }

    @SubscribeMessage('message')
    handleMessage(): string {
        this.logger.debug('Handling "message" event');
        return 'Hello world!';
    }

    // @SubscribeMessage('getAllMessages')
    // getAllMessages(@ConnectedSocket() client: Socket): Message[] {
    //     this.logger.debug(`Fetching all messages for client: ${client.id}`);
    //     return this.messages;
    // }

    @SubscribeMessage('getAllMessages')
    getAllMessages(@ConnectedSocket() client: Socket): any {
        this.logger.debug(`Fetching all messages for client: ${client.id}`);
        return "Hello from getAllMessages!"
    }

    private async broadcastDirectMessage(receiverId: number, event: string, message: any): Promise<void> {
        const sockets = await this.redisSerice.getConnections(receiverId.toString());
        const senderSockets = await this.redisSerice.getConnections(message.senderId);
        const allSockets = [...sockets, ...senderSockets];
        console.log("Sockets: ", sockets);
        allSockets.forEach(socketId => {
            console.log("Sending message to socket: ", socketId);
            this.server.to(socketId).emit(event, message);
        });
        this.logger.debug(`Sent direct message to ${receiverId}`);
    }


    @SubscribeMessage('addMessage')
    async addMessage(@MessageBody() messageDto: CreateMessageDto) {
       
        const newMessage = await this.messagesService.create(messageDto);

        if(!newMessage.roomId) {

            this.broadcastDirectMessage(messageDto.receiverId, 'new-message', newMessage);

        } 
        
    }
}
