import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../service/places.service';
import { Place } from '../model/place.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  private placesSub: Subscription

  constructor(private placesService: PlacesService) { }
  
  ngOnDestroy() {
    // clears the places subscription when its not needed to avoid rxjs leaks
    if(this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.listedLoadedPlaces = this.loadedPlaces.slice(1);
    })
  }

  toggleSegmentButton(event: any) {
    console.log('toggled button', event.detail);
  }
}
