import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionEstadisticasPage } from './gestion-estadisticas.page';

const routes: Routes = [
  {
    path: '',
    component: GestionEstadisticasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionEstadisticasPageRoutingModule {}
