import { Capacitor, Plugins, CameraSource, CameraResultType } from '@capacitor/core';
import { Component, OnInit, Output,EventEmitter } from '@angular/core';


@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  @Output() imagePick = new EventEmitter();
  constructor() { }

  ngOnInit() { }

  onTakePicture() {
    // we want to open camera on a native device
    if(!Capacitor.isPluginAvailable('Camera')) {
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

}
