import { NavController, LoadingController } from '@ionic/angular';
import { PlacesService } from './../../service/places.service';
import { Component, OnInit, Input } from '@angular/core'
import { FormGroup, FormControl, Validators } from '@angular/forms';

function base64toBlob(base64Data, contentType) {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
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
        imageFile = base64toBlob(imageData.replace('data:image/jpeg;base64,', ''), 'image/jpeg');
      }
      catch (error) {
        console.log('Image cant be converted');
        console.log(error);
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
