import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarVeterinarioPage } from './agregar-veterinario.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarVeterinarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarVeterinarioPageRoutingModule {}
