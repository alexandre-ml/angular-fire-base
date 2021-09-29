import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { AuthService } from '../../share/auth.service';
import { UserFb } from '../../share/user-fb';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseResourceFormComponent<UserFb> {

  constructor(protected authService: AuthService, injector: Injector)   { 
    super(injector, new UserFb(), authService, UserFb.fromJson)
  }

  ngOnDestroy(){ 
    if(this.resSubcription)   
      this.resSubcription.unsubscribe();
  }

  fazLogin(){
    this.resSubcription = this.resourceService.login(this.resourceForm.value.email, this.resourceForm.value.password)
    .subscribe(
      r => this.actionsForSuccess(r, 'Login realizado com sucesso!'),
      error => this.actionsForError(error)
    );
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]]
    });
  }  
}
