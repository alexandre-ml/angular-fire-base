import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./core/auth/auth.module').then(m => m.AuthModule)},
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule)},
  { path: 'entries', loadChildren: () => import('./pages/entries/entries.module').then(m => m.EntriesModule)},
  { path: 'reports', loadChildren: () => import('./pages/reports/reports.module').then(m => m.ReportsModule)},
  { path: '', redirectTo: '/reports', pathMatch: 'full'},  
  { path: '**', loadChildren: () => import('./pages/page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
