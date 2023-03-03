import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Prueba de concepto nestjs/throttler';
  }
}
