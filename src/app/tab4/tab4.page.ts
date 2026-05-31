import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth'; // Importamos tu servicio

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page {

  // Inyectamos el NavController y tu AuthService corporativo
  constructor(private navCtrl: NavController, private authService: AuthService) {}

  /**
   * Cierra la sesión del administrador, limpia los datos locales y regresa al login
   */
  logout() {
    console.log('Cerrando sesión del administrador...');
    
    // 1. Limpiamos el rol de LocalStorage para regresar el estado a 'ninguno'
    this.authService.clearSession();
    
    // 2. Cambiamos la pantalla raíz destruyendo la barra inferior
    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}