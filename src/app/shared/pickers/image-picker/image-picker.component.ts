import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { Component, OnInit, Output,EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  usePicker = false;
  @Output() imagePick = new EventEmitter<string | File>();
  @ViewChild('filePicker') filePicker: ElementRef<HTMLInputElement>;

  constructor(private platform: Platform) { }

  ngOnInit() { 
    // this checks if we are running on a desktop
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
    }
  }

  onTakePicture() {
    // we want to open camera on a native device
    if(!Capacitor.isPluginAvailable('Camera') || this.usePicker) {
      this.filePicker.nativeElement.click();
      return;
    }

    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      height: 320,
      width: 200,
      resultType: CameraResultType.DataUrl
    }).then( image => {
      this.selectedImage = image.dataUrl;
      this.imagePick.emit(image.dataUrl);
    }).catch(error => {
      console.log(error);
      return false;
    });
  }

  onFileChosen(event: Event) {
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if(!pickedFile) {
      console.log('No file chosen');
      return;
    }

    const fileReader = new FileReader();
    // filereader is an async method so we have use the onload method to get our result
    fileReader.onload = () => {
      const dataURL = fileReader.result.toString();
      this.selectedImage = dataURL;
      this.imagePick.emit(pickedFile); // send picked file to new offer page.ts
    };
    fileReader.readAsDataURL(pickedFile); // this will convert the image to a base 64 string

  }

}
