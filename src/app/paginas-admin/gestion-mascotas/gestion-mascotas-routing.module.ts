import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionMascotasPage } from './gestion-mascotas.page';

const routes: Routes = [
  {
    path: '',
    component: GestionMascotasPage
  },
  {
    path: 'agregar-mascotas',
    loadChildren: () => import('./agregar-mascotas/agregar-mascotas.module').then( m => m.AgregarMascotasPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionMascotasPageRoutingModule {}
