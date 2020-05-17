import { PlacesService } from './../../service/places.service';
import { Component, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, ActionSheetController } from '@ionic/angular';
import { Place } from '../../model/place.model';
import { ActivatedRoute } from '@angular/router';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {
  place: Place;

  constructor(
    private navController: NavController, 
    private route: ActivatedRoute, 
    private placesService: PlacesService, 
    private modalControler: ModalController,
    private alertController: AlertController,
    private actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if(!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/discover');
        return; // this is needed so other code doesn't get executed
      }
      this.place = this.placesService.getPlace(paramMap.get('placeId'));
    });
  }


  // this methid uses an action sheet controller which then calls openBookingModal which opens up a popup model on top of the page rendered 
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
        selectedPlace: this.place
      }
    });
    await modal.present();
    const {data, role} = await modal.onDidDismiss();
    if(role === 'confirm') {
      console.log(data);
      const alert = await this.alertController.create({header: 'Success', message:'Thanks for your booking', buttons: ['Close']});
      await alert.present();
    }
    
  }

}
