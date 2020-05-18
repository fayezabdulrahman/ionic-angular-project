import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../service/places.service';
import { Offer } from '../model/offer.model';
import { IonItemSliding, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  loadedOffers: Offer[];
  private offersSub: Subscription

  constructor(private placesService: PlacesService, private navController: NavController) { }

  ngOnDestroy() {
    // clears the places subscription when its not needed to avoid rxjs leaks
    if (this.offersSub) {
      this.offersSub.unsubscribe();
    }
  }

  ngOnInit() {
    /*
    * The subscribe will get us the list of offers, which we assign to loadedOffers
    */
    this.offersSub = this.placesService.offers.subscribe(offers => {
      this.loadedOffers = offers;
    });

  }


  editOffer(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close(); // close the slider before we navigate 
    this.navController.navigateForward('/places/tabs/offers/edit/' + offerId);
    console.log('editing item', offerId);
  }
}
