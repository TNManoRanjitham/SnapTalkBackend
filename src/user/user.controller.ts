// src/user/user.controller.ts
import { Controller, Post, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignupRequestDto, LoginRequestDto } from './user.dto';

@ApiTags('auth') 
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiBody({ description: 'User signup payload', type: SignupRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async signup(@Body() body: SignupRequestDto, @Res() res) {
    const { username, password } = body;
    await this.userService.createUser(username, password);
    res.status(HttpStatus.CREATED).send({ message: 'User created successfully' });
  }

  @Post('login')
  @ApiBody({ description: 'User login payload', type: LoginRequestDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async login(@Body() body : LoginRequestDto, @Res() res, @Req() req) {
    const { username, password } = body;
    const user = await this.userService.validateUser(username, password);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid credentials' });
    }

    res.status(HttpStatus.OK).send({ message: 'Login successful' });
  }

}
