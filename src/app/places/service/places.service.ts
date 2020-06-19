import { HttpClient } from '@angular/common/http';
import { AuthService } from './../../auth/service/auth.service';
import { Injectable } from '@angular/core';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { Place } from '../model/place.model';
import { Offer } from '../model/offer.model';
import { BehaviorSubject, of, pipe } from 'rxjs';

interface offerData {
  title: string,
  desc: string,
  imageUrl: string,
  offerPrice: number,
  availableFrom: string,
  availableTo: string,
  userId: string
}

interface placeData {
  title: string,
  desc: string,
  imageUrl: string,
  price: number,
  availableFrom: string,
  availableTo: string,
  userId: string
}

@Injectable({
  providedIn: 'root'
})

export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([]);

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
    return this.authService.token.pipe(switchMap(token => {
      return this.http
        .get<offerData>(
          `https://ionic-angular-air-bnb-app.firebaseio.com/offered-places/${id}.json?auth=${token}`
        )
    }),
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
  }

  /* the pipe take 1 gets the whole list of observable ( list of places ) 
  * The map function maps the places to the id we want to return that single place
  */
  getPlace(id: string) {
    return this.authService.token.pipe(switchMap(token => {
      return this.http
        .get<placeData>(
          `https://ionic-angular-air-bnb-app.firebaseio.com/discover-places/${id}.json?auth=${token}`
        )
    }),
        map(responseData => {
          return new Place(
            id,
            responseData.title,
            responseData.desc,
            responseData.imageUrl,
            responseData.price,
            new Date(responseData.availableFrom),
            new Date(responseData.availableTo),
            responseData.userId
          );
        })
      );
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(placeid => placeid.id === id) };
    }));
  }

  addOffer(title: string, desc: string, imageUrl: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    let newOffer: Offer;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No User Id Found!');
        }
        newOffer = new Offer(
          Math.random().toString(),
          title,
          desc,
          imageUrl,
          price,
          dateFrom,
          dateTo,
          fetchedUserId
        );
        return this.http.post<{ name: string }>(`https://ionic-angular-air-bnb-app.firebaseio.com/offered-places.json?auth=${token}`, {
          ...newOffer, id: null
        });

      }),
      switchMap(response => {
        generatedId = response.name; // this is the name of the generated ID from firbase
        return this.offers;
      }),
      take(1),
      tap(offersArray => {
        newOffer.id = generatedId;
        this._offers.next(offersArray.concat(newOffer));
      }));

  }

  addPlace(title: string, desc: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    let newPlace: Place;
    let fetchedUserId: string;
    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        fetchedUserId = userId;
        return this.authService.token;
      }),
      take(1),
      switchMap(token => {
        if (!fetchedUserId) {
          throw new Error('No User Id Found!');
        }
        newPlace = new Place(
          Math.random().toString(),
          title,
          desc,
          '../../../assets/images/sanfran.jpg',
          price,
          dateFrom,
          dateTo,
          fetchedUserId
        );
        return this.http.post<{ name: string }>(`https://ionic-angular-air-bnb-app.firebaseio.com/discover-places.json?auth=${token}`, {
          ...newPlace, id: null
        });

      }),
      switchMap(response => {
        generatedId = response.name; // this is the name of the generated ID from firbase
        return this.places;
      }),
      take(1),
      tap(placesArray => {
        newPlace.id = generatedId;
        this._places.next(placesArray.concat(newPlace));
      }));

  }

  updateOffer(offerId: string, title: string, description: string) {
    // take(1) takes the latest version of the array of offers
    // tap() allows us to execute code within the offers we are fetching
    // switchMap() allows us to update the places on the server with the new data 
    let updatedOffers: Offer[];
    let fetchedToken: String;
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        fetchedToken = token;
        return this.offers;
      }),
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

        return this.http.put(`https://ionic-angular-air-bnb-app.firebaseio.com/offered-places/${offerId}.json?auth=${fetchedToken}`,
          { ...updatedOffers[updatedOffersIndex], id: null, })
      }),
      tap(() => {
        // update the offer locally and emit the new updated offers
        this._offers.next(updatedOffers); // this line will emit the updatedOffers array ( the old offers array and the new update one)
      })
    );
  }

  fetchOffers() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: offerData }>(`https://ionic-angular-air-bnb-app.firebaseio.com/offered-places.json?auth=${token}`)
      }),
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

  fetchPlaces() {
    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.get<{ [key: string]: placeData }>(`https://ionic-angular-air-bnb-app.firebaseio.com/discover-places.json?auth=${token}`)
      }),
      // the map gets the responseData from server and returns a structured responseData
      map(responseData => {
        // transform the object that is returnerd into an array 
        const places = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            places.push(new Place(key,
              responseData[key].title,
              responseData[key].desc,
              responseData[key].imageUrl,
              responseData[key].price,
              new Date(responseData[key].availableFrom),
              new Date(responseData[key].availableTo),
              responseData[key].userId));
          }
        }
        return places;
      }),
      tap(places => {
        this._places.next(places); // this will emit the new places we got from the server
      }));
  }

  uploadImage(image: File) {
    const uploadData = new FormData();
    uploadData.append('image', image);

    return this.authService.token.pipe(
      take(1),
      switchMap(token => {
        return this.http.post<{ imageUrl: string, imagePath: string }>(
          'https://us-central1-ionic-angular-air-bnb-app.cloudfunctions.net/storeImage',
          uploadData, { headers: { Authorization: 'Bearer ' + token } });
      }));

  }
}
