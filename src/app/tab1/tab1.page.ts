import { Component } from '@angular/core';
import { Router } from '@angular/router'; // 1. Importamos el Router para viajar entre pantallas
import { AuthService } from '../services/auth'; // 2. Importamos tu servicio con la ruta corregida

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  correo: string = '';
  contrasena: string = '';

  // 3. Inyectamos el Router y el AuthService dentro del constructor
  constructor(private router: Router, private authService: AuthService) {}

  ionViewWillEnter() {
    // Revisamos si el servicio tiene datos del registro reciente
    const datosRegistro = this.authService.obtenerCredencialesRegistro();
    
    if (datosRegistro.correo && datosRegistro.contrasena) {
      // Si existen datos, los pintamos automáticamente en los inputs de la pantalla
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
      this.authService.setRol('admin'); // Cambia la barra inferior a modo admin
      alert('¡Bienvenido Administrador!');
      this.router.navigate(['/tabs/tab4']); // Te manda al Home de Admin (Tab 4)
    } 
    // Validación para entrar como CLIENTE / FRANCO 
    else if (this.correo === 'franco@correo.com' && this.contrasena === 'franco123') {
      this.authService.setRol('cliente'); // Cambia la barra inferior a modo cliente
      alert('¡Hola Franco, bienvenido de vuelta!');
      this.router.navigate(['/tabs/tab3']); // Te manda a tus Acciones Rápidas (Tab 3)
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