import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GestionVeterinariosPageRoutingModule } from './gestion-veterinarios-routing.module';

import { GestionVeterinariosPage } from './gestion-veterinarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionVeterinariosPageRoutingModule
  ],
  declarations: [GestionVeterinariosPage]
})
export class GestionVeterinariosPageModule {}
