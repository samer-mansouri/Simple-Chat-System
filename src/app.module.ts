import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from 'nestjs-ioredis';
import { MessagesModule } from './messages/messages.module';
import { UsersModule } from './users/users.module';
import { EmojiModule } from './emoji/emoji.module';
import { LikeModule } from './like/like.module';
import * as dotenv from 'dotenv';


dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity{.ts,.js}'],
      autoLoadEntities: true,
      synchronize: true,
    }), 
    RedisModule.forRoot({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB),
    })
    , MessagesModule, UsersModule, EmojiModule, LikeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
