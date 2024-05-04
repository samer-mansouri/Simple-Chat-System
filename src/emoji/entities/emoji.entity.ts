import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';

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

    @ManyToOne(() => Message)
    @JoinColumn({ name: 'messageId' })
    message: Message;

    @CreateDateColumn()
    createdAt: Date;
}
