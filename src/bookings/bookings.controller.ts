import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingDto } from './entities/booking.dto';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingService: BookingsService) {}

  @Post('/create')
  create(@Body() bookingDto: BookingDto): Promise<Booking> {
    return this.bookingService.create(bookingDto);
  }
}
