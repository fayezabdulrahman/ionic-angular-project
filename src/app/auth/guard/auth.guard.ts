import { NavController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { take, tap, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private navController: NavController) { }
  canLoad(route: import("@angular/router").Route, segments: import("@angular/router").UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          // try the auto login
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          this.navController.navigateBack('/auth');
        }
      }));
  }

}

