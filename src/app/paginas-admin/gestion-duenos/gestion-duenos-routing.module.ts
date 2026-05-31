import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionDuenosPage } from './gestion-duenos.page';

const routes: Routes = [
  {
    path: '',
    component: GestionDuenosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionDuenosPageRoutingModule {}
