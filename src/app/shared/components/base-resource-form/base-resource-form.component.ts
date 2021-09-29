import { OnInit, AfterContentChecked, Injector, Directive, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";
import { Subscription } from 'rxjs';

@Directive()
export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked, OnDestroy {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  protected resSubcription: Subscription = null;

  constructor(
      protected injector: Injector, 
      public resource: T,
      protected resourceService: BaseResourceService<T>,
      protected jsonDataToResourceFn: (jsonData: any) => T
      ) 
    {
      this.route = injector.get(ActivatedRoute);
      this.router = injector.get(Router);
      this.formBuilder = injector.get(FormBuilder);
    }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }
  ngAfterContentChecked(){
    this.setPageTitle();
  }

  ngOnDestroy(){
    if(this.resSubcription)
      this.resSubcription.unsubscribe();    
  }
  
  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new' || this.currentAction == 'register')
      this.createResource();
    else if(this.currentAction == 'edit')
      this.updateResource();    
  }
  
  //metodos compartilhados entre as heranças
  protected setCurrentAction() {
    if(this.route.snapshot.parent.url[0].path == 'auth')
      this.currentAction = this.route.snapshot.url[0].path;
    else
      this.currentAction = this.route.snapshot.url[0].path == 'new' ? 'new' : 'edit';
  }

  protected loadResource() {
    if(this.currentAction == 'edit'){
      this.resSubcription = this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getByIdFb(params.get('id')))
      )
      .subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource) // carrega o form com a categoria do banco
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde!')
      );
    }
    
  }
  
  protected setPageTitle() {
    this.pageTitle = this.currentAction == 'new' ? this.setTitleNew() : this.setTitleEdit();
  }

  protected setTitleNew(): string {
      return 'Novo';
  }

  protected setTitleEdit(): string {
      return 'Edit';
  }

  protected createResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resSubcription = this.resourceService.createFb(resource)
    .subscribe(
      (r) => {
        this.actionsForSuccess(r, 'Registro Incluído com Sucesso!');
      },
      error => this.actionsForError(error)
    )
  }
  
  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.updateFb(resource)
    .then(
      () => {this.actionsForSuccess(resource, 'Registro Atualizado com Sucesso!')}      
    )
    .catch(
      (error) => this.actionsForError(error)
    )
  }  

  protected actionsForSuccess(resource: T, msg: string): void {
    toastr.success(msg);

    let url = this.route.snapshot.parent.url[0].path;

    if(url == 'auth')
      url = '/';
    
   
    this.router.navigateByUrl(`${url}`);
  }

  protected actionsForError(error: any): void {
    toastr.error(error);

    this.submittingForm = false;

    //utilizado para servidor remoto
    if(error.status)
    {
      if(error.status === 422)
        this.serverErrorMessages = JSON.parse(error._body).errors;
      else 
        this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor tente mais tarde!'];
    }
  }
    
  protected abstract buildResourceForm(): void;  
}

