import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { AuthService } from './auth/service/auth.service';
import { Capacitor, Plugins } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  logout() {
    this.authService.logout();
    this.navController.navigateBack('/auth');
  }
}
