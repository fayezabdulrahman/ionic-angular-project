import { NavController } from '@ionic/angular';
import { PlacesService } from './../../service/places.service';
import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  offerForm: FormGroup;
  constructor(private placeService: PlacesService, private navController: NavController) { }

  ngOnInit() {
    this.offerForm = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.maxLength(180)]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }),
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      })
    });
  }

  createOffer() {
    if (!this.offerForm.valid) {
      return;
    }
    this.placeService.addPlace
      (
        this.offerForm.value.title,
        this.offerForm.value.description,
        this.offerForm.value.price,
        this.offerForm.value.dateFrom,
        this.offerForm.value.dateTo);

    this.offerForm.reset();
    this.navController.navigateBack('/places/tabs/offers');
  }
}
