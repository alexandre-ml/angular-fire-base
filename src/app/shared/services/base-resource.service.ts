import { BaseResourceModel } from "../models/base-resource.model";

import { Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, throwError, from } from "rxjs";

import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";

export abstract class BaseResourceService<T extends BaseResourceModel>{

  protected afs: AngularFirestore;

  protected resourceCollection: AngularFirestoreCollection<T>;

  constructor(
      protected injector: Injector,
      protected jsonDataToResourceFn: (jsonData: any) => T,
      
      protected collection?: string
  ){
    this.afs = injector.get(AngularFirestore);
    this.resourceCollection = this.afs.collection(collection);
  }

  getAllFb(): Observable<T[]>{
    return this.resourceCollection.valueChanges();
  }

  getByIdFb(id: string): Observable<T>{
    return this.resourceCollection.doc(id).valueChanges();
  }

  createFb(resource: T) {
    let LocalId = this.afs.createId();
    return this.resourceCollection.doc(LocalId).set({...resource, id: LocalId})    
  }

  updateFb(resource: T){
    return this.resourceCollection.doc(resource.id).set({...resource, id: resource.id});
  }

  deleteFb(id: string){
    return this.resourceCollection.doc(id).delete();
  }

  //metodos protegidos compartilhados pela herança
  protected jsonDataToResources(jsonData: any[]):T[]{
    const resources: T[] = [];
    jsonData.forEach(element => resources.push(this.jsonDataToResourceFn(element)));
    return resources;
  }

  protected jsonDataToResource(jsonData: any):T{
    return this.jsonDataToResourceFn(jsonData);
  }

  protected handleError(error: any): Observable<any>{
    console.log("Erro na requisição => ", error);
    return throwError(error);
  }
}