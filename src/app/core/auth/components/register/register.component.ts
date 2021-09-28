import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';
import { AuthService } from '../../share/auth.service';
import { UserFb } from '../../share/user-fb';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent extends BaseResourceFormComponent<UserFb> {

  constructor(protected authService: AuthService, injector: Injector)   { 
    super(injector, new UserFb(), authService, UserFb.fromJson)
  }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      firstName: [null, [Validators.required, Validators.minLength(5)]],
      lastName: [null],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      conf_pass: [null, [Validators.required]]     
    },
    {  validator: this.compSenhas} );
  }

  private compSenhas(group: FormGroup){

    //se group tem valor
    if(group){
      const pass = group.controls['password'].value;
      const conf = group.controls['conf_pass'].value;

      if(pass == conf)
        return null;
    }

    return {matching: false};

  }

  protected actionsForSuccess(resource: UserFb): void {

    //precisa refinar: a barra de endereço não esta mudando o link
    this.router.navigateByUrl('reports', {skipLocationChange: true});
  }

}
