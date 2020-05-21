import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Offer } from '../../model/offer.model';
import { ActivatedRoute } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../service/places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  offer: Offer;
  editOfferForm: FormGroup;
  isLoading = false;
  placeId: string;
  private offerSub: Subscription

  constructor(
    private route: ActivatedRoute,
    private navController: NavController,
    private placesService: PlacesService,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

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
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
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
        this.isLoading = false;
      }, error => {
        this.alertController.create({
          header: 'An error occured!', message: 'Offer could not be find',
          buttons: [{
            text: 'Okay', handler: () => {
              this.navController.navigateBack('/places/tabs/offers');
            }
          }]
        }).then(alertElement => {
          alertElement.present();
        })
      });

    });
  }

  editOffer() {
    if (!this.editOfferForm.valid) {
      return;
    }
    this.loadingController.create({ keyboardClose: true, message: 'Updating offer...' })
      .then(loadingElement => {
        loadingElement.present();

        this.placesService.updateOffer(
          this.offer.id,
          this.editOfferForm.value.title,
          this.editOfferForm.value.description)
          .subscribe(() => {
            loadingElement.dismiss();
            this.editOfferForm.reset();
            this.navController.navigateBack('/places/tabs/offers');
          });
      });

  }

}
