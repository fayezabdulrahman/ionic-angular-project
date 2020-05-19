import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../auth/service/auth.service';
import { Injectable } from '@angular/core';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Place } from '../model/place.model';
import { Offer } from '../model/offer.model';
import { BehaviorSubject, of } from 'rxjs';

interface offerData {
  title: string,
  desc: string,
  imageUrl: string,
  offerPrice: number,
  availableFrom: string,
  availableTo: string,
  userId: string
}

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

  private _offers = new BehaviorSubject<Offer[]>([]);

  // getter for places
  get places() {
    return this._places.asObservable();
  }
  // getter for offers
  get offers() {
    return this._offers.asObservable();
  }


  constructor(private authService: AuthService, private http: HttpClient) { }
  /* the pipe take 1 gets the whole list of observable ( list of places ) 
  * The map function maps the places to the id we want to return that single place
  */
  getOffer(id: string) {
    /*
    return this.http.get(`https://ionic-angular-air-bnb-app.firebaseio.com/offered-places/${id}.json`)
    .pipe(tap(resp => {
      console.log(resp);
    }));
    */
    
    return this.http
      .get<offerData>(
        `https://ionic-angular-air-bnb-app.firebaseio.com/offered-places/${id}.json`
      )
      .pipe(
        map(responseData => {
          return new Offer(
            id,
            responseData.title,
            responseData.desc,
            responseData.imageUrl,
            responseData.offerPrice,
            new Date(responseData.availableFrom),
            new Date(responseData.availableTo),
            responseData.userId
          );
        })
      );
        
    
    //  return this.offers.pipe(take(1), map(offers => {
    //    return { ...offers.find(offerid => offerid.id === id) };
    //  }));
     
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
    let generatedId: string;
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

    return this.http.post<{ name: string }>('https://ionic-angular-air-bnb-app.firebaseio.com/offered-places.json', {
      ...newOffer, id: null
    })
      .pipe(switchMap(response => {
        generatedId = response.name; // this is the name of the generated ID from firbase
        return this.offers;
      }),
        take(1),
        tap(offersArray => {
          newOffer.id = generatedId;
          this._offers.next(offersArray.concat(newOffer));
        }));
  }

  updateOffer(offerId: string, title: string, description: string) {
    // take(1) takes the latest version of the array of offers
    // tap() allows us to execute code within the offers we are fetching
    // switchMap() allows us to update the places on the server with the new data 
    let updatedOffers: Offer[];
    return this.offers.pipe(
      take(1),
      switchMap(offers => {
        if (!offers || offers.length <= 0) {
          return this.fetchOffers(); // fetch for offers if we have none
        } else {
          return of(offers);
        }
      }),
      switchMap(offers => {
        // this will get us the index of the offer we want to update
        const updatedOffersIndex = offers.findIndex(offer => offer.id === offerId);

        updatedOffers = [...offers]; // this line copies the old offers so we don't override anything

        const oldOffer = updatedOffers[updatedOffersIndex]; // assign the id of the old offer to a variable

        updatedOffers[updatedOffersIndex] = new Offer(
          oldOffer.id,
          title,
          description,
          oldOffer.imageUrl,
          oldOffer.offerPrice,
          oldOffer.availableFrom,
          oldOffer.availableTo,
          oldOffer.userId);

        return this.http.put(`https://ionic-angular-air-bnb-app.firebaseio.com/offered-places/${offerId}.json`,
          { ...updatedOffers[updatedOffersIndex], id: null, })
      }),
      tap(() => {
        // update the offer locally and emit the new updated offers
        this._offers.next(updatedOffers); // this line will emit the updatedOffers array ( the old offers array and the new update one)
      }));
  }

  fetchOffers() {
    return this.http.get<{ [key: string]: offerData }>('https://ionic-angular-air-bnb-app.firebaseio.com/offered-places.json')
      .pipe(
        // the map gets the responseData from server and returns a structured responseData
        map(responseData => {
          // transform the object that is returnerd into an array 
          const offers = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              offers.push(new Offer(key,
                responseData[key].title,
                responseData[key].desc,
                responseData[key].imageUrl,
                responseData[key].offerPrice,
                new Date(responseData[key].availableFrom),
                new Date(responseData[key].availableTo),
                responseData[key].userId));
            }
          }
          return offers;
        }),
        tap(offers => {
          this._offers.next(offers); // this will emit the new places we got from the server
        }));
  }

}
