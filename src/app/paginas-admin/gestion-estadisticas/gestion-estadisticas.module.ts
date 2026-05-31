import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionEstadisticasPageRoutingModule } from './gestion-estadisticas-routing.module';

import { GestionEstadisticasPage } from './gestion-estadisticas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionEstadisticasPageRoutingModule
  ],
  declarations: [GestionEstadisticasPage]
})
export class GestionEstadisticasPageModule {}
