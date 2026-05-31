import { Component } from '@angular/core';
import { NavController } from '@ionic/angular'; // Cambiado Router por NavController para mayor fluidez en Ionic
import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  correo: string = '';
  contrasena: string = '';

  // Inyectamos NavController de Ionic y el AuthService
  constructor(private navCtrl: NavController, private authService: AuthService) {}

  ionViewWillEnter() {
    // Cada vez que entramos al login, nos aseguramos de que el rol esté en limpio si viene de un deslogueo
    // Esto garantiza que la barra de tabs permanezca oculta al 100%
    if (this.authService.getRol() !== 'ninguno') {
      this.authService.clearSession();
    }

    // Revisamos si el servicio tiene datos del registro reciente
    const datosRegistro = this.authService.obtenerCredencialesRegistro();
    if (datosRegistro.correo && datosRegistro.contrasena) {
      this.correo = datosRegistro.correo;
      this.contrasena = datosRegistro.contrasena;
    }
  }

  iniciarSesion() {
    if (this.correo === '' || this.contrasena === '') {
      alert('Por favor, completa todos los campos.');
    } 
    // Validación para entrar como ADMINISTRADOR 
    else if (this.correo === 'admin@correo.com' && this.contrasena === 'admin123') {
      this.authService.setRol('admin'); // Guarda el rol 'admin' de manera persistente en LocalStorage
      alert('¡Bienvenido Administrador!');
      this.navCtrl.navigateRoot('/tabs/tab4'); // navigateRoot limpia el historial y redibuja la barra de tabs del admin
    } 
    // Validación para entrar como CLIENTE
    else if (this.correo === 'franco@correo.com' && this.contrasena === 'franco123') {
      this.authService.setRol('cliente'); // Guarda el rol 'cliente' de manera persistente en LocalStorage
      alert('¡Hola Franco, bienvenido de vuelta!');
      this.navCtrl.navigateRoot('/tabs/tab3'); // navigateRoot limpia el historial y redibuja la barra de tabs del cliente
    } 
    // Si ponen cualquier otro dato
    else {
      alert('Usuario no reconocido. Prueba con:\n- franco@correo.com (franco123)\n- admin@correo.com (admin123)');
    }
  }

  activarFaceID() {
    alert('Iniciando escaneo de Reconocimiento Facial...');
  }

  registrarCuenta(){
    alert('Intentando registrar Cuenta');
  }

  recuperarContrasena(){
    alert('Se ha enviado un enlace de recuperación a tu correo...');
  }
}