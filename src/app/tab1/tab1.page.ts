import { Component } from '@angular/core';
import { NavController } from '@ionic/angular'; 
import { AuthService } from '../services/auth'; 
import { ApiService } from '../services/api.service'; // 🚀 Inyectamos tu servicio API

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
    private api: ApiService // 🚀 Declarado aquí
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

    // 1. Hardcodeo Seguro únicamente para el Administrador Global
    if (this.correo === 'admin@correo.com' && this.contrasena === 'admin123') {
      this.authService.setRol('admin');
      alert('¡Bienvenido Administrador!');
      this.navCtrl.navigateRoot('/tabs/tab4');
    } 
    // 2. Consulta Real a Base de Datos en la Nube para Clientes/Dueños
    else {
      this.api.loginUsuario(this.correo, this.contrasena).subscribe({
        next: (res: any) => {
          this.authService.setRol('cliente');
          
          // 💡 Guardamos el DNI o ID del cliente que devolvió MySQL en localStorage para filtrar sus citas en el Tab 3
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

  activarFaceID() { alert('Iniciando escaneo de Reconocimiento Facial...'); }
  recuperarContrasena() { alert('Se ha enviado un enlace de recuperación a tu correo...'); }
}