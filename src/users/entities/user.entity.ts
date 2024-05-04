import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, DeleteDateColumn } from 'typeorm';

@Entity('user')
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    unique: true
  })
  username: string;

  @Column({
    length: 50,
  })
  firstname: string;

  @Column({
    length: 50
  })
  lastname: string;


  @Column()
  picture: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @DeleteDateColumn({ nullable: true, default: null })
  deletedAt: Date; // Soft delete column
}
