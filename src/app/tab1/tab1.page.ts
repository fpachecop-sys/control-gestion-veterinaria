import { Component } from '@angular/core';
import { IonButton } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  
  correo: string = '';
  contrasena: string = '';

  constructor() {}

  iniciarSesion() {
    
    if (this.correo === '' || this.contrasena === '') {
      alert('Por favor, completa todos los campos.');
    } else {
      
      alert('Intentando ingresar con:\nCorreo: ' + this.correo + '\nContraseña: ' + this.contrasena);
     
    }
  }

  activarFaceID() {
    alert('Iniciando escaneo de Reconocimiento Facial...');
  }

  registrarCuenta(){
    alert('Intentando registrar Cuenta');
  }
  recuperarContrasena(){
    alert('se ha enviado un enlace de recuperacion a tu correo...')
  }
}
