import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { GestionMascotasPageRoutingModule } from './gestion-mascotas-routing.module';

import { GestionMascotasPage } from './gestion-mascotas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionMascotasPageRoutingModule,
    RouterModule
  ],
  declarations: [GestionMascotasPage]
})
export class GestionMascotasPageModule {}
