import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private authService: AuthService, private navController: NavController) { }

  ngOnInit() {
  }

  login() {
    this.authService.login();
    this.navController.navigateForward('/places/tabs/discover');
  }

}
