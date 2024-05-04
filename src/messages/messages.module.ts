import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { MessagesGateway } from './message.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { EmojiService } from 'src/emoji/emoji.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]),
  RedisModule,
  EmojiService
],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
