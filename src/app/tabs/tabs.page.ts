import { Component } from '@angular/core';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: false,
})
export class TabsPage {

  constructor(private authService: AuthService) {}

  /**
   * Lee el rol directamente desde el LocalStorage a través del servicio
   */
  get rolUsuario(): string {
    return this.authService.getRol();
  }
}