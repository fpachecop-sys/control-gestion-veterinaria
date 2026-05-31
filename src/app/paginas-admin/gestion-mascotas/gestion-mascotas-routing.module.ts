import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionMascotasPage } from './gestion-mascotas.page';

const routes: Routes = [
  {
    path: '',
    component: GestionMascotasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionMascotasPageRoutingModule {}
