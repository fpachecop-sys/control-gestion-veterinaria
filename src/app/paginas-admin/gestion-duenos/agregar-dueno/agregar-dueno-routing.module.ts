import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarDuenoPage } from './agregar-dueno.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarDuenoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarDuenoPageRoutingModule {}
