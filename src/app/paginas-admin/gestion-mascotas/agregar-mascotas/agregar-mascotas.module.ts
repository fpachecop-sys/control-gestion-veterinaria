import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarMascotasPageRoutingModule } from './agregar-mascotas-routing.module';

import { AgregarMascotasPage } from './agregar-mascotas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarMascotasPageRoutingModule
  ],
  declarations: [AgregarMascotasPage]
})
export class AgregarMascotasPageModule {}
