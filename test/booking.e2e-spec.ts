import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { BookingDto } from './../src/bookings/entities/booking.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should create a new valid booking (POST)', async () => {
    const booking = new BookingDto(
      'Minnie',
      5,
      new Date(),
      '1234567',
      'minnie@yahoo.com',
      'Allergic to garlic',
    );

    const { body } = await request(app.getHttpServer())
      .post('/bookings')
      .send(booking)
      .expect(201);

    expect(body.name).toEqual('Minnie');
  });

  afterAll(() => {
    app.close;
  });
});
