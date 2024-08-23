import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AssetService } from './assets.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private assetService: AssetService, private router: Router) {}

  canActivate(): Promise<boolean> {
    return this.assetService.isUserAuth().then(isAuth => {
      if (isAuth) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}