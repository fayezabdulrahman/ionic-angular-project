import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { AuthService } from './auth/service/auth.service';
import { Capacitor, Plugins, AppState } from '@capacitor/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private authSub: Subscription;
  private previousAuthState = false;
  constructor(
    private platform: Platform,
    private authService: AuthService,
    private navController: NavController
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.authSub = this.authService.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.navController.navigateBack('/auth');
      }
      this.previousAuthState = isAuth;
    });

    Plugins.App.addListener('appStateChange', this.checkAuthOnResume.bind(this));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  private checkAuthOnResume(state: AppState) {
    if (state.isActive) {
      this.authService
        .autoLogin()
        .pipe(take(1))
        .subscribe(success => {
          if (!success) {
            this.logout();
          }
        });
    }
  }
}
