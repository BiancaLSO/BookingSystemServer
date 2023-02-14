import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { BookingDto } from './../src/bookings/entities/booking.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Booking } from './../src/bookings/entities/booking.entity';
import { Connection, Repository } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let bookingRepo: Repository<Booking>;
  let connection: Connection;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    bookingRepo = moduleFixture.get(getRepositoryToken(Booking));

    connection = moduleFixture.get(Connection);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await connection.dropDatabase();
    await connection.runMigrations();
    await moduleFixture.close();
  });

  describe('GET Bookings', () => {
    it('should retrieve all bookings', async () => {
      await Promise.all([
        bookingRepo.insert(
          new BookingDto(
            'Lisa',
            2,
            new Date(2023, 0, 15),
            '1234567',
            'lisa@gmail.com',
            'Allergic to nuts',
          ),
        ),
        bookingRepo.insert(
          new BookingDto(
            'Jisoo',
            4,
            new Date(2023, 2, 15),
            '1234567',
            'jisoo@gmail.com',
            'Table by the window',
          ),
        ),
        bookingRepo.insert(
          new BookingDto(
            'Rose',
            4,
            new Date(2023, 3, 20),
            '1234567',
            'rose@gmail.com',
            'One vegan',
          ),
        ),
      ]);

      // Act
      const { body }: { body: Booking[] } = await request(app.getHttpServer())
        .get('/booking')
        .expect(200);

      // Assert
      expect(body.length).toEqual(3);
    });
  });

  describe('POST a Booking', () => {
    it('should create a new valid booking', async () => {
      const booking = new BookingDto(
        'Minnie',
        5,
        new Date(),
        '1234567',
        'minnie@yahoo.com',
        'Allergic to garlic',
      );

      // Act
      const { body } = await request(app.getHttpServer())
        .post('/booking')
        .send(booking)
        .expect(201);

      // Assert
      expect(body.name).toEqual('Minnie');
    });
  });

  afterAll(() => {
    app.close;
  });
});
