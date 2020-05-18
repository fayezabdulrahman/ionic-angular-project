import { AuthService } from './../../auth/service/auth.service';
import { Injectable } from '@angular/core';
import { take, map } from 'rxjs/operators';
import { Place } from '../model/place.model';
import { Offer } from '../model/offer.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      '1',
      'HollyWood Crib',
      'Located at the centre of HollyWood',
      '../../../assets/images/hollywood.jpg',
      100,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'dummyUserId'
    ),
    new Place(
      '2',
      'LA Crib',
      'Located at centre of LA Blv.',
      '../../../assets/images/la.jpg',
      200,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'dummyUserId2'
    ),
    new Place(
      '3',
      'San Fran Crib',
      'Located at centre of San Fran.',
      '../../../assets/images/sanfran.jpg',
      300,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'dummyUserId3'
    ),
  ]);

  private _offers = new BehaviorSubject<Offer[]>([
    new Offer(
      '1',
      'Awesome Offer',
      'You cant resist this offer',
      '../../../assets/images/hollywood.jpg',
      50,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'dummyUserId'
    ),
    new Offer(
      '2',
      'Great Offer',
      'This is a great offer',
      '../../../assets/images/la.jpg',
      80,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'dummyUserId2'
    ),
    new Offer(
      '3',
      'Average Offer',
      'This is our average offer',
      '../../../assets/images/sanfran.jpg',
      30,
      new Date('2020-01-01'),
      new Date('2020-12-31'),
      'dummyUserId3'
    ),
  ]);

  // getter for places
  get places() {
    return this._places.asObservable();
  }
  // getter for offers
  get offers() {
    return this._offers.asObservable();
  }


  constructor(private authService: AuthService) { }
  /* the pipe take 1 gets the whole list of observable ( list of places ) 
  * The map function maps the places to the id we want to return that single place
  */
  getOffer(id: string) {
    return this.offers.pipe(take(1), map(offers => {
      return { ...offers.find(offerid => offerid.id === id) };
    }));
  }

  /* the pipe take 1 gets the whole list of observable ( list of places ) 
  * The map function maps the places to the id we want to return that single place
  */
  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(placeid => placeid.id === id) };
    }));
  }

  addPlace(title: string, desc: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      desc,
      '../../../assets/images/place.png',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    this.places.pipe(take(1)).subscribe(placesArray => {
      this._places.next(placesArray.concat(newPlace));
    });
  }

}
