// src/user/user.controller.ts
import { Controller, Get , UseGuards, Query} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('user') 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Query('userId') userId: string) {
    return this.userService.getUsers(userId);
  }

}
