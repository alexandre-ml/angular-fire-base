import { Component, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/share/auth.service';
import { UserFb } from '../../auth/share/user-fb';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public user$: Observable<UserFb>
  public authenticated$: Observable<boolean>
  router: Router;

  constructor(protected injector: Injector, public authService: AuthService ){
    this.router = injector.get(Router);
    
    this.user$ = authService.getByIdFb();
    this.authenticated$ = authService.authenticated();
  }

  ngOnInit() {
  }

  logout(){
    this.authService.logout();
    //verificar os toaster em excesso
  }
}
