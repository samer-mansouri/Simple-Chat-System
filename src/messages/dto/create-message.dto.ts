import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsInt()
  @IsNotEmpty()
  senderId: number;

  @IsInt()
  @IsNotEmpty()
  receiverId?: number;

  @IsString()
  @MaxLength(500) // Adjust the max length based on your requirements
  messageContent: string;


}
