import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmojiService } from './emoji.service';
import { CreateEmojiDto } from './dto/create-emoji.dto';
import { UpdateEmojiDto } from './dto/update-emoji.dto';

@Controller('emoji')
export class EmojiController {
  constructor(private readonly emojiService: EmojiService) {}

  @Post()
  create(@Body() createEmojiDto: CreateEmojiDto) {
    return this.emojiService.create(createEmojiDto);
  }

  // @Get()
  // findAll() {
  //   return this.emojiService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.emojiService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEmojiDto: UpdateEmojiDto) {
  //   return this.emojiService.update(+id, updateEmojiDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emojiService.remove(+id);
  }
}
