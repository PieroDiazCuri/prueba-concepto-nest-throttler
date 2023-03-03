import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';
@Controller('owasp')
export class AppController {
  constructor(private readonly appService: AppService) {}
  // @UseGuards(ThrottlerGuard)
  @Get()
  @Throttle(5, 30)
  getHello(): string {
    return this.appService.getHello();
  }
}
