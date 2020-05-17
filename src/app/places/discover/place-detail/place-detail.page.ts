import { PlacesService } from './../../service/places.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Place } from '../../model/place.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(private navController: NavController, private route: ActivatedRoute, private placesService: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return; // this is needed so other code doesn't get executed
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }

  bookAPlace() {
    this.navController.navigateBack('/places/tabs/discover');
  }

}
