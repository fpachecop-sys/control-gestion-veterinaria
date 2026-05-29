import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerVeterinariosPageRoutingModule } from './ver-veterinarios-routing.module';

import { VerVeterinariosPage } from './ver-veterinarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerVeterinariosPageRoutingModule
  ],
  declarations: [VerVeterinariosPage]
})
export class VerVeterinariosPageModule {}
