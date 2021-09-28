import { OnInit, Directive } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseResourceModel } from "../../models/base-resource.model";
import { BaseResourceService } from "../../services/base-resource.service";

import toastr from "toastr";

@Directive()
export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources$: Observable<T[]>;

  constructor(protected resourceService: BaseResourceService<T>) {}

  ngOnInit() {
    //usado no firebase
    this.resources$ = this.resourceService.getAllFb();
  }

  deleteResource(resource: T){
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete)
      this.resourceService.deleteFb(resource.id).then(
        //sucesso
        () => toastr.success("Excluído com sucesso"),
        //erro
        () => toastr.error('Ocorreu um erro a realizar a exclusão!')
      );
  }
}
