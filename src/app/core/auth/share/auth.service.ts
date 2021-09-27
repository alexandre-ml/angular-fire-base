import { Injectable, Injector } from '@angular/core';
import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { UserFb } from './user-fb';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseResourceService<UserFb> {

  constructor(protected injector: Injector) { 
    super(injector, UserFb.fromJson, 'users');
  }
}
