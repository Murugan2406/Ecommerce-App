import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/main/main.module').then((mod) => mod.MainModule)
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {scrollPositionRestoration: 'disabled'}) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
