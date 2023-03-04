import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 60,
          limit: 2, // Limit set to 2 requests in 30 seconds
        }),
        AppModule,
      ],
      providers: [
        {
          provide: ThrottlerGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should block requests after exceeding the throttle limit', async () => {
    // First request should be successful
    const response1 = await request(app.getHttpServer()).get('/owasp');
    console.log(response1.status);
    expect(response1.status).toBe(HttpStatus.OK);

    // Second request should also be successful
    const response2 = await request(app.getHttpServer()).get('/owasp');
    console.log(response2.status);
    expect(response2.status).toBe(HttpStatus.OK);

    // Third request should be blocked due to exceeding throttle limit
    const response3 = await request(app.getHttpServer()).get('/owasp');
    console.log(response3.status);
    expect(response3.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
  });
});
