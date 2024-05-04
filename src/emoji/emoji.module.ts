import { Module } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { EmojiController } from './emoji.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emoji } from './entities/emoji.entity';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Emoji]), MessagesService],
  controllers: [EmojiController],
  providers: [EmojiService],
})
export class EmojiModule {}
