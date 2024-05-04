import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Emoji } from 'src/emoji/entities/emoji.entity';

@Entity('message')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'senderId'  })
  senderId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;


  @Column({ name: 'receiverId'  })
  receiverId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'receiverId' })
  receiver: User;

  @Column('text')
  messageContent: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Emoji, emoji => emoji.message)
  emojis: Emoji[];


}