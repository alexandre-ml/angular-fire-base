import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/share/auth.service';
import { UserFb } from '../../auth/share/user-fb';

import { BnNgIdleService } from 'bn-ng-idle';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {

  public user$: Observable<UserFb>
  public authenticated$: Observable<boolean>
  router: Router;
  idleService: BnNgIdleService;
  authService: AuthService;

  constructor(protected injector: Injector  ){
    this.router = injector.get(Router);
    this.idleService = injector.get(BnNgIdleService);
    this.authService = injector.get(AuthService);

    this.user$ = this.authService.getByIdFb();
    this.authenticated$ = this.authService.authenticated();
  }

  ngOnInit() {
    
    this.idleService.startWatching(300).subscribe((isUserInactive) => {
      if (isUserInactive) {
        const currentRoute = this.router.url;

        if(currentRoute !== '/auth/login') {
          this.idleService.resetTimer();
          this.logout();
        }
      }
    });
  }

  ngOnDestroy(){
    this.logout();
  }

  logout(){
    this.authService.logout()
  }
}
