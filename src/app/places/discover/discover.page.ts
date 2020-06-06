import { NavController } from '@ionic/angular';
import { AuthService } from './../../auth/service/auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PlacesService } from '../service/places.service';
import { Place } from '../model/place.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Place[];
  listedLoadedPlaces: Place[];
  relevantPlaces: Place[];
  isPlacesLoaded = false;
  private placesSub: Subscription

  constructor(
    private placesService: PlacesService,
    private authService: AuthService) { }

  ngOnDestroy() {
    // clears the places subscription when its not needed to avoid rxjs leaks
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      this.loadedPlaces = places;
      this.relevantPlaces = this.loadedPlaces;
      this.listedLoadedPlaces = this.relevantPlaces.slice(1);
    });
  }

  ionViewWillEnter() {
    // load places from server
    this.isPlacesLoaded = true;
    this.placesService.fetchPlaces().subscribe(() => {
      // afer we have got data back, set it to false
      this.isPlacesLoaded = false;
    });
    // if we select 'bookable Places tab' and navigate back.. change the ion-segment value to always be highlighted on 'All Places'
    document.getElementById('toggleBtnSeg').attributes[1].value = 'all';
  }

  toggleSegmentButton(event: any) {
    this.authService.userId.pipe(take(1)).subscribe(userId => {
      if (event.detail.value === 'all') {
        this.relevantPlaces = this.loadedPlaces;
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      } else {
        this.relevantPlaces = this.loadedPlaces.filter(place => place.userId !== userId);
        this.listedLoadedPlaces = this.relevantPlaces.slice(1);
      }
    });

  }
}
