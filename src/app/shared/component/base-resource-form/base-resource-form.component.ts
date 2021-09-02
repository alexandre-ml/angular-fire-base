import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

import { switchMap } from "rxjs/operators";
import toastr from "toastr";

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  constructor(
      protected injector: Injector, 
      public resource: T,
      protected resourceService: BaseResourceService<T>,
      protected jsonDataToResourceFn: (jsonData: any) => T
      ) {
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
  
  submitForm(){
    this.submittingForm = true;

    if(this.currentAction == 'new')
      this.createResource();
    else
      this.updateResource();
  }
  
  //metodos compartilhados entre as heranças
  protected setCurrentAction() {
    this.currentAction = this.route.snapshot.url[0].path == 'new' ? 'new' : 'edit';
  }

  protected loadResource() {
    if(this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      )
      .subscribe(
        (resource) => {
          this.resource = resource;
          this.resourceForm.patchValue(resource) // carrega o form com a categoria do banco
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde!')
      )
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

    this.resourceService.create(resource)
    .subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    )
  }
  
  protected updateResource() {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource)
    .subscribe(
      resource => this.actionsForSuccess(resource),
      error => this.actionsForError(error)
    )
  }  

  protected actionsForSuccess(resource: T): void {
    toastr.success("Solicitação processada com sucesso");

    const url = this.route.snapshot.parent.url[0].path;

    //redireciona para a pagina de ediçao para garantir um novo carregamento e limpeza das variaveis
    this.router.navigateByUrl(url, {skipLocationChange: true}).then(
      () => this.router.navigate([url, resource.id, 'edit'])
    )
  }

  protected actionsForError(error: any): void {
    toastr.error('Ocorreu um erro ao processar a sua requisição!');

    this.submittingForm = false;

    //utilizado para servidor remoto
    if(error.status === 422)
      this.serverErrorMessages = JSON.parse(error._body).errors;
    else
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor tente mais tarde!'];
  }
    
  protected abstract buildResourceForm(): void;  
}

