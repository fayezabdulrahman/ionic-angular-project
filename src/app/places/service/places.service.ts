import { Injectable } from '@angular/core';
import { Place } from '../model/place.model';
import { Offer } from '../model/offer.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place(
      '1',
      'HollyWood Crib',
      'Located at the centre of HollyWood',
      '../../../assets/images/hollywood.jpg',
      100,
      new Date('2020-01-01'),
      new Date('2020-12-31')
    ),
    new Place(
      '2',
      'LA Crib',
      'Located at centre of LA Blv.',
      '../../../assets/images/la.jpg',
      200,
      new Date('2020-01-01'),
      new Date('2020-12-31')
    ),
    new Place(
      '3',
      'San Fran Crib',
      'Located at centre of San Fran.',
      '../../../assets/images/sanfran.jpg',
      300,
      new Date('2020-01-01'),
      new Date('2020-12-31')
    ),
  ];

  private _offers: Offer[] = [
    new Offer(
      '1',
      'Awesome Offer',
      'You cant resist this offer',
      50
    ),
    new Offer(
      '2',
      'Great Offer',
      'This is a great offer',
      80
    ),
    new Offer(
      '3',
      'Average Offer',
      'This is our average offer',
      30
    ),
  ]

  get places() {
    return [...this._places];
  }

  get offers() {
    return [...this._offers];
  }

  getOffer(id: string) {
    return {...this._offers.find(offerid => offerid.id === id)};
  }

  getPlace(id: string) {
    return {...this._places.find(placeid => placeid.id === id)};
  }
  

  constructor() { }
}
