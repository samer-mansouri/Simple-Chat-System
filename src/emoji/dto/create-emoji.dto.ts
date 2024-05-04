import { IsNumber, IsDate } from 'class-validator';

export class CreateEmojiDto {
    @IsNumber()
    emoji: number;

    @IsNumber()
    userId: number;

    @IsNumber()
    messageId: number;

}
