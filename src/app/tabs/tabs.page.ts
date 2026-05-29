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

  // Esta función leerá el rol directamente desde el servicio en tiempo real
  get rolUsuario(): string {
    return this.authService.getRol();
  }
}