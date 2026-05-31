import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth'; // Importamos tu servicio

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {

  // Inyectamos el NavController y tu AuthService corporativo
  constructor(private navCtrl: NavController, private authService: AuthService) {}

  /**
   * Método para cerrar sesión, limpiar los datos locales y regresar al login
   */
  logout() {
    console.log('Cerrando sesión del cliente...');
    
    // 1. Limpiamos el rol de LocalStorage para regresar el estado a 'ninguno'
    this.authService.clearSession();
    
    // 2. Cambiamos la pantalla raíz destruyendo la barra inferior
    this.navCtrl.navigateRoot('/tabs/tab1');
  }
}