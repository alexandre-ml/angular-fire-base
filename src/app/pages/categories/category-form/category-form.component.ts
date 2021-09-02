import { Component, Injector } from '@angular/core';
import { Validators } from "@angular/forms";

import { BaseResourceFormComponent } from '../../../shared/component/base-resource-form/base-resource-form.component';

import { Category } from "../shared/category.model";
import { CategoryService } from "../shared/category.service";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<Category> {

  constructor(private categoryService: CategoryService, injector: Injector) {
    super(injector, new Category(), categoryService, Category.fromJson)
   }

  protected buildResourceForm() {
    this.resourceForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(3)]],
      description: [null]
    });
  }

  protected setTitleNew(){
    return 'Cadastrando Nova Categoria';
  }

  protected setTitleEdit(){
      const resourceName = this.resource.name || '';
      return 'Editando Categoria: ' + resourceName;
  }  
}

