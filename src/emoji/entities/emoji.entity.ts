import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('emoji')
export class Emoji {
    @PrimaryGeneratedColumn()
    id: number;

    emoji: number;
    
    @Column()
    userId: number;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    messageId: number;

    @ManyToOne(() => Message, message => message.emojis)
    @JoinColumn({ name: 'messageId' })
    message: Message;

    @CreateDateColumn()
    createdAt: Date;
}
