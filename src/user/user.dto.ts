import { ApiProperty } from '@nestjs/swagger';

export class SignupRequestDto {
    @ApiProperty({
        description: 'The username of the user',
        example: 'johndoe',
      })
      username: string;
    
      @ApiProperty({
        description: 'The password of the user',
        example: 'mypassword',
      })
      password: string;
}


export class LoginRequestDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'mypassword',
  })
  password: string;
}
