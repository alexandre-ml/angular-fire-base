import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseResourceService } from "../../../shared/services/base-resource.service";
import { Entry } from "./entry.model";
import { CategoryService } from "../../categories/shared/category.service";

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

export class EntryService extends BaseResourceService<Entry> {

  constructor(injector: Injector, private categoryService: CategoryService) {
    super(injector, Entry.fromJson, 'entries');
  }
  
  create(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.createFb.bind(this));
  }

  update(entry: Entry): Observable<Entry>{
    return this.setCategoryAndSendToServer(entry, super.updateFb.bind(this));
  }
  
  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAllFb().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    )
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry>{
    return sendFn(entry); 
  }  

  private filterByMonthAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, "DD/MM/YYYY");
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = entryDate.year() == year;

      if(monthMatches && yearMatches) return entry;
    })
  }
}
