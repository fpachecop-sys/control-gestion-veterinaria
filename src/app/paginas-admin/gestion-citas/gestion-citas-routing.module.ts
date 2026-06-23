import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionCitasPage } from './gestion-citas.page';

const routes: Routes = [
  {
    path: '',
    component: GestionCitasPage
  },
  {
    path: 'agregar-cita',
    loadChildren: () => import('./agregar-cita/agregar-cita.module').then( m => m.AgregarCitaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionCitasPageRoutingModule {}
