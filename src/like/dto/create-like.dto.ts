import { IsNumber, IsDate } from 'class-validator';

export class CreateLikeDto {
    @IsNumber()
    userId: number;

    @IsNumber()
    messageId: number;

    @IsDate()
    createdAt: Date;
}
