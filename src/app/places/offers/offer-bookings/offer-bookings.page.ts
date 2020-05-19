import { NavController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Offer } from '../../model/offer.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../service/places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  offer: Offer;
  private offerSub: Subscription;

  constructor(private route: ActivatedRoute, private navController: NavController, private placesService: PlacesService) { }
  ngOnDestroy() {
    if(this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return; // this is needed so other code doesn't get executed
      }

      this.offerSub = this.placesService.getOffer(paramMap.get('placeId')).subscribe(offer => {
        this.offer = offer;
      });
    });
  }

}
