import { AuthService } from './../../auth/service/auth.service';
import { Injectable } from '@angular/core';
import { take, map, tap, delay } from 'rxjs/operators';
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

  addOffer(title: string, desc: string, price: number, dateFrom: Date, dateTo: Date) {
    const newOffer = new Offer(
      Math.random().toString(),
      title,
      desc,
      '../../../assets/images/place.png',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );

    // we add tap() so that we can return the subscribe promise and it allows it to be accessed from anywhere in the app
    return this.offers.pipe(
      take(1),
      delay(1000),
      tap(placesArray => {
        this._offers.next(placesArray.concat(newOffer));
      }));
  }

  updateOffer(offerId: string, title: string, description: string) {
    // take 1, takes the latest version of the array of offers
    // tap allows us to execute code within the offers we are fetching
    return this.offers.pipe(
      take(1), 
      delay(1000),
      tap(offers => {
      // this will get us the index of the offer we want to update
      const updatedOffersIndex = offers.findIndex(offer => offer.id === offerId);

      const updatedOffers = [...offers]; // this line copies the old offers so we don't override anything

      const oldOffer = updatedOffers[updatedOffersIndex]; // assign the id of the old offer to a variable

      updatedOffers[updatedOffersIndex] = new Offer(
        oldOffer.id,
        title, description,
        oldOffer.imageUrl,
        oldOffer.offerPrice,
        oldOffer.availableFrom,
        oldOffer.availableTo,
        oldOffer.userId);

      this._offers.next(updatedOffers); // this line will emit the updatedOffers array ( the old offers array and the new update one)
    }));
  }

}
