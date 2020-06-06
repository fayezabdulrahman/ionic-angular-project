import { NavController, LoadingController } from '@ionic/angular';
import { PlacesService } from './../../service/places.service';
import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms';

function blobToFile(theBlob, fileName){
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {
  offerForm: FormGroup;
  isOfferCreated = false;
  constructor(private placeService: PlacesService, private navController: NavController, private loadingController: LoadingController) { }

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
      }),
      image: new FormControl(null)
    });
  }

  createOffer() {
    if (!this.offerForm.valid || !this.offerForm.get('image').value) {
      return;
    }
    console.log(this.offerForm.value);
    this.loadingController.create({ keyboardClose: true, message: 'Creating Offer...' })
      .then(loadingElement => {
        loadingElement.present(); // present the loading controller

        // call addOffer from the placeService
        this.placeService.addOffer
          (this.offerForm.value.title,
            this.offerForm.value.description,
            +this.offerForm.value.price,
            this.offerForm.value.dateFrom,
            this.offerForm.value.dateTo)
          // when the adding place is complete, we dismiss the loading spinner, and reset the form 
          .subscribe(() => {
            loadingElement.dismiss();
            this.offerForm.reset();
            this.navController.navigateBack('/places/tabs/offers');
          });
      });

  }

  onPictureTaken(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      // convert to File
      try {
        let myblob = new Blob();
        imageFile = blobToFile(myblob, imageData);
      }
      catch (error) {
        console.log('Image cant be converted to a file\n' + error);
        return;
      }
    } else {
      // don't need to convert to a file
      imageFile = imageData;
    }

    // set the image variable from the form to imageFile we got here
    this.offerForm.patchValue({image: imageFile});
  }
}
