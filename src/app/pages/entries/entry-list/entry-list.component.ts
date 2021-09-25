import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { BaseResourceListComponent } from '../../../shared/components/base-resource-list/base-resource-list.component';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent extends BaseResourceListComponent<Entry>{

  category$: Observable<Category[]>;

  constructor(protected entryService: EntryService, public categoryService: CategoryService) {
    super(entryService);
  }
}
