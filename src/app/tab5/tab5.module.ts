import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab5PageRoutingModule } from './tab5-routing.module';
import { Tab5Page } from './tab5.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab5PageRoutingModule,
    Tab5Page // <-- Ponlo aquí adentro
  ],
  declarations: [] // <-- ¡DEJA ESTO VACÍO! (Borra Tab5Page de aquí)
})
export class Tab5PageModule {}