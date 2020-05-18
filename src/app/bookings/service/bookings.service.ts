import { LoadingController } from '@ionic/angular';
import { AuthService } from './../../auth/service/auth.service';
import { Injectable } from '@angular/core';
import { take, map, tap, delay } from 'rxjs/operators';
import { Booking } from '../model/booking.mode';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(private authService: AuthService) { }

  get bookings() {
    return this._bookings.asObservable();
  }

  addBooking(
    placeId: string,
    placeTitle: string,
    placeImg: string,
    firstName: string,
    lastName: string,
    guestNumber: number,
    dateFrom: Date,
    dateTo: Date) {
    const newBooking = new Booking(
      Math.random().toString(),
      placeId,
      this.authService.userId,
      placeTitle,
      placeImg,
      firstName,
      lastName,
      guestNumber,
      dateFrom,
      dateTo
    );

    // we add tap() so that we can return the subscribe promise and it allows it to be accessed from anywhere in the app
    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookingsArray => {
        this._bookings.next(bookingsArray.concat(newBooking));
      }));
  }

  cancelBooking(bookingId: string) {

    return this.bookings.pipe(
      take(1),
      delay(1000),
      tap(bookingsArray => {
        this._bookings.next(bookingsArray.filter(bookings => bookings.id !== bookingId));
      }));
  }
}
