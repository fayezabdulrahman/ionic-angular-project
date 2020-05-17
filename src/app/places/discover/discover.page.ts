import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../service/places.service';
import { Place } from '../model/place.model';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place [];

  constructor(private placesService: PlacesService) { }

  ngOnInit() {
    this.loadedPlaces = this.placesService.places;
    this.listedLoadedPlaces = this.placesService.places.slice(1);
  }

  toggleSegmentButton(event: any) { 
    console.log('toggled button', event.detail);
  }
}
