import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionCitasPageRoutingModule } from './gestion-citas-routing.module';

import { GestionCitasPage } from './gestion-citas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionCitasPageRoutingModule,
    RouterModule
  ],
  declarations: [GestionCitasPage]
})
export class GestionCitasPageModule {}
