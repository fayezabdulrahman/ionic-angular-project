import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../service/places.service';
import { Offer } from '../model/offer.model';
import { IonItemSliding, NavController } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers: Offer[];

  constructor(private placesService: PlacesService, private navController: NavController) { }

  ngOnInit() {
    this.loadedOffers = this.placesService.offers;
  }


  editOffer(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close(); // close the slider before we navigate 
    this.navController.navigateForward('/places/tabs/offers/edit/'+ offerId);
    console.log('editing item',offerId);
  }
}
