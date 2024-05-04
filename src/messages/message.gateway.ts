import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { MessagesService } from 'src/messages/messages.service';
import { RedisService } from 'src/redis/redis.service';
import { EmojiService } from 'src/emoji/emoji.service';

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
        @Inject(forwardRef(() => EmojiService)) private emojiService: EmojiService,
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


    @SubscribeMessage('getAllMessages')
    getAllMessages(@ConnectedSocket() client: Socket): any {
        this.logger.debug(`Fetching all messages for client: ${client.id}`);
        return "Hello from getAllMessages!"
    }
    



    private async broadcastToSockets(receiverId: number, event: string, data: any, senderId?: number): Promise<void> {
        const receiverSockets = await this.redisSerice.getConnections(receiverId.toString());
        const senderSockets = senderId ? await this.redisSerice.getConnections(senderId.toString()) : [];
        const allSockets = [...receiverSockets, ...senderSockets];
        console.log("Sockets: ", allSockets);
        allSockets.forEach(socketId => {
            console.log("Sending message to socket: ", socketId);
            this.server.to(socketId).emit(event, data);
        });
        this.logger.debug(`Sent direct message to ${receiverId}`);
    }
    

    @SubscribeMessage('addMessage')
    async addMessage(@MessageBody() messageDto: CreateMessageDto) {
        const newMessage = await this.messagesService.create(messageDto);
        await this.broadcastToSockets(messageDto.receiverId, 'new-message', newMessage, messageDto.senderId);
    }

    @SubscribeMessage('addEmoji')
    async addEmoji(@MessageBody() emojiDto: any) {
        const newEmoji = await this.emojiService.create(emojiDto);
        const message = newEmoji[0].message;
        await this.broadcastToSockets(message.receiverId, 'new-emoji', newEmoji, message.senderId);
    }

}
