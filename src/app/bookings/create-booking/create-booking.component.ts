import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Place } from 'src/app/places/model/place.model';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {

  // Data passed in by componentProps
  @Input() selectedPlace: Place;

  constructor(private modalController: ModalController) { }

  ngOnInit() {}


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  bookPlace() {
    this.modalController.dismiss({message: "Thanks for booking this place"}, 'confirm');
  }

}
