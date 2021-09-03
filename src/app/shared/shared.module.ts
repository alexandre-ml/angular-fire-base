import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BreadCrumbComponent } from './component/bread-crumb/bread-crumb.component';
import { PageHeaderComponent } from './component/page-header/page-header.component';

@NgModule({
  declarations: [BreadCrumbComponent, PageHeaderComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports:[
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    //components
    BreadCrumbComponent,
    PageHeaderComponent
  ]
})
export class SharedModule { }
