import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GestionVeterinariosPage } from './gestion-veterinarios.page';

const routes: Routes = [
  {
    path: '',
    component: GestionVeterinariosPage
  },
  {
    path: 'agregar-veterinario',
    loadChildren: () => import('./agregar-veterinario/agregar-veterinario.module').then( m => m.AgregarVeterinarioPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GestionVeterinariosPageRoutingModule {}
