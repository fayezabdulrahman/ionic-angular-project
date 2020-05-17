import { NavController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;
  isLogin = true;

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

  submitLogin(formLogin: NgForm) {
    if(!formLogin.valid) {
      return;
    }

    const email = formLogin.value.email;
    const password = formLogin.value.password;
    console.log(email, password);
    if(this.isLogin) {
      // send a request to login server
    } else {
      // send a request to sign up server
    }
  }

  switchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
