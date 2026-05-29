import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitarConsultaPage } from './solicitar-consulta.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitarConsultaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitarConsultaPageRoutingModule {}
