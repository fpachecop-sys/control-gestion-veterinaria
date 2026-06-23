import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarDuenoPageRoutingModule } from './agregar-dueno-routing.module';

import { AgregarDuenoPage } from './agregar-dueno.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarDuenoPageRoutingModule
  ],
  declarations: [AgregarDuenoPage]
})
export class AgregarDuenoPageModule {}
