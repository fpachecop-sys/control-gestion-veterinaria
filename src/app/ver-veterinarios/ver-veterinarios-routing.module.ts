import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerVeterinariosPage } from './ver-veterinarios.page';

const routes: Routes = [
  {
    path: '',
    component: VerVeterinariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerVeterinariosPageRoutingModule {}
