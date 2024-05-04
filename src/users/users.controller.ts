import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() newUser: CreateUserDto) {
      newUser.salt= await bcrypt.genSalt();
      newUser.password=await bcrypt.hash(newUser.password,newUser.salt);
      const userCreated = await this.usersService.create(newUser);
      return userCreated;
  }
  
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number){
      return await this.usersService.softDeleteUser(id);
  }


  @Get('restore/:id')
  async restoreUser(@Param('id', ParseIntPipe) id: number) {
  return await this.usersService.restoreUser(id);
}

}
