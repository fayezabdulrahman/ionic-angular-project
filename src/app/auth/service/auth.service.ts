import { Plugins } from '@capacitor/core';
import { environment } from './../../../environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, from } from 'rxjs';
import { User } from '../model/user.model';
import { map, tap } from 'rxjs/operators';

const SIGN_UP_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`;
const SIGN_IN_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`;

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean
}
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  private _user = new BehaviorSubject<User>(null);
  private activeLogoutTimer: any;

  constructor(private http: HttpClient) { }

  get userIsAuthenticated() {
    // this will return an obserable which yields to true or false if we have a valid token for the user
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return !!user.token; // double !! means bind to a boolean ( returns true if we have a token)
      } else {
        return false;
      }
    }));
  }

  get userId() {
    return this._user.asObservable().pipe(map(user => {
      if (user) {
        return user.id;
      } else {
        return null;
      }
    }));
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: 'userAuthData' })).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }

        const parsedData = JSON.parse(storedData.value) as {
          userId: string;
          token: string;
          tokenExpirationDate: string;
          email: string;
        };

        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }

        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime);

        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user; // returns true with the !! 
      }));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_IN_URL, {
      email: email,
      password: password,
      returnSecureToken: true
    })
      .pipe(tap(this.setUserData.bind(this)));
  }

  private autoLogout(duration: number) {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    // reset the user to null 
    this._user.next(null);
    Plugins.Storage.remove({ key: 'userAuthData' });
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_UP_URL, {
      email: email,
      password: password,
      returnSecureToken: true
    })
      .pipe(tap(this.setUserData.bind(this)));
  }

  private setUserData(userData: AuthResponseData) {
    // date object that marks the expiration time for our token
    const expirationTime = new Date(
      new Date().getTime() + (+userData.expiresIn * 1000));
    const user = new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime);
    this._user.next(user);
    this.autoLogout(user.tokenDuration);
    this.storeAuthData(userData.localId, userData.idToken, expirationTime.toISOString(), userData.email);
  }

  private storeAuthData(userId: string, token: string, tokenExpirationDate: string, email: string) {
    const authData = JSON.stringify({
      userId: userId,
      token: token,
      tokenExpirationDate: tokenExpirationDate,
      email: email
    });
    Plugins.Storage.set({
      key: 'userAuthData',
      value: authData
    });
  }

  OnDestroy() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
