import { AuthService } from './../../../auth/service/auth.service';
import { BookingsService } from './../../../bookings/service/bookings.service';
import { PlacesService } from './../../service/places.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Place } from '../../model/place.model';
import { ActivatedRoute } from '@angular/router';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { take, switchMap } from 'rxjs/operators';

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
    private loadingController: LoadingController,
    private alertController: AlertController) { }

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
      let fetchedUserId: string;
      this.authService.userId.pipe(
        take(1),
        switchMap(userId => {
          if (!userId) {
            throw new Error('User Id not found!');
          }
          fetchedUserId = userId;
          return this.placesService.getPlace(paramMap.get('placeId'));

        }))
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== fetchedUserId; // if the place isn't created by the user this will return true
        },
          error => {
            this.alertController.create({
              header: 'An error ocurred!',
              message: 'Could not load place.',
              buttons: [
                {
                  text: 'Okay',
                  handler: () => {
                    this.navController.navigateBack('/places/tabs/discover');
                  }
                }
              ]
            }).then(alertElement => { alertElement.present() });
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
      // creates modal and calls create booking to display the html
      component: CreateBookingComponent,
      componentProps: {
        selectedPlace: this.place,
        selectedMode: mode
      }
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    // if we click close button in booking modal ( then we don't display alert)
    if (data['dismissed']) {
      return;
    }

    this.loadingController.create({ keyboardClose: true, message: 'Booking in Progress...' })
      .then(loadingElement => {
        loadingElement.present();
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
              data.bookingData.endDate).subscribe(() => {
                loadingElement.dismiss();
              });
        }
      });
  }
}
