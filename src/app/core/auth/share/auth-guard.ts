import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  authService: AuthService;
  router: Router;

  constructor(injector: Injector) { 
    this.authService = injector.get(AuthService);
    this.router = injector.get(Router);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    return this.authService.authenticated()
      .pipe(
        tap( (b) => {
          if (b == false) //nao esta autenticado
            this.router.navigateByUrl('/auth/login');
        })
      );

  }
}