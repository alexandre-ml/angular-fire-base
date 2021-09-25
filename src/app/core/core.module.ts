import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";

import { NavbarComponent } from './component/navbar/navbar.component';

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";

import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    CommonModule,    
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,  
    
    //firebase
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule

  ],
  exports: [
    //modulos compartilhados por todos
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,

    //componentes compartilhados
    NavbarComponent,

    //firebase
    AngularFireModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule
    
  ]
})
export class CoreModule { }
