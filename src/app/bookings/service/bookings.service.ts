import { AuthService } from './../../auth/service/auth.service';
import { Injectable } from '@angular/core';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Booking } from '../model/booking.mode';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface bookingData {
  bookedFrom: string,
  bookedTo: string,
  firstName: string,
  guestNumber: number,
  lastName: string,
  placeId: string,
  placeImage: string,
  placeTitle: string,
  userId: string
}

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings = new BehaviorSubject<Booking[]>([]);

  constructor(
    private authService: AuthService,
    private http: HttpClient) { }

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
    dateTo: Date
  ) {

    let generatedId: string;
    let newBooking: Booking;
    return this.authService.userId.pipe(take(1), switchMap(userId => {
      if (!userId) {
        throw new Error('No User Id Found');
      }
      newBooking = new Booking(
        Math.random().toString(),
        placeId,
        userId,
        placeTitle,
        placeImg,
        firstName,
        lastName,
        guestNumber,
        dateFrom,
        dateTo
      );

      return this.http.post<{ name: string }>('https://ionic-angular-air-bnb-app.firebaseio.com/bookings.json', {
        ...newBooking, id: null
      });
    }),
      switchMap(response => {
        generatedId = response.name;
        return this.bookings;
      }),
      take(1),
      tap(bookingsArray => {
        newBooking.id = generatedId;
        this._bookings.next(bookingsArray.concat(newBooking));
      }));

  }

  fetchBookings() {
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        if (!userId) {
          throw new Error('No user Id found!');
        }
        return this.http.get<{ [key: string]: bookingData }>(
          `https://ionic-angular-air-bnb-app.firebaseio.com/bookings.json?orderBy="userId"&equalTo="${userId}"`);
      }),
      map(bookingData => {
        const bookings = [];
        for (const key in bookingData) {
          if (bookingData.hasOwnProperty(key)) {
            bookings.push(new Booking(
              key,
              bookingData[key].placeId,
              bookingData[key].userId,
              bookingData[key].placeTitle,
              bookingData[key].placeImage,
              bookingData[key].firstName,
              bookingData[key].lastName,
              bookingData[key].guestNumber,
              new Date(bookingData[key].bookedFrom),
              new Date(bookingData[key].bookedTo))
            );
          }
        }
        return bookings;
      }),
      tap(bookings => {
        this._bookings.next(bookings);
      }));
  }


  cancelBooking(bookingId: string) {
    return this.http.delete(`https://ionic-angular-air-bnb-app.firebaseio.com/bookings/${bookingId}.json`)
      .pipe(
        switchMap(() => {
          return this.bookings;
        }),
        take(1),
        tap(bookingsArray => {
          this._bookings.next(bookingsArray.filter(bookings => bookings.id !== bookingId));
        })
      );
  }
}
