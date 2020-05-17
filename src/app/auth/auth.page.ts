import { NavController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  constructor(private authService: AuthService, private navController: NavController, private loadingController: LoadingController) { }

  ngOnInit() {
  }

  login() {
    this.isLoading = true;
    this.authService.login();
    this.loadingController.create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingElement => {
        loadingElement.present();
        setTimeout(() => {
          this.isLoading = false;
          loadingElement.dismiss();
          this.navController.navigateForward('/places/tabs/discover');
        }, 1000);
      });
  }
}
