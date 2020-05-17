import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../service/places.service';
import { Offer } from '../model/offer.model';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {
  loadedOffers: Offer[];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedOffers = this.placesService.offers;
  }

}
