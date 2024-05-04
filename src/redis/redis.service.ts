import { Injectable } from '@nestjs/common';
import { InjectRedisClient } from 'nestjs-ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedisClient() private readonly redisClient: Redis) {}

  async addConnection(userId: string, clientId: string): Promise<void> {
    await this.redisClient.sadd(`user:${userId}:sockets`, clientId);
  }

  async removeConnection(userId: string, clientId: string): Promise<void> {
    await this.redisClient.srem(`user:${userId}:sockets`, clientId);
  }

  async getConnections(userId: string): Promise<string[]> {
    return await this.redisClient.smembers(`user:${userId}:sockets`);
  }
}