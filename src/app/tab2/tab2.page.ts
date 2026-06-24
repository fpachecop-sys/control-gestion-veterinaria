import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth'; 
import { ApiService } from '../services/api.service'; // 🚀 Inyectamos tu servicio API

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  nombreCompleto: string = '';
  dni: string = '';
  telefono: string = '';
  correo: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  aceptaTerminos: boolean = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private api: ApiService // 🚀 Declarado aquí
  ) {}

  registrarCuenta() {
    if (!this.nombreCompleto || !this.dni || !this.telefono || !this.correo || !this.contrasena || !this.confirmarContrasena) {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    if (this.contrasena !== this.confirmarContrasena) {
      alert('Las contraseñas no coinciden');
      return;
    } 

    if (!this.aceptaTerminos) {
      alert('Debes aceptar los Términos y Condiciones para completar el registro');
      return;
    }

    // 📦 Creamos el objeto para el Backend
    const bodyRegistro = {
      nombre: this.nombreCompleto,
      dni: this.dni,
      telefono: this.telefono,
      correo: this.correo,
      contrasena: this.contrasena
    };

    // 🚀 Consumo real del Endpoint Condicional
    this.api.registrarUsuario(bodyRegistro).subscribe({
      next: (res: any) => {
        alert(res.mensaje || 'Cuenta procesada con éxito');

        // Guardamos credenciales temporales para el autocompletado en el Login
        this.authService.guardarCredencialesRegistro(this.correo, this.contrasena);

        // Limpieza de campos
        this.nombreCompleto = '';
        this.dni = '';
        this.telefono = '';
        this.correo = '';
        this.contrasena = '';
        this.confirmarContrasena = '';
        this.aceptaTerminos = false;
        
        this.router.navigate(['/tabs/tab1']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar: ' + (err.error?.error || 'Problemas con el servidor'));
      }
    });
  }
}