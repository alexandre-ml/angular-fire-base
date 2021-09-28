import { ThisReceiver } from '@angular/compiler';
import { Injectable, Injector } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { from, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { UserFb } from './user-fb';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseResourceService<UserFb> {

  private afAuth: AngularFireAuth;

  constructor(protected injector: Injector) {
    super(injector, UserFb.fromJson, 'users');

    this.afAuth = injector.get(AngularFireAuth);
  }

  createFb(resource: UserFb) {

    let user = new UserFb();
    let localId: string;

    //retirando senha e conf de senha
    user.firstName = resource.firstName;
    user.lastName  = resource.lastName;
    user.email     = resource.email;

    //temporario
    user.password  = resource.password;

    return from(this.afAuth.createUserWithEmailAndPassword(resource.email, resource.password))
      .pipe(
        switchMap( (u) => super.createFb(user, u.user.uid)),
        catchError( () => throwError('Erro ao criar usuário!'))
      );
  }

  login(email: string, password: string): Observable<UserFb>{
    return from(this.afAuth.signInWithEmailAndPassword(email, password))
      .pipe(
        switchMap( (u) => this.resourceCollection.doc<UserFb>(u.user.uid).valueChanges()),
        catchError( () => throwError('Usuário e/ou Senha inválidos ou não Cadastrado!'))
      );
  }

  logout(){
    this.afAuth.signOut();
  }
}
