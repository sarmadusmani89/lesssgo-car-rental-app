import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Req() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  // Removed global ADMIN role requirement to allow self-read
  findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;

    // Allow if Admin OR if reading own profile
    if (user.role !== Role.ADMIN && user.id !== id) {
      throw new ForbiddenException('You can only access your own account');
    }

    return this.usersService.findOne(id);
  }

  @Put(':id')
  // Removed global ADMIN role requirement for this route to allow self-updates
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: any) {
    const user = req.user;

    // Allow if Admin OR if updating own profile
    if (user.role !== Role.ADMIN && user.id !== id) {
      throw new ForbiddenException('You can only update your own account');
    }

    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
