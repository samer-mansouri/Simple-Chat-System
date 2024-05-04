import { Injectable } from '@nestjs/common';
import { CreateEmojiDto } from './dto/create-emoji.dto';
import { UpdateEmojiDto } from './dto/update-emoji.dto';
import { Emoji } from './entities/emoji.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessagesService } from 'src/messages/messages.service';

@Injectable()
export class EmojiService {
  constructor(
    @InjectRepository(Emoji)
    private emojiRepository: Repository<Emoji>,
    private messagesService: MessagesService,
  ) {}

  async create(createEmojiDto: CreateEmojiDto) {
    //find the message and user
    let message = await this.messagesService.findOne(createEmojiDto.messageId);

    if (!message) {
      return 'Message not found';
    }

    if (message[0].senderId === createEmojiDto.userId || message[0].receiverId === createEmojiDto.userId) {
        const newEmoji = new Emoji();
        newEmoji.emoji = createEmojiDto.emoji;
        newEmoji.userId = createEmojiDto.userId;
        newEmoji.messageId = createEmojiDto.messageId;
        let emojiToReturn = await this.emojiRepository.save(newEmoji);
        emojiToReturn = await this.emojiRepository.findOne({ where: { id: emojiToReturn.id }, relations: [ 'message'] });
        return emojiToReturn;
    }

    throw new Error('User not authorized to add emoji to this message');

  }

  findAll() {
    return `This action returns all emoji`;
  }

  findOne(id: number) {
    return `This action returns a #${id} emoji`;
  }

  update(id: number, updateEmojiDto: UpdateEmojiDto) {
    return `This action updates a #${id} emoji`;
  }

  remove(id: number) {
    return this.emojiRepository.delete(id);
  }
}
