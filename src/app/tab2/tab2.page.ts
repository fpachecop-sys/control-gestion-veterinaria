import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth'; 
import { ApiService } from '../services/api.service';

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
    private api: ApiService
  ) {}

  // 🔧 Filtra el DNI para permitir solo números mientras se escribe
  filtrarDni(event: any) {
    const valor = event.target.value || '';
    this.dni = valor.replace(/[^0-9]/g, '');
  }

  // 🔧 Filtra el Teléfono para permitir solo números mientras se escribe
  filtrarTelefono(event: any) {
    const valor = event.target.value || '';
    this.telefono = valor.replace(/[^0-9]/g, '');
  }

  registrarCuenta() {
    if (!this.nombreCompleto || !this.dni || !this.telefono || !this.correo || !this.contrasena || !this.confirmarContrasena) {
      alert('Por favor, completa todos los campos del formulario.');
      return;
    }

    // ✅ Validación de DNI: exactamente 8 dígitos numéricos
    if (!/^\d{8}$/.test(this.dni)) {
      alert('El DNI debe contener exactamente 8 números.');
      return;
    }

    // ✅ Validación de Teléfono: exactamente 9 dígitos numéricos
    if (!/^\d{9}$/.test(this.telefono)) {
      alert('El teléfono debe contener exactamente 9 números.');
      return;
    }

    // ✅ Validación de correo
    const correoValido = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.correo);
    if (!correoValido) {
      alert('Por favor, ingresa un correo electrónico válido.');
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

    const bodyRegistro = {
      nombre: this.nombreCompleto,
      dni: this.dni,
      telefono: this.telefono,
      correo: this.correo,
      contrasena: this.contrasena
    };

    this.api.registrarUsuario(bodyRegistro).subscribe({
      next: (res: any) => {
        alert(res.mensaje || 'Cuenta procesada con éxito');
        this.authService.guardarCredencialesRegistro(this.correo, this.contrasena);
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
        const mensajeError = err.error?.detail?.[0]?.msg || err.error?.error || 'Problemas con el servidor';
        alert('Error al registrar: ' + mensajeError);
      }
    });
  }
}