import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService, AuthResponseData } from './service/auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private loadingController: LoadingController,
    private alertController: AlertController) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingController.create({ keyboardClose: true, message: 'Logging in...' })
      .then(loadingElement => {
        loadingElement.present();
        let authObs: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObs = this.authService.login(email, password);
        } else {
          authObs = this.authService.signup(email, password);
        }
        authObs.subscribe(() => {
          this.isLoading = false;
          loadingElement.dismiss();
          this.navController.navigateForward('/places/tabs/discover');
        },
          errorResp => {
            loadingElement.dismiss();
            const errorCode = errorResp.error.error.message;
            console.log(errorResp);
            let message = 'Could not sign up, please try again.';
            if (errorCode === 'EMAIL_EXISTS') {
              message = 'Email already exists, please choose another one.';
            } else if (errorCode === 'EMAIL_NOT_FOUND') {
              message = 'Email not found, please try again.';
            } else if (errorCode === 'INVALID_PASSWORD') {
              message = 'Invalid password provided, please try again.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  submitLogin(formLogin: NgForm) {
    // check if the form is valid first
    if (!formLogin.valid) {
      return;
    }

    // extract the values from the form submitted
    const email = formLogin.value.email;
    const password = formLogin.value.password;

    // call the authenticate method
    this.authenticate(email, password);
  }

  switchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  private showAlert(message: string) {
    this.alertController
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }
}
