import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Offer } from '../../model/offer.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { PlacesService } from '../../service/places.service';
import { Subscription } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: Offer;
  editOfferForm: FormGroup;
  private offerSub: Subscription

  constructor(private route: ActivatedRoute, private navController: NavController, private placesService: PlacesService, private loadingController: LoadingController) { }

  ngOnDestroy() {
    if (this.offerSub) {
      this.offerSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navController.navigateBack('/places/tabs/offers');
        return; // this is needed so other code doesn't get executed
      }

      this.offerSub = this.placesService.getOffer(paramMap.get('placeId')).subscribe(offer => {
        this.offer = offer;
        this.editOfferForm = new FormGroup({
          title: new FormControl(this.offer.title, {
            updateOn: 'blur',
            validators: [Validators.required],

          }),
          description: new FormControl(this.offer.desc, {
            updateOn: 'blur',
            validators: [Validators.required, Validators.maxLength(180)]
          })
        });
      });

    });
  }

  editOffer() {
    if (!this.editOfferForm.valid) {
      return;
    }
    this.loadingController.create({ keyboardClose: true, message:'Updating offer...'})
    .then(loadingElement => {
      loadingElement.present();

      this.placesService.updateOffer(
        this.offer.id,
        this.editOfferForm.value.title,
        this.editOfferForm.value.desc)
        .subscribe(() => {
          loadingElement.dismiss();
          this.editOfferForm.reset();
          this.navController.navigateBack('/places/tabs/offers');
        });
    });

  }

}
