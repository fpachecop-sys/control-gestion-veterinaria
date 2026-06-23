import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionDuenosPageRoutingModule } from './gestion-duenos-routing.module';

import { GestionDuenosPage } from './gestion-duenos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GestionDuenosPageRoutingModule,
    RouterModule
  ],
  declarations: [GestionDuenosPage]
})
export class GestionDuenosPageModule {}
