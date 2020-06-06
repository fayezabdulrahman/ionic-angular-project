import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { User } from '../model/user.model';
import { map, tap } from 'rxjs/operators';
import { UrlHandlingStrategy } from '@angular/router';

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
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

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

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(SIGN_IN_URL, {
      email: email,
      password: password
    })
      .pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    // reset the user to null 
    this._user.next(null);
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
    this._user.next(new User(
      userData.localId,
      userData.email,
      userData.idToken,
      expirationTime));
  }

}
