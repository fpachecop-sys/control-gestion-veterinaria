import { Component } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular'; // 👈 Inyectamos LoadingController
import { AuthService } from '../services/auth'; 
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page {

  correo: string = '';
  contrasena: string = '';

  constructor(
    private navCtrl: NavController, 
    private authService: AuthService,
    private api: ApiService,
    private loadingCtrl: LoadingController // 👈 Declarado aquí
  ) {}

  ionViewWillEnter() {
    if (this.authService.getRol() !== 'ninguno') {
      this.authService.clearSession();
    }

    const datosRegistro = this.authService.obtenerCredencialesRegistro();
    if (datosRegistro.correo && datosRegistro.contrasena) {
      this.correo = datosRegistro.correo;
      this.contrasena = datosRegistro.contrasena;
    }
  }

  iniciarSesion() {
    if (!this.correo || !this.contrasena) {
      alert('Por favor, completa todos los campos.');
      return;
    } 

    if (this.correo === 'admin@correo.com' && this.contrasena === 'admin123') {
      this.authService.setRol('admin');
      alert('¡Bienvenido Administrador!');
      this.navCtrl.navigateRoot('/tabs/tab4');
    } 
    else {
      this.api.loginUsuario(this.correo, this.contrasena).subscribe({
        next: (res: any) => {
          this.authService.setRol('cliente');
          localStorage.setItem('dniClienteLogueado', res.usuario.dni);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));
          
          alert(`¡Hola ${res.usuario.nombre}, bienvenido de vuelta!`);
          this.navCtrl.navigateRoot('/tabs/tab3');
        },
        error: (err) => {
          console.error(err);
          alert(err.error?.error || 'Credenciales incorrectas o usuario no registrado.');
        }
      });
    }
  }

  // 🚀 PERFECCIÓN: Recuperación con indicador de carga asíncrono
  async recuperarContrasena() {
    let correoDestino = this.correo.trim();

    if (!correoDestino) {
      const promptCorreo = prompt("Por favor, ingresa tu correo electrónico registrado para enviarte tus nuevas credenciales:");
      if (promptCorreo) {
        correoDestino = promptCorreo.trim();
      } else {
        return; 
      }
    }

    // 1. Creamos y mostramos el Spinner de carga en la pantalla
    const loading = await this.loadingCtrl.create({
      message: 'Enviando clave temporal... Por favor, espera.',
      spinner: 'crescent'
    });
    await loading.present(); // Aquí la pantalla se congela para evitar múltiples clicks 🛡️

    // 2. Llamamos a la API
    this.api.recuperarContrasenaUsuario(correoDestino).subscribe({
      next: (res: any) => {
        loading.dismiss(); // 🔥 Quitamos el spinner inmediatamente al recibir respuesta
        alert(res.mensaje || 'Revisa tu bandeja de entrada o spam.');
      },
      error: (err) => {
        loading.dismiss(); 
        console.error(err);
        alert(err.error?.error || 'No se pudo procesar la solicitud de recuperación.');
      }
    });
  }
}