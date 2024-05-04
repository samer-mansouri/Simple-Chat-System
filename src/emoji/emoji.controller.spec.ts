import { Test, TestingModule } from '@nestjs/testing';
import { EmojiController } from './emoji.controller';
import { EmojiService } from './emoji.service';

describe('EmojiController', () => {
  let controller: EmojiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmojiController],
      providers: [EmojiService],
    }).compile();

    controller = module.get<EmojiController>(EmojiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
