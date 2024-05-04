import { PartialType } from '@nestjs/mapped-types';
import { CreateEmojiDto } from './create-emoji.dto';

export class UpdateEmojiDto extends PartialType(CreateEmojiDto) {}
