import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarVeterinarioPageRoutingModule } from './agregar-veterinario-routing.module';

import { AgregarVeterinarioPage } from './agregar-veterinario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarVeterinarioPageRoutingModule
  ],
  declarations: [AgregarVeterinarioPage]
})
export class AgregarVeterinarioPageModule {}
