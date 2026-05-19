import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Tab4PageRoutingModule } from './tab4-routing.module';

// 1. Deja la importación aquí arriba normal
import { Tab4Page } from './tab4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Tab4PageRoutingModule,
    Tab4Page // 2. ¡MUY IMPORTANTE! Ponlo aquí adentro de imports
  ],
  declarations: [] // 3. ¡DEJA ESTO TOTALMENTE VACÍO! (Borra Tab4Page de aquí)
})
export class Tab4PageModule {}