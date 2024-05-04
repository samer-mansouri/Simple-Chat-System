import { Module, forwardRef } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { EmojiController } from './emoji.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Emoji } from './entities/emoji.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { MessagesService } from 'src/messages/messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Emoji]),
    forwardRef(() => MessagesModule)
  ],
  controllers: [EmojiController],
  providers: [EmojiService],
  exports: [EmojiService]
})
export class EmojiModule {}
