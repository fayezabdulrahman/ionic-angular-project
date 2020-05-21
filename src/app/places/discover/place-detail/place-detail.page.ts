import { AuthService } from './../../../auth/service/auth.service';
import { BookingsService } from './../../../bookings/service/bookings.service';
import { PlacesService } from './../../service/places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Place } from '../../model/place.model';
import { ActivatedRoute } from '@angular/router';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription
  isBookable = false;

  constructor(
    private navController: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private bookingService: BookingsService,
    private authService: AuthService,
    private modalControler: ModalController,
    private actionSheetController: ActionSheetController,
    private loadingController: LoadingController) { }

  ngOnDestroy() {
    // clears the places subscription when its not needed to avoid rxjs leaks 
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return; // this is needed so other code doesn't get executed
      }
      this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authService.userId; // if the place isn't created by the user this will return true
      });
    });
  }


  // this method uses an action sheet controller which then calls openBookingModal which opens up a popup model on top of the page rendered 
  async bookAPlace() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select an Option',
      buttons: [
        {
          text: 'Select Date',
          handler: () => {
            this.openBookingModal('select');
          }
        },
        {
          text: 'Random Date',
          handler: () => {
            this.openBookingModal('random');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async openBookingModal(mode: 'select' | 'random') {
    console.log(mode);

    const modal = await this.modalControler.create({
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode
      }
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    this.loadingController.create({ keyboardClose: true, message: 'Booking in Progress...' })
      .then(loadingElement => {
        loadingElement.present();
        console.log(role);
        // if user clicks on confrim, call the bookingSerice to addBooking
        if (role === 'confirm') {
          this.bookingService.addBooking
            (this.place.id,
              this.place.title,
              this.place.imageUrl,
              data.bookingData.firstName,
              data.bookingData.lastName,
              data.bookingData.guestNumber,
              data.bookingData.startDate,
              data.bookingData.endData).subscribe(() => {
                loadingElement.dismiss();
              });
        }
      });
  }

}
