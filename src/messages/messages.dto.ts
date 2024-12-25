import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty({ description: 'The ID of the sender', example: 'user123' })
  sender: string;

  @ApiProperty({ description: 'The ID of the recipient', example: 'user456' })
  recipient: string;

  @ApiProperty({ description: 'The content of the message', example: 'Hello, World!' })
  content: string;

  @ApiProperty({ description: 'DeviceId', example: 'UUID' })
  deviceId: string;
}

export class ReceiveMessageDto {
  @ApiProperty({ description: 'Unique identifier of the message' })
  _id: string;
  
  @ApiProperty({ description: 'The ID of the sender', example: 'user123' })
  sender: string;

  @ApiProperty({ description: 'The ID of the recipient', example: 'user456' })
  recipient: string;

  @ApiProperty({ description: 'The content of the message', example: 'Hello, World!' })
  content: string;

  @ApiProperty({ description: 'Timestamp of when the message was sent', example: '2024-01-01T12:34:56Z' })
  timestamp: string;
}
