// src/user/user.controller.ts
import { Controller, Post, Body, Res, Req, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SignupRequestDto, LoginRequestDto } from './auth.dto';

@ApiTags('auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiBody({ description: 'User signup payload', type: SignupRequestDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created successfully' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async signup(@Body() body: SignupRequestDto, @Res() res) {
    const { username, password } = body;
    await this.authService.createUser(username, password);
    res.status(HttpStatus.CREATED).send({ message: 'User created successfully' });
  }

  @Post('login')
  @ApiBody({ description: 'User login payload', type: LoginRequestDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Invalid credentials' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  async login(@Body() body : LoginRequestDto, @Res() res, @Req() req) {

    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).send({ message: 'Invalid credentials' });
    }

    let token = await this.authService.login(user);
    res.status(HttpStatus.OK).send({ ...token, message: 'Login successful' });
  }

}
