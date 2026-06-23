import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarMascotasPage } from './agregar-mascotas.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarMascotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarMascotasPageRoutingModule {}
