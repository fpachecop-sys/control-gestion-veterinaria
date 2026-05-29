import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitarConsultaPageRoutingModule } from './solicitar-consulta-routing.module';

import { SolicitarConsultaPage } from './solicitar-consulta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitarConsultaPageRoutingModule
  ],
  declarations: [SolicitarConsultaPage]
})
export class SolicitarConsultaPageModule {}
