import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👈 Crucial para el chat input
import { IonicModule } from '@ionic/angular';

import { ChatAdminPageRoutingModule } from './chat-admin-routing.module';
import { ChatAdminPage } from './chat-admin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatAdminPageRoutingModule
  ],
  declarations: [ChatAdminPage]
})
export class ChatAdminPageModule {}