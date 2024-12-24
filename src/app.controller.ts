import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health') // Change path to '/health'
export class AppController {
  // Health check endpoint
  @ApiOperation({ summary: 'Checks if the service is healthy' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      example: { status: 'Healthy' },
    },
  })
  @Get()
  getHealthStatus(): { status: string } {
    return { status: 'Healthy' };
  }
}
