import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto){
    const newMessage = new Message();
    newMessage.senderId = createMessageDto.senderId;
    newMessage.messageContent = createMessageDto.messageContent;
    newMessage.receiverId = createMessageDto.receiverId;
    let messageToReturn = await this.messagesRepository.save(newMessage);

    messageToReturn = await this.messagesRepository.findOne({ where: { id: messageToReturn.id },
      relations: ['sender', 'receiver', 'emojis']
   });
   
    return messageToReturn;
  }

  findAll() {
    return `This action returns all messages`;
  }

  findOne(id: number) {
    return this.messagesRepository.findOne({ where: { id }, relations: ['sender', 'receiver'] })
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }

  async findOneToOneMessage(senderId: number, receiverId: number): Promise<Message[]> {
    return this.messagesRepository.find({
      where: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ],
      order: {
        createdAt: 'ASC'
      },
      relations: ['sender', 'receiver', 'emojis']
    });
  }

  // async findLastMessages(userId: number): Promise<Message[]> {
  //   // Define the subquery using query builder
  //   const subQuery = this.messagesRepository.createQueryBuilder('message')
  //     .select('MAX(message.id) AS maxId')
  //     .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
  //     .groupBy('LEAST(message.senderId, message.receiverId), GREATEST(message.senderId, message.receiverId)')
  //     .getRawMany();
  
  //   // Use the results from the subquery in the main query
  //   const lastMessageIds = await subQuery;
  //   const ids = lastMessageIds.map(item => item.maxId);
  
  //   // Now use these ids to fetch the latest messages
  //   const lastMessages = this.messagesRepository.createQueryBuilder('message')
  //     .where('message.id IN (:...ids)', { ids })
  //     .orderBy('message.createdAt', 'DESC')
  //     .getMany();
  
  //   return lastMessages;
  // }
  
  async findLastMessages(userId: number): Promise<Message[]> {

    const directMessageSubQuery = this.messagesRepository.createQueryBuilder('message')
    .select('MAX(message.id) AS maxId')
    .where('message.senderId = :userId OR message.receiverId = :userId', { userId })
    .groupBy('LEAST(message.senderId, message.receiverId), GREATEST(message.senderId, message.receiverId)')
    .getRawMany();


    const directMessageIds = (await directMessageSubQuery).map(item => item.maxId);

  const groupMessageSubQuery = this.messagesRepository.createQueryBuilder('message')
    .select('MAX(message.id) AS maxId')
    .innerJoin('message.room', 'room')
    .innerJoin('room.users', 'user', 'user.id = :userId', { userId })
    .groupBy('room.id')
    .getRawMany();

  const groupMessageIds = (await groupMessageSubQuery).map(item => item.maxId);

  const allMessageIds = [...directMessageIds, ...groupMessageIds];

  const lastMessages = await this.messagesRepository.createQueryBuilder('message')
    .where('message.id IN (:...allMessageIds)', { allMessageIds })
    .orderBy('message.createdAt', 'DESC')
    .getMany();

  return lastMessages;
}

  
  
  


}
