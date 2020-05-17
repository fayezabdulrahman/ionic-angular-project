import { BookingsService } from './service/bookings.service';
import { Component, OnInit } from '@angular/core';
import { Booking } from './model/booking.mode';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[];
  constructor(private bookingsService: BookingsService) { }

  ngOnInit() {
    this.loadedBookings = this.bookingsService.bookings;
  }

  cancelBooking(bookingId: string, slidingBooking: IonItemSliding) {
    slidingBooking.close();
    // TODO: implement cancel Id functionality 
  }

}
