// src/user/user.controller.ts
import { Controller, Post, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() body, @Res() res) {
    const { username, password } = body;
    await this.userService.createUser(username, password);
    res.status(HttpStatus.CREATED).send({ message: 'User created successfully' });
  }

  @Post('login')
  async login(@Body() body, @Res() res, @Req() req) {
    const { username, password } = body;
    const user = await this.userService.validateUser(username, password);
    console.log(user);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid credentials' });
    }

    res.status(HttpStatus.OK).send({ message: 'Login successful' });
  }

}
