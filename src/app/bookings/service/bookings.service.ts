import { Injectable } from '@angular/core';
import { Booking } from '../model/booking.mode';

@Injectable({
  providedIn: 'root'
})
export class BookingsService {
  private _bookings: Booking[] = [
    {
      id: 'booking1',
      placeId: '1',
      placeTitle: 'HollyWood Crib',
      guestNumber: 3, 
      userId: 'alan'
    },
    {
      id: 'booking2',
      placeId: '2',
      placeTitle: 'LA Crib',
      guestNumber: 5, 
      userId: 'fayez'
    },
    {
      id: 'booking3',
      placeId: '3',
      placeTitle: 'San Fran Crib',
      guestNumber: 10, 
      userId: 'conor'
    },
  ];

  constructor() { }

  get bookings() {
    return [...this._bookings];
  }
}
