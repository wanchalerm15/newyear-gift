import { Injectable, NgZone } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class SocketGuard implements CanActivate {
  constructor(
    private _app: AppService
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Observable<boolean>(observ => {
      if (this._app.socket) {
        if (this._app.socket.connected) observ.next(true);
        else this._app.socket.on('connect', () => observ.next(true));
      }
      else observ.next(false);
    });
  }

}
